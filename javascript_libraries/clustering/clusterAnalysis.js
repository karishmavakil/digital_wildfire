

// using assumption that the sentiment data contains an array of entities and a sentiment score)


//cluster is an array of tweets, clusters is an array of clusters

// finds 3 most occurring strings in an array of strings
function modeCalc(a) {
    var counter = {};
    var mode1 = "";
    var mode2 = "";
    var mode3 = "";
    var max1 = 0;
    var max2 = 0;
    var max3 = 0;
    for (var i in a) {
        if (!(a[i] in counter))
            counter[a[i]] = 0;
        counter[a[i]]++;
 
        if (counter[a[i]] >= max1) 
        {
            if (a[i] != mode1) {
            	mode3 = mode2;
        		max3 = max2;
        		mode2 = mode1;
        		max2 = max1;
        		mode1 = a[i];
        		max1 = counter[a[i]];
        	}
        	else {
        		max1 = counter[a[i]]
        	}
        }
        else if (counter[a[i]] >= max2)
        {	
        	if (a[i] != mode2){
        		mode3 = mode2;
        		mox3 = max2;
        		mode2 = a[i];
        		max2 = counter[a[i]];
        	}
        	else {
        		max2 = counter[a[i]]
        	}
        }
        else if (counter[a[i]] > max3) {
            mode3 = a[i];
            max3 = counter[a[i]];
            
        }
    }
    var ans = [mode1,mode2,mode3]
    return ans; 
}
//TODO: check it works^^



// to find 3 most common entitities
// entitiesCluster(array of tweets, sentiment data) : [String]
function entitiesCluster(cluster,sentiments) {
	var concatEntities = [];
	for (i = 0; i < cluster.length; i++) {
		var ent = cluster[i].entities;
		concatEntities = concatEntities.concat(ent);
	}
	var popular = modeCalc(concatEntities);
	return popular;
}

//  returns array of tweets that have all three keywords found by entitiesCluster
function relevantTweetsCluster(cluster,sentiments) {
	var entitiesMain = entitiesCluster(cluster,sentiments);
	var rel = [];
	for (i = 0 ; i < cluster.length; i++){
		var ent = cluster[i].entities;
		if (ent.contains(entitiesMain[0]) && ent.contains(entitiesMain[1]) && ent.contains(entitiesMain[2])) {
			rel.push(cluster[i]);
		}
	}
	return rel;
}
// returns average sentiment of the cluster calculated as the mean
function sentimentCluster(cluster,sentiments) {
	var sent = 0;
	for (i = 0; i< cluster.length; i++) {
		sent = sent + cluster[i].sentiment;
	}
	var avg = sent/(cluster.length);
	return avg;
}
//TODO: find a better way to calculate location?
// returns mean location of the cluster
function locationCluster(cluster,sentiments) {
	var sum = [0,0];
	var hasloc= 0;

	for (i = 0; i< cluster.length; i++) {
		if (cluster[i].hasLocation) {
			hasloc = hasloc + 1;
			sum[0] = sum[0] + cluster[i].getLocation[0];
			sum[1] = sum[1] + cluster[i].getLocation[1];
		}
	}
	var avg = [sum[0]/hasloc, sum[1]/hasloc];
	return avg;
}
// returns mean number of retweets of the cluster
function popularityCluster(cluster,sentiments) {
	var retweetcount= 0;
	for (i = 0; i< cluster.length; i++) {
		if (cluster[i].hasRetweetCount) {
			retweetcount = retweetcount + cluster[i].getRetweetCount;
		}
	}
	var avg = retweetcount/(cluster.length);
	return avg;
}
// adds methods to each cluster using methods above 
function toClusterObject(cluster,sentiments) {
	cluster.getEntities = function() {
		return entitiesCluster(cluster,sentiments);
	}

	cluster.getRelevantTweets = function() {
		return relevantTweetsCluster(cluster,sentiments);
	}

	cluster.getSentiment = function() {
		return sentimentsCluster(cluster,sentiments);
	}

	cluster.getPopularity = function() {
		return popularityCluster(cluster,sentiments);
	}

	cluster.getLocation = function() {
		return locationCluster(cluster,sentiments);
	}

	return cluster;


}
// takes an array of clusters and converts each cluster into a clusterObject
function mainfn(clusters,sentiments) {
	var clusterObjects = [];
	for (i = 0 ; i < clusters.length; i++) {
		clusterObjects.push(toClusterObject(clusters[i],sentiments));

	}
	return clusterObjects;
}

