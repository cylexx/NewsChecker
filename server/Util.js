var SourceJson = require("./sourceJson.js");
var https = require('https');


class Util {

	static sendResults(res, jsonRes) {
		res.header("Access-Control-Allow-Origin", "*");
		console.log(jsonRes);
		res.send(jsonRes);
	}

	static httpRequest(options, callback, response) {
		var req = https.request(options, function(res) {
			res.setEncoding('utf8');
			let content = '';
			res.on('data', function(chunk) {
				content += chunk;
			});
			res.on('end', function() {
				if (res.statusCode === 200 || res.statusCode === 204) {
					if (typeof callback === 'undefined')
						console.log(content);
					else
						callback(response, content);
				} else {
					console.log('Status:', res.statusCode);
					console.log(content);
				}
			});
		}).on('error', function(err) {});
		req.end()
	}

}

module.exports = Util;
