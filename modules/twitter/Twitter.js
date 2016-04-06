//
// The Twitter interface.
//
Twitter = new function() {
	// Only support English for now.
	this.languages = {
		English: "en"
	};

	// Only support London for now.
	this.locations = {
		London: "51.507513,-0.127930,15mi"
	};
	// Yahoo! Where On Earth ID for locations.
	var woeid = {
		London: "44418"
	}

	// Search Twitter for tweets matching the search query - can return a
	// maximum of 100 tweets.
	//
	// Operands for the search query: (at the bottom of the file).
	//
	// searchTweets(query: Object, callback: function(error: Unknown, tweets:
	//		Array[Tweet], response: Unknown))
	// query: Object  as follows:
	// var query = function() {
	//   q: String (Mandatory) = search query of maximum 500 chars, including OPERANDS (defined above).
	//   geocode: String = "latitude,longitude,radius" - take from Twitter.locations.
	//   lang: String = language given by an ISO 639-1 code - take from Twitter.languages.
	//   result_type: String = popular | recent | mixed.
	//   feeling: String = positive | negative | question.
	//   count: Int = number of tweets returned (max 100).
	//   until: String = returns tweets created before given time (YYYY-MM-DD).
	//   since_id: Int = returns results with an ID greater than the specified ID.
	//   max_id: Int = returns results with an ID less than (or eq) the specified ID.
	// }
	// Example (all but q are optional):
	// var query = function() {
	//   q = "#LondonRiots"
	//   geocode = Twitter.locations.London;
	//   lang = Twitter.languages.English;
	//   result_type = "recent";
	//   feeling = "positive";
	//   count = 100;
	//   until = "2016-02-10";
	//   since_id = 12345;
	//   max_id = 54321;
	// }
	//
	this.searchTweets = function(query, callback) {
		if(query.hasOwnProperty('feeling')) {
			// Add feeling to the search query.
			switch(query.feeling) {
				case "positive": query.q += " :)"; break; 
				case "negative": query.q += " :("; break; 
				case "question": query.q += " ?"; break; 
			}
			delete query.feeling;
		}

		// Make a request.
		connection_id = connection_id + 1;
		var local = connection_id;
		socket.emit('search_req', { data: query, connection_id: local });

		// Wait for the response.
		socket.on('search_res' + local, function(data) {
			var tweets = new Array();
			// Convert the data to Tweet objects.
			for(var i = 0; i < data.data.statuses.length; ++i)
				tweets[i] = toTweet(data.data.statuses[i]);

			callback(data.error, tweets, data.response);
		});
	};


	// Returns the top 50 trending topics for a specific WOEID, if trending
	// information is available for it (maximum 50).
	//
	// getTrends(location: Twitter.woeid, callback: function(error: Unknown, 
	//		tweets: Array[Trend], response: Unknown))
	this.getTrends = function(location, callback) {
		// TODO check for supported location.
		// Make a request.
		connection_id = connection_id + 1;
		var local = connection_id;
		socket.emit('trend_req', { data: woeid[location], connection_id: local });

		// Wait for the response.
		socket.on('trend_res' + local, function(data) {
			var trends = new Array();
			// Convert the data to Trend objects.
			for(var i = 0; i < data.data[0].trends.length; ++i)
				trends[i] = toTrend(data.data[0].trends[i]);

			// Filter invalid trends.
			// TODO: eliminate promoted results?
			// TODO: eliminate results with tweet_volume = 0?
			var filtered_trends = new Array();
			var k = 0;
			for(var i = 0; i < trends.length; ++i)
				if(trends[i].hasName())
					filtered_trends[k++] = trends[i];

			// Sort in decreasing order by tweet volume.
			var compare = function(a, b) {
				if(a.getTweetVolume() < b.getTweetVolume())
					return 1;
				return -1;
			}
			var sorted_trends = filtered_trends.sort(compare);

			callback(data.error, sorted_trends, data.response);
		});

	}


	// TODO:
	// Search Twitter for tweets matching the search query returning more than
	// 100 tweets.


	// Returns data given by our supervisers; the which parameter specifies
	// which data file to import:
	// 0 - "12.50-1.10.csv"
	// 1 - "13.20-13.40"
	// 2 - "14.10-14.30"
	// 3 - "14.40-15.00"
	// Node. This returns tweets that do not belong to the Tweet class, but to
	// the LimitedTweet class as they hold less data than a normal tweet.
	//
	// getImportedData(which: Int): Array[LimitedTweet]
	this.getImportedData = function(which) {
		var tweets = new Array();

		for(var i = 0; i < imported_data_from_super[which].length; ++i)
			tweets[i] = toLimitedTweet(imported_data_from_super[which][i]);

		return tweets;
	}


	// TODO?
	// Returns a collection of the most recent Tweets posted by the user 
	// indicated by the screen_name or user_id parameters.
	// GET statuses/user_timeline
};




// Further documentation:
//
// Operands for the search query:
//  watching now = containing both "watching" and "now".
//  "happy hour" = containing the exact phrase "happy hour".
//  love OR hate = containing either "love" or "hate" (or both).
//  beer -root = containing "beer", but not "root".
//  #haiku = containing the hashtag "haiku".
//  from:interior = sent from Twitter account "interior".
//  list:NASA/astronauts-in-space-now = sent from a Twitter account in the
//  	NASA list astronauts-in-space-now.
//  to:NASA = a Tweet authored in reply to Twitter account "NASA".
//  @NASA = mentioning Twitter account "NASA".
//  puppy filter:media = containing "puppy" and an image or video.
//  puppy filter:images = containing "puppy" and links identified as photos,
//  	including third parties such as Instagram.
//  hilarious filter:links = containing "hilarious" and linking to URL.
//  superhero since:2015-12-21 = containing "superhero" and sent since date
//		"2015-12-21" (year-month-day).
//  puppy until:2015-12-21 = containing "puppy" and sent before the date 
// 		"2015-12-21".
//  movie -scary :) = containing "movie", but not "scary", and with a
//  	positive attitude.
//  flight :( = containing "flight" and with a negative attitude.
//  traffic ? = containing "traffic" and asking a question.