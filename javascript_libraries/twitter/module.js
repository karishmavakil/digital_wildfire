
var select_api = 3;

/*
if(select_api == 1) {
	//Callback functions
	var error = function (err, response, body) {
	    console.log('ERROR [%s]', err);
	};
	var success = function (data) {
	    console.log('Data [%s]', data);

	    document.getElementById("response").innerHTML = document.getElementById("response").innerHTML + data;
	};

	var Twitter = require('twitter-node-client').Twitter;

	//Get this data from your twitter apps dashboard
	var config = {
	    "consumerKey": "RmJ3oLFcxmbUnXnWr0hK4HduL",
	    "consumerSecret": "dxq6EZSYYIi16bRxQe3xykUwdIjr7xTunl1sZHmGAycQmizwPT",
	    "accessToken": "4919214645-KfdrJKSdzNk2CKJRnW5hjuzVXPf8wCiPWTtZqSL",
	    "accessTokenSecret": "GthrWFZROFDsf4WfSObrVRUQW01urjZxircf4PfgL6ZzU",
	    "callBackUrl": ""
	}

	var twitter = new Twitter(config);


	// twitter.getSearch({'q':'#haiku','count': 10}, error, success);

	twitter.getCustomStreamCall('/statuses/sample.json',{ }, error, success);
} else
if(select_api == 2) {

	var Stream = require('user-stream');
	var stream = new Stream({
	    consumer_key: 'RmJ3oLFcxmbUnXnWr0hK4HduL',
	    consumer_secret: 'dxq6EZSYYIi16bRxQe3xykUwdIjr7xTunl1sZHmGAycQmizwPT',
	    access_token_key: '4919214645-KfdrJKSdzNk2CKJRnW5hjuzVXPf8wCiPWTtZqSL',
	    access_token_secret: 'GthrWFZROFDsf4WfSObrVRUQW01urjZxircf4PfgL6ZzU'
	});

	//create stream
	stream.stream();

	//listen stream data
	stream.on('data', function(json) {
	  console.log(json);
	  document.getElementById("response").innerHTML = document.getElementById("response").innerHTML + json;
	});

} else
*/
if(select_api == 3) {

	var Twitter = require('twitter');

	var client = new Twitter({
	  consumer_key: 'RmJ3oLFcxmbUnXnWr0hK4HduL',
	  consumer_secret: 'dxq6EZSYYIi16bRxQe3xykUwdIjr7xTunl1sZHmGAycQmizwPT',
	  access_token_key: '4919214645-KfdrJKSdzNk2CKJRnW5hjuzVXPf8wCiPWTtZqSL',
	  access_token_secret: 'GthrWFZROFDsf4WfSObrVRUQW01urjZxircf4PfgL6ZzU'
	});

	var query_type = 2;

	if(query_type == 1) {

		client.stream('statuses/filter', {track: 'dog'}, function(stream) {
		  stream.on('data', function(tweet) {
		    console.log(tweet.text);
		    document.getElementById("response").innerHTML = "TWEET:<br><br>" + tweet.text + "<br><br><br><br><br>" + document.getElementById("response").innerHTML;
		  });
		 
		  stream.on('error', function(error) {
		    // throw error;
		    document.getElementById("response").innerHTML = "Error on stream.";
		  });
		});

	} else if (query_type == 2) {

		client.get('search/tweets', {q: 'pusheen'}, function(error, tweets, response){
		   console.log(tweets);

		   jsonStr = JSON.stringify(tweets),  // THE OBJECT STRINGIFIED
		    regeStr = '', // A EMPTY STRING TO EVENTUALLY HOLD THE FORMATTED STRINGIFIED OBJECT
		    f = {
		            brace: 0
		        }; // AN OBJECT FOR TRACKING INCREMENTS/DECREMENTS,
		           // IN PARTICULAR CURLY BRACES (OTHER PROPERTIES COULD BE ADDED)

			regeStr = jsonStr.replace(/({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g, function (m, p1) {
			var rtnFn = function() {
			        return '<div style="text-indent: ' + (f['brace'] * 20) + 'px;">' + p1 + '</div>';
			    },
			    rtnStr = 0;
			    if (p1.lastIndexOf('{') === (p1.length - 1)) {
			        rtnStr = rtnFn();
			        f['brace'] += 1;
			    } else if (p1.indexOf('}') === 0) {
			         f['brace'] -= 1;
			        rtnStr = rtnFn();
			    } else {
			        rtnStr = rtnFn();
			    }
			    return rtnStr;
			});

			// document.body.innerHTML += regeStr; // appends the result to the body of the HTML document



		   document.getElementById("response").innerHTML = regeStr
		});

	} else if(query_type == 3) {

		client.stream('statuses/sample', {}, function(stream) {
		  stream.on('data', function(tweet) {
		    console.log(tweet.text);
		    document.getElementById("response").innerHTML = "TWEET:<br><br>" + tweet.text + "<br><br><br><br><br>" + document.getElementById("response").innerHTML;
		  });
		 
		  stream.on('error', function(error) {
		    // throw error;
		    document.getElementById("response").innerHTML = "Error on stream.";
		  });
		});

	} else if(query_type == 4) {

		client.get('statuses/retweets/:id', {id: 700714993105264600}, function(error, tweets, response){
		   // console.log(tweets);
		   document.getElementById("response").innerHTML = JSON.stringify(tweets, null, '\t');
		});

	}

}