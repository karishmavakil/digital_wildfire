
var key = "97a5ce54ae469563c4267cd097ad1d3965118c26";

var AlchemyAPI = require('alchemy-api');
var alchemyapi = new AlchemyAPI(key);

var myText = "Whoa, AlchemyAPI's Node.js SDK is really great, I can't wait to build my app!";

console.log("going");
console.log(myText);

alchemyapi.sentiment("myText", {}, function(err, response) {
	if (err) throw err;
	
	console.log(response);

	console.log("Sentiment: " + response["docSentiment"]["type"]);
	console.log();
});