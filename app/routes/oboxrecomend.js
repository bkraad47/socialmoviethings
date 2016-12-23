import Ember from 'ember';

export default Ember.Route.extend({
	
	firebaseApp: Ember.inject.service(),
	model: function() {
		
	//Sort the model in controller by views and rating
	var self=this;
    var user=this.get('firebaseApp').auth().currentUser.uid;
	var pref=[];
	
	//Get user preferences
	this.get('firebaseApp').database().ref('/user/'+user).once('value').then(function(snapshot) {
		if (snapshot.val()){
		if (snapshot.val().action==="Yes"){
			pref.push("Action");
		}
		if (snapshot.val().comedy==="Yes"){
			pref.push("Comedy");
		}
		if (snapshot.val().drama==="Yes"){
			pref.push("Drama");
		}
		
	  //get user watchlist
      self.get('firebaseApp').database().ref('/watchlist/'+user+"/").once('value').then(function(snapshot1) {
		    //get all movies list
			self.get('firebaseApp').database().ref('/movies/').once('value').then(function(snapshot2) {
				for (var key in snapshot2.val()){
					if(snapshot1.val()){
				    //If movie not in watchlist work with it
					 if(snapshot1.val()[key]==null){
						
						// Check no genre matches
						var inGenre=true;
						var i;
						for(i = 0; i < pref.length; i++){
							if((snapshot2.val()[key].genre).includes(pref[i])){
								inGenre=false;
							}
						}
						
						//If no genre match
						if(inGenre){
							
							//Get movie omdb data
							var http = new XMLHttpRequest();
							var xmlHttp = new XMLHttpRequest();
							xmlHttp.onreadystatechange = function() { 
							if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
								var resp=JSON.parse(xmlHttp.responseText);
								
								//Generate record
								self.store.createRecord('watchlist', {
								  imdbID: key,
								  poster: resp.Poster,
								  title: resp.Title,
								  views: snapshot2.val()[key].views,
								  rating: snapshot2.val()[key].rating
								});
							}
							}
			
							xmlHttp.open("GET", "https://www.omdbapi.com/?i="+key+"&plot=short&r=json", false); // true for asynchronous 
							xmlHttp.send(null);
							
						}
						
					 }
					}else{
						//if theres no watchlist add all movies  for user genre to model
						
						// Check no genre matches
						var inGenre=true;
						var i;
						for(i = 0; i < pref.length; i++){
							if((snapshot2.val()[key].genre).includes(pref[i])){
								inGenre=false;
							}
							
						}
						
						//If no genre match
						if(inGenre){
							//Get omdb data
							var http = new XMLHttpRequest();
							var xmlHttp = new XMLHttpRequest();
							xmlHttp.onreadystatechange = function() { 
							if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
								var resp=JSON.parse(xmlHttp.responseText);
								//Generate record
								self.store.createRecord('watchlist', {
								  imdbID: key,
								  poster: resp.Poster,
								  title: resp.Title,
								  views: snapshot2.val()[key].views,
								  rating: snapshot2.val()[key].rating
								});
						 }
						}
			
						xmlHttp.open("GET", "https://www.omdbapi.com/?i="+key+"&plot=short&r=json", false); // true for asynchronous 
						xmlHttp.send(null);
						
						}
						
				}
				}
			});
		});
		
		}else{
			//If no record found make default model record
			self.store.createRecord('watchlist', {
				  imdbID: 0,
				  poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Icon_Transparent_Error.png/120px-Icon_Transparent_Error.png",
				  title: "Error:Please add user preferences first. To use this feature",
				  views: 0,
				  rating: 0
				});
		}
	   });
	   return this.store.findAll('watchlist');
	}
});
