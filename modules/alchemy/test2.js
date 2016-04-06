

$.ajax({
  method: "GET",
  url: "https://api.twitter.com/1.1/search/tweets.json?q=cat",
	dataType: 'jsonp',
  // data: { name: "John", location: "Boston" }
})
  .done(function( msg ) {
    console.log(msg);
  });