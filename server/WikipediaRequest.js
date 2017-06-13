var WikipediaData = require("./wikipediaData.js");
var Util = require("./Util.js");

class WikipediaRequest {

	constructor() {}

	static getWikipediaQueryURL(thumbSize, nouns) { //size in px
		return encodeURI('/w/api.php?format=json&action=query&prop=extracts|pageimages&exintro=&titles=' + nouns + '&pithumbsize=' + thumbSize);
	}

	static getWikipediaPageURL(id) {
		return encodeURI('/w/api.php?action=query&prop=info&pageids=' + id + '&inprop=url&format=json');
	}

	// https://www.mediawiki.org/wiki/API:Main_page
	static getWikipediaInfos(nouns, res) {
		let options = {
			host: 'en.wikipedia.org',
			path: WikipediaRequest.getWikipediaQueryURL(500, nouns),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'GET',
			port: 443
		};
		let data;
		Util.httpRequest(options, WikipediaRequest.extractDataFromWikipedia, res);
	}

	// Parse the data from the json received from the Wikipedia
	static extractDataFromWikipedia(res, content) {
		let json = JSON.parse(content);
		if(typeof json.query.pages == 'undefined'){
			Util.sendResults(res, JSON.stringify({'error' : 'Nothing found'}));
			return;
		}
		let page = Object.keys(json.query.pages)[0];
		let p = json.query.pages[page];
		let data;
		if (typeof p.thumbnail != 'undefined' && typeof p.pageid != 'undefined')
			data = new WikipediaData(p.thumbnail.source, p.title, p.extract, p.pageid);
		else
			data = new WikipediaData('', '', '', '');
		Util.sendResults(res, JSON.stringify(data));
	}

	// Wikipedia API to open search
	// https://www.mediawiki.org/wiki/API:Opensearch
	static wikipediaSearch(str, res) {
		let options = {
			host: 'en.wikipedia.org',
			path: "/w/api.php?action=opensearch&search=" + str + "&limit=10",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'GET',
			port: 443
		};
		let data;
		Util.httpRequest(options, WikipediaRequest.extractDataFromOpenSearch, res);
	}


	static extractDataFromOpenSearch(res, content) {
		let json = JSON.parse(content);
		/* SMTH TO DO PERHAPS */
		Util.sendResults(res, JSON.stringify(json));
	}

	static wikipediaPageURL(id, res) {
		let options = {
			host: 'en.wikipedia.org',
			path: WikipediaRequest.getWikipediaPageURL(id),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'GET',
			port: 443
		};
		let data;
		Util.httpRequest(options, WikipediaRequest.extractDataFromWikipediaPageURL, res);
	}

	static extractDataFromWikipediaPageURL(res, content) {
		let json = JSON.parse(content);
		if(typeof json.query == 'undefined'){
			Util.sendResults(res, JSON.stringify({'error' : 'No data'}));
			return;
		}
		let page = Object.keys(json.query.pages)[0];
		let p = json.query.pages[page];
		if(typeof p.fullurl == 'undefined'){
			Util.sendResults(res, JSON.stringify({'error' : 'No data'}));
			return;
		}
		Util.sendResults(res, JSON.stringify({'URL' : p.fullurl}));
	}
}

module.exports = WikipediaRequest;
