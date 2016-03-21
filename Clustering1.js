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
//TODODOD

// hardClustering takes tweets chosen over a vector space of words provided (both parameters of the object returned by tweetChooser), but as it's O(log(n)n^2) time we only do it on a small covering sample of all the tweets, and then use the clusters generated as the base clusters for the rest of the tweets to be attached to. returns an array of 15 cluster objects, with 2 parameters: tweets, an array of tweets; and centroid, the calculated centre of each cluster over the vector space of chosen words.
function hardClustering(chosen, sentiments){
    val words = chosen.words;
    // compareNumbers :: diffValue, diffValue => Number
    var compareNumbers = function(a, b) { return (b.value - a.value) };
    // diffvalue :: number, number, number => diffValue
    function diffValue(diff, xco, yco){
        this.value = diff;
        this.x = xco;
        this.y = yco;
    };
    var maxOrder = new PriorityQueue( { comparator : compareNumbers } );
    
    // vectorises all the tweets
    for (i=0; i < 200; i++) {
        chosen.tweets[i].vector = vectorise(chosen.tweets[i], words)
    };
    
    // inserts each possible difference between 2 points into the priority queeue as an object with coordinates and and value of the difference
    for (i=0; i < 200; i++) {
        for (j=0; j < 200; j++) {
            maxOrder.queue(diffValue(similarity(chosen.tweets[i], chosen.tweets[j]), i, j));
        };
        
    };
    
    // clusters is the array of arrays of tweet ids which will be the finished prooduct; clustersLocation is an array saying which cluster each tweet is in (initially -1); clusterCount is the amoutn of clusters (abstractally imagining every tweet initially as a cluster); clusterPace is a stack of locations where new clusters can be put in the clusters array.
    var clusters = [[]], clusterLocations = new Array(200), clusterCount = 200, clusterPlace = new Array(200);
    for (i=0; i < 200; i++){
        clusterLocations[i] = -1;
        clusterPlace.push(199-i);
    }; // initialising the arrays
    
    // the main clustering operation is performed here
    while(clusterCount > 15){
        val v = maxOrder.dequeue;
        if (v.x == v.y){ // if it's a difference bwteen the same element ignore it
        } else if((clusterLocations[v.x] == -1) && (clusterLocations[v.y] = -1)){// if neither tweet is in a cluster then make a new cluster with just those 2 tweets in
            place = clusterPlace.pop()
            clusterLocations[v.x] = place;
            clusterLocations[v.y] = place;
            clusters[place] = [v.x, v.y];
            clusterCount -=1;
        } else if(clusterLocations[v.x] == -1){ // if one of the tweets is in a cluster add teh other to it
            clusterLocations[v.x] = clusterLocations[v.y];
            clusters[clusterLocations[v.y]].push(v.x);
            clusterCount -= 1;
        } else if(clusterLocations[v.y] == -1){ // as above
            clusterLocations[v.y] = clusterLocations[v.x];
            clusters[clusterLocations[v.x]].push(v.y);
            clusterCount -= 1;
        } else { // find the cluster with the small size (for efficiency) then add that cluster to the other one
            if(clusters[clusterLocations[v.y]].length > clusters[clusterLocations[v.x]].length){
                for (tweetId in clusters[clusterLocations[v.x]]){
                    clusters[clusterLocations[v.y]].push(tweetId);
                    clusterLocations[tweetId] = clusterLocations[v.y];
                }
                clusterPlace.push(clusterLocations[v.x]);
                clusters[clusterLocations[v.x]] = [] // clears the array so we know there's no cluster there
            } else {
                for (tweetId in clusters[clusterLocations[v.y]]){
                    clusters[clusterLocations[v.x]].push(tweetId);
                    clusterLocations[v.y] = clusterLocations[v.x];
                }
                clusterPlace.push(clusterLocations[v.y]);
                clusters[clusterLocations[v.y]] = [] // clears the array so we know there's no cluster there
            };
        };
    };
    //todo: check this works properly?????
    //todo:finishmethod by constructing object with actual tweets and words
};
//TODODO

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
//TODO: generalise hard and easy clustering to not specific boundarie (just for cleverness)