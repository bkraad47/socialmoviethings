import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
	
	var self=this;
    var user=this.get('firebaseApp').auth().currentUser.uid;
	//Get current user watchlist
    this.get('firebaseApp').database().ref('/watchlist/'+user+"/").once('value').then(function(snapshot) {
		  
		  //Check if user watchlist exists
		  if(snapshot.val()!=null){
		  
		  //Get omdb content for movie titles in model
		  for (var key in snapshot.val()) {
			    var http = new XMLHttpRequest();
				var xmlHttp = new XMLHttpRequest();
			    xmlHttp.onreadystatechange = function() { 
				if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
					
				  var resp=JSON.parse(xmlHttp.responseText);
			      //Generate the model record
				  self.store.createRecord('watchlist', {
				  imdbID: key,
				  poster: resp.Poster,
				  title: resp.Title,
				  lastwatched: new Date(snapshot.val()[key].lastWatched)
				});
			 }
			}
			
			xmlHttp.open("GET", "https://www.omdbapi.com/?i="+key+"&plot=short&r=json", false); // true for asynchronous 
			xmlHttp.send(null);
			  
		  }
		  }
		 });
		 
		 //Return the model
		return this.store.findAll('watchlist'); 
  },
  firebaseApp: Ember.inject.service(),
});
