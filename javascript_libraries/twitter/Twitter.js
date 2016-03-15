var TwitterAPI = require('twitter');

Twitter = {
	// A client connected to the Twitter API.
	client: new TwitterAPI({
	  consumer_key: 'RmJ3oLFcxmbUnXnWr0hK4HduL',
	  consumer_secret: 'dxq6EZSYYIi16bRxQe3xykUwdIjr7xTunl1sZHmGAycQmizwPT',
	  access_token_key: '4919214645-KfdrJKSdzNk2CKJRnW5hjuzVXPf8wCiPWTtZqSL',
	  access_token_secret: 'GthrWFZROFDsf4WfSObrVRUQW01urjZxircf4PfgL6ZzU'
	}),

	searchTweets: function(query, callback) {
		Twitter.client.get('search/tweets', {q: query}, callback);
	}
};