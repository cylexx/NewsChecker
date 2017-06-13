var express = require('express');
var session = require('client-sessions');
var speak = require("speakeasy-nlp");
var jsonObj = new Object();
var app = express();

var MongoRequest = require("./MongoRequest.js");
var WikipediaRequest = require("./WikipediaRequest.js");
var Util = require("./Util.js");
var IdentifierService = require("./identifierService.js")

process.name ='server-app';

/**
* The server listen on 8080 port
*/
app.listen(8080, function() {
	console.log('NewsChecker server running <3 8080');
});

/**
* Get the information of the client
*/
app.get('/sendString', function(req, res) {
	console.log("Requete sur : " + req.query.str);
	tokenisation(req.query.str, res);
});

/**
* Make classification of the sentence and send it to make the request
*/
function tokenisation(req, res) {
	var classify = speak.classify(req);
	console.log(classify);
	var mongoRequest = new MongoRequest();
	mongoRequest.prepareRequest(res, classify);
}

/**
* Get the wikipedia page of a given nouns if it exists
*/
app.get('/searchWiki', function(req, res) { //Only for debug
	console.log("Requete sur : " + req.query.str);
	WikipediaRequest.getWikipediaInfos(req.query.str, res);
});

/**
* Auto completion
*/
app.get('/openSearchWiki', function(req, res) { //Only for debug
	console.log("Requete sur : " + req.query.str);
	WikipediaRequest.wikipediaSearch(req.query.str, res);
});


/**
* Get an URL of a page id
*/

app.get('/wikiURL', function(req, res) { //Only for debug
	console.log("Requete sur : " + req.query.id);
	WikipediaRequest.wikipediaPageURL(req.query.id, res);
});

/**
* Add a new account in the file of account followed
*/
app.get('/addAccount', function(req, res) {
	if(req.query.id==undefined || req.query.name==undefined || req.query.reliable==undefined)
		res.send(JSON.stringify("field is missing"));
	else
		IdentifierService.add(req.query.id, req.query.name, req.query.reliable, res);
});

/**
* Get a feedback on a given source to say if it is reliable or not
*/
app.get('/feedback', function(req, res) {
	IdentifierService.feedback(req.query.source, req.query.opinion, res);
});

/**
* Print the file of all account followed
*/
app.get('/printAccounts', function(req, res){
	IdentifierService.print(res);
});
