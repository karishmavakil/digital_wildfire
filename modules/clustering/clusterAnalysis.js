
//returns an array with 'number' most occurring strings from array 'a'
//if there are less than 'number' strings, the remaining entries in the
// returned array are all the empty string.
function modeCalc(a, number) {
 
	function clusterCount(entity, count) {
		this.ent = entity;
		this.val = count;
	}
	compareCount = function( entity1, entity2)  {
    var ans = 0;
    if (entity1 != undefined && entity2 != undefined)
		  ans = (entity2.val - entity1.val);
    return ans;
	}
	var maxOrder = new PriorityQueue({comparator : compareCount});

    
  var counter = {};    
  for (var i in a) {
    if (!(a[i] in counter)) {
        counter[a[i]] = 0;
        console.log(a[i] + " put in counter");
    }
    counter[a[i]]++;
 	}
 	var done = {};
 	for (var i in a) {
 		if (!(a[i] in done)) {
      var k = new clusterCount(a[i],counter[a[i]]);
      console.log(" " + k.val);
 			maxOrder.queue(k);
 			done[a[i]] = 1;
      console.log(a[i] + " done")
 		}
 	}
 	var ans = [];
 	for (i =0 ; i < number; i++ ) {
    ans[i] = "";
    try {
 	    var answer = maxOrder.dequeue();
      ans[i]= answer.ent;
    }
    catch(err) {}
 	}
  return ans;  

}
//TODO: check it works^^


//cluster is an array of tweets
//clusters is an array of clusters
// to find 3 most common entitities
// entitiesCluster(array of tweets, sentiment data) : [String]
function entitiesCluster(cluster,sentiments) {
	var concatEntities = [];
	for (i = 0; i < cluster.length; i++) {
		var ent = cluster[i].entities;
		concatEntities = concatEntities.concat(ent);
	}
	var popular = modeCalc(concatEntities,3);
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
		return sentimentCluster(cluster,sentiments);
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
function mainfn(clusters, sentiments) {
	var clusterObjects = [];
	for (i = 0 ; i < clusters.length; i++) {
    var co = new toClusterObject(clusters[i],sentiments);
		clusterObjects.push(co);

	}
	return clusterObjects;
}

