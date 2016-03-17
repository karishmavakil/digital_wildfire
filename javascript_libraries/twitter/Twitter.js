var TwitterAPI = require('twitter');

Twitter = new function() {
	// A client connected to the Twitter API.
	var client = new TwitterAPI({
	  consumer_key: 'RmJ3oLFcxmbUnXnWr0hK4HduL',
	  consumer_secret: 'dxq6EZSYYIi16bRxQe3xykUwdIjr7xTunl1sZHmGAycQmizwPT',
	  access_token_key: '4919214645-KfdrJKSdzNk2CKJRnW5hjuzVXPf8wCiPWTtZqSL',
	  access_token_secret: 'GthrWFZROFDsf4WfSObrVRUQW01urjZxircf4PfgL6ZzU'
	});

	// Only support english for now.
	this.languages = {
		English: "en"
	};

	// Only support London for now.
	this.locations = {
		London: "51.507513,-0.127930,20km"
	};

	// Search Tweets.
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
		
		// Make the API call.
		client.get('search/tweets',
			query, 
			function(error, data, response) {
				var tweets = new Array();
				// Convert the data to Tweet objects.
				for(var i = 0; i < data.statuses.length; ++i)
					tweets[i] = toTweet(data.statuses[i]);

				callback(error, tweets, response);
			}
		);
	};
};





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