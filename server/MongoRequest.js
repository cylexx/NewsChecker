var Util = require('./Util.js');
var SourceJson = require("./sourceJson.js");
var QueryMongoAPI = require('./QueryMongoAPI.js');
var mongojs = require('mongojs');
var db = mongojs('mongodb://127.0.0.1:27017/NewsChecker', ['tweet']);
var mapreduce = require('mapred');
var tcom = require('thesaurus-com');
const fs = require('fs');

/**
* Class which prepare request with the words send
* Make the request on MongodDB
* Score each source and make a globalScore
* Send the results in a JSON
*/
class MongoRequest {

	constructor() {}

	/**
	* Prepare the query for the mongo request with all words gets
	*/
	prepareRequest(res, classify) {
		var canEnter = this.verifyEnoughtWord(classify);
		if (canEnter) {
			var finalQuery = new QueryMongoAPI();
			var nouns = classify.nouns;
			if (nouns.length > 0) {
				var queryNouns = new QueryMongoAPI();
				finalQuery.query = finalQuery.query.concat(queryNouns.concatSynonym(nouns));
			}

			var verbs = classify.verbs;
			if (verbs.length > 0) {
				var queryVerbs = new QueryMongoAPI();
				finalQuery.query = finalQuery.query.concat(queryVerbs.concatSynonym(verbs));
			}

			var adjectives = classify.adjectives;
			if (adjectives.length > 0) {
				var queryAdjectives = new QueryMongoAPI();
				finalQuery.query = finalQuery.query.concat(queryAdjectives.concatSynonym(adjectives));
			}
			finalQuery.and();
			this.mongoRequest(res, finalQuery.query, classify);

		} else {
			Util.sendResults(res, JSON.stringify({'error' : 'Need more words'}));
		}

	}

	/**
	* Verify is there is enought words to start a request
	*/
	verifyEnoughtWord(classify) {
		if (classify.nouns[0] != null && (classify.verbs[0] != null || classify.adjectives[0] != null)) {
			return true;
		} else {
			if (classify.nouns.length > 1) {
				for (var i = 0; i < classify.nouns.length; i++) {
					if (tcom.search(classify.nouns[i]).synonyms.length > 5) {
						return true;
					}
				}
			}
		}
		return false;

	}

	/**
	* Make the mongo request with the query generated
	*/
	mongoRequest(res, query, classify) {
		db.tweet.aggregate([{
			$match: query
		}], function(err, result) {
			MongoRequest.readFileSources(res, classify, JSON.stringify({
				result
			}));
		});
	}

	/**
	* Prepare the JSON to send it
	* Mke an other request if he found nothing with the first one
	*/
	static generateJSON(res, classify, json, jsonSources) {
		var sources = MongoRequest.formatsAllSources(json, classify, false, jsonSources);
		if (sources[0] != null) {
			let score = MongoRequest.computeGlobalScore(sources);

			Util.sendResults(res, JSON.stringify({
				globalScore: score,
				sources
			}));
		}
		// If we found nothing, we make a request a request with only the nouns
		else {
			var nouns = classify.nouns;
			var queryNouns = new QueryMongoAPI();
			queryNouns.concatSynonym(nouns);
			queryNouns.and();
			var query = queryNouns.query;

			db.tweet.aggregate([{
				$match: query
			}], function(err, result) {
				var json = JSON.stringify({
					result
				});
				var sources;
				if (json != "{}") {
					sources = MongoRequest.formatsAllSources(json, classify, true, null);
				}
				if (sources != null) {
					Util.sendResults(res, JSON.stringify({
						globalScore: -1,
						sources
					}));
				} else {
					Util.sendResults(res, JSON.stringify({'error' : 'Nothing found'}));
				}
			});
		}

	}

	/**
	* Compute the global score with the score of each sources.
	*/
	static computeGlobalScore(sources){
		let scoreSources = 0;
		for (var i = 0; i < sources.length; i++) {
			scoreSources += sources[i].score;
		}

		scoreSources = scoreSources / (sources.length);

		let scoreNbsources = 0;
		if (sources.length >= 10) {
			scoreNbsources = 100;
		} else {
			scoreNbsources = sources.length * 10;
		}

		let score = scoreSources * 0.7 + scoreNbsources * 0.3;
		return score;
	}

	/**
	* Format all sources found before sending the results
	* Compute the score of each source if there is the first request
	*/
	static formatsAllSources(json, classify, secondTime, jsonSources) {
		var sources = [];
		json = JSON.parse(json);
		for (var i = 0; i < json.result.length; i++) {
			let authorId = json.result[i].authorId;
			let text = json.result[i].text;
			let url = "";
			if (json.result[i].url != null) {
				url = 'http://' + json.result[i].url;
			}
			let img = "";
			if (json.result[i].img != null) {
				img = json.result[i].img;
			}
			let name = json.result[i].name;
			let score = -1;
			if (!secondTime) {
				score = MongoRequest.computeScoreSource(name, text, jsonSources, classify);
			}
			let source = new SourceJson(authorId, name, url, text, img, json.result[i].date, score);
			sources.push(source);
		}
		sources = (sources.sort(function(a, b) {
		    return (b.score) - (a.score);
		}));

		return sources;
	}

	/**
	* Compute the score of each source
	*/
	static computeScoreSource(name, text, jsonSources, classify){
		let markAuthor = MongoRequest.getMarkFromAuthor(name, jsonSources);
		let nbMissingWords = 0;

		var nouns = classify.nouns;
		nbMissingWords += MongoRequest.countWordsMissingInArray(nouns, text);
		var verbs = classify.verbs;
		nbMissingWords += MongoRequest.countWordsMissingInArray(verbs, text);
		var adjectives = classify.adjectives;
		nbMissingWords += MongoRequest.countWordsMissingInArray(adjectives, text);

		let nbWords = nouns.length + verbs.length + adjectives.length;
		let score = markAuthor * 0.7 + ((1 - (nbMissingWords / nbWords)) * 100) * 0.3;
		return score;
	}

	/**
	* Count nb words are missing in a string
	*/
	static countWordsMissingInArray(arr, text) {
		let count = 0;
		for (var j = 0; j < arr.length; j++) {
			if (text.match('(^| )' + arr[j] + "( |'|$).*") == null) {
				count++;
			}
		}
		return count;
	}

	/**
	* Get all sources in the file of sources to calcul the score of each source
	*/
	static readFileSources(res, classify, json) {
		fs.readFile('../sources/sources.json', 'utf8', (err, data) => {
			if (err) throw err;
			let jsonSources = JSON.parse(data);
			MongoRequest.generateJSON(res, classify, json, jsonSources);
		});
	}

	/**
	* Get the score of a  specified author
	*/
	static getMarkFromAuthor(source, jsonSources) {
		for (var i = 0; i < jsonSources.length; i++) {
			let item = jsonSources[i];
			if (item.name == source) {
				return item.mark;
			}
		}
		return 50;
	}
}

module.exports = MongoRequest;
