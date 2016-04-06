//
// Import.
//
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var TwitterAPI = require('twitter');


//
// Redirect file requests.
//
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.use("/style", express.static(__dirname + '/style'));
app.use("/bootstrap", express.static(__dirname + '/bootstrap'));
app.use("/modules", express.static(__dirname + '/modules'));


//
// Sockets.
//
io.on('connection', function(socket) {
	//
	// Twitter.
	//
	// Search page request.
	socket.on('search_req', function(data) {
		var input = data.data;
		var connection_id = data.connection_id;

		var callback = function(output) {
			io.emit('search_res' + connection_id, output);
		}

		Twitter.searchTweets(input, callback);
	});

	// Trends page request.
	socket.on('trend_req', function(data) {
		var input = data.data;
		var connection_id = data.connection_id;

		var callback = function(output) {
			io.emit('trend_res' + connection_id, output);
		}

		Twitter.getTrends(input, callback);
	});

	//
	// Alchemy API.
	//
});


//
// The server.
//
// The port to listen to.
var port = Number(process.env.PORT || 3000); 

// Listen.
http.listen(port, function(){
	console.log('listening on http:\\\\localhost:' + port);
});


//
// Libraries.
//
// Twitter interface.
Twitter = new function() {
	// A client connected to the Twitter API.
	var client = null;

	// Create a client if there is none.
	var connect = function() {
		if(client === null)
			client = new TwitterAPI({
				consumer_key: 'RmJ3oLFcxmbUnXnWr0hK4HduL',
				consumer_secret: 'dxq6EZSYYIi16bRxQe3xykUwdIjr7xTunl1sZHmGAycQmizwPT',
				access_token_key: '4919214645-KfdrJKSdzNk2CKJRnW5hjuzVXPf8wCiPWTtZqSL',
				access_token_secret: 'GthrWFZROFDsf4WfSObrVRUQW01urjZxircf4PfgL6ZzU'
			});
	}

	// searchTweets(query: Object, callback: function({error: Unknown, tweets:
	//		Array[Tweet], response: Unknown }))
	this.searchTweets = function(query, callback) {
		connect();

		// Make the API call.
		client.get('search/tweets',
			query, 
			function(error, data, response) {
				callback({error: error, data: data, response: response });
			}
		);
	};

	// getTrends(location: Twitter.woeid, callback: function({error: Unknown, 
	//		tweets: Array[Trend], response: Unknown}))
	this.getTrends = function(location, callback) {
		connect();

		// Make the API call.
		client.get(
			'trends/place', 
			{ id: location },
			function(error, data, response) {
				callback({error: error, data: data, response: response });
			}
		);
	}
};
