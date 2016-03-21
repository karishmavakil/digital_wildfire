// The main part of the clustering operation of the tweets. takes an aray of tweets (tweets), and the sentiment data from AlchAPI (in whatever for that comes) (sentiments), and returns an array of array of tweets, with each sub array being a cluster.

// vectorise take a tweet and vectorises it over the 20 words chosen by the tweetChooser, including the sentiment in the scaling
function vectorise(tweet, words, sentiments){
    var v = [];
    for (i = 0; i <20; i++){
        v[i] = 0;
        if(tweet.getText.toLowerCase.prototype.includes(word[i])){
            v[i] = tweet.sentiment(words[i])
        };
    };
    return v;
};


// difference takes 2 tweets, which have been vectorised, and calculates the dot product difference between the 2
function similarity(tweet1, tweet2){
    var total = 0.0;
    for (i = 0; i<20; i++){
        total += tweet1.vector[i]*tweet2.vector[i]
    };
    return total;
};

// tweetChooser takes all the tweets and sentiment data, and picks out the 20 best words to find tweets from using the most common word occurences, and then chooses 200 tweets from the data to try and represent the whole sample as best as possible including the sentiment of the tweets on the terms. so it returns: object with 2 parameters, words: array size 20 of string with all the words chosen to cover (all lowercase), and tweets: Array size 200 of tweets chosen
function tweetChooser(tweets, sentiments){
    
};


// hardClustering takes clusters tweets chosen over a vector space of words provided (both parameters of the object returned by tweetChooser), but as it's O(n^3) time we only do it on a small covering sample of all the tweets, and then use the clusters generated as the base clusters for the rest of the tweets to be attached to. returns an array of 15 cluster objects, with 2 parameters: tweets, an array of tweets; and centroid, the calculated centre of each cluster over the vector space of chosen words.
function hardClustering(chosen, sentiments){
    var similarities = [[]];
    val words = chosen.words;
    var maxOrder = new PriorityQueue(); // TODO makecomparator function  so values are maximum?
    for (i=0; i < 200; i++) {
        chosen.tweets[i].vector = vectorise(chosen.tweets[i], words)
    };
    
    for (i=0; i < 200; i++) {
        for (j=0; j < 200; j++) {
            similarities[i][j]= similarity(chosen.tweets[i], chosen.tweets[j])
            // TODO: make value object constrcutor for: maxOrder.queue(i,j,differences[i][j])
        };
    };
    //TODOTODOTODOTODOTODO TODO
    
};

// easyClustering takes an array of array of tweets with each sub array being a cluster, and takes the rest of the tweets to be clustered, as well as teh words over which the clustering is being done. it returns an array of array of tweets, with each sub array being a cluster, with all the tweets now in one of the clusters.
function easyClustering(tweetClusters, tweets, sentiments, words){
    for (i=0; i< tweets.length(); i++){
        tweets[i] = vectorise(tweets[i], words, sentiments)
        var max = 0
        for (j=0; j++; j<15){
            if(difference(tweets[i].vector, tweetClusters[j].centroid > max)){
                max = j;
            }
        }
        tweetClusters[j].tweets.push(tweets[i]);
    }
    // could possible calculate overall centroids here and then possibly merge very similar clusters, but if not:
    val clusters = [];
    for (i =0; i<15; i++){
        clusters[i] = tweetsClusters[i].tweets;
    }
};

function mainClustering(tweets, sentiments){
    val chosen = tweetChooser(tweets, sentiments);
    val smallClusters = hardClustering(chosen, sentiments);
    val totalClusters = easyClustering(smallClusters, tweets, sentiments, words);
    
    return totalClusters;
};