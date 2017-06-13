var tcom = require('thesaurus-com');

/**
* API to make query for mongoDB request
*/
class QueryMongoAPI {

	/**
	* this.query is null a the begining
	*/
	constructor() {
		this.query = [];
	}

	/**
	* Concat all the values in the array in the query
	*/
	concatAllArraysValue(arr) {
		for (var i = 0; i < arr.length; i++) {
			this.query = this.query.concat([{
				text: {
					$regex: '(^| )' + arr[i] + "( |'|$).*"
				}
			}]);
		}
	}

	/**
	* Concat all the values (-1 authorize) in the array in the query
	*/
	concatAllPossiblitiesMinus1(arr) {
		for (var idDontTake = 0; idDontTake < arr.length; idDontTake++) {
			var partialQuery = [];
			for (var i = 0; i < arr.length; i++) {
				if (i != idDontTake) {
					partialQuery = partialQuery.concat([{
						text: {
							$regex: '(^| )' + arr[i] + "( |'|$).*"
						}
					}]);
				}
			}
			partialQuery = {
				$and: partialQuery
			};
			this.query = this.query.concat([partialQuery]);
		}
	}

	/**
	* Concat  all the values in the array and take for each word th possible synonyms
	*/
	concatSynonym(arr) {
		var concatQueryOr = [];
		for (var i = 0; i < arr.length; i++) {
			var synonyms = tcom.search(arr[i]).synonyms;
			synonyms.push(arr[i]);
			this.concatAllArraysValue(synonyms);
			this.or();
			concatQueryOr = concatQueryOr.concat(this.query);
			this.query = [];
		}
		this.andExt(concatQueryOr);
		return this.query;
	}

	/**
	* Add and to an external query
	*/
	andExt(query) {
		this.query = {
			$and: query
		};
	}

	/**
	* Add or to an external query
	*/
	orExt(query) {
		this.query = {
			$or: query
		};
	}

	/**
	* Add and to the query
	*/
	and() {
		this.query = {
			$and: this.query
		};
	}

	/**
	* Add or to the query
	*/
	or() {
		this.query = {
			$or: this.query
		};
	}

}

module.exports = QueryMongoAPI;
