import Ember from 'ember';

export default Ember.Route.extend({
	model(params) {
		var movieId = params.movie_id;
		var typeId = params.type_id;
		var http = new XMLHttpRequest();
		var xmlHttp = new XMLHttpRequest();
		var movie;
		var self=this;
		var imdbID;
		var Genre;
		var views=0;
		var rating=5;
		//Http OMDB JSON request
        xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
            var resp=JSON.parse(xmlHttp.responseText);
			if(resp.Response==="True"){
				imdbID=resp.imdbID;
				Genre=resp.Genre;
				
				
			//Check if record exists or not, if not create record. Note oddd structuring here due to db read latency
				self.get('firebaseApp').database().ref('/movies/'+imdbID).once('value').then(function(snapshot) {
				
						if(!snapshot.val()){
							
							var movieData = {
							genre: Genre,
							views: 0,
							rating: 5
						  };
						var updates = {};
                        updates['/movies/' + imdbID] = movieData;
						self.get('firebaseApp').database().ref().update(updates);
						
						
						}else{
							
							document.getElementById('views').innerHTML=snapshot.val().views;
							document.getElementById('rating').innerHTML=snapshot.val().rating+"/5";
						}
						
						}).catch(function(error){
							 console.log(error.code+" - "+error.message);
						 });
				
				
				
				
			//Generate movie model to return to view	
			movie= self.store.createRecord('movie', {
				title: resp.Title,
				year: resp.Released,
				genre: Genre,
				poster: resp.Poster,
				plot: resp.Plot,
				director: resp.Director,
				actors: resp.Actors,
				imdbID: imdbID,
				imdbRating: resp.imdbRating,
				views:views,
				rating:(rating+"/5")
			  });
			}
					}
		}
		//http request
		xmlHttp.open("GET", "https://www.omdbapi.com/?"+typeId+"="+movieId+"&plot=short&r=json", false); // true for asynchronous 
		xmlHttp.send(null);
		
		
		return movie;
	},
  actions: {
    addWatchList: function(movie) {
		var self=this;
		var user=this.get('firebaseApp').auth().currentUser.uid;
		//Update watchlist
        self.get('firebaseApp').database().ref('/movies/'+movie).once('value').then(function(snapshot) {
						
						//create updated movie object
						var movieData = {
							genre: snapshot.val().genre,
							views: (snapshot.val().views+1),
							rating: snapshot.val().rating
						  };
						  
						 //Update movie data
						var updates = {};
                        updates['/movies/' + movie] = movieData;
						self.get('firebaseApp').database().ref().update(updates);
						
						document.getElementById('views').innerHTML=movieData.views;
						
								var movieData = {
				
										lastWatched: new Date().getTime()
													
										 };
								// Update watchlist
								var updates = {};
								updates['/watchlist/'+user+'/'+movie] = movieData;
								self.get('firebaseApp').database().ref().update(updates);
						
						//To watch next movie goto reccomendations page
						window.location="/recomend";
						}).catch(function(error){
							 console.log(error.code+" - "+error.message);
						});
						 
						 
    },
	rateMovie: function(movie) {
	  var self=this;
	  //Rate movie 
      self.get('firebaseApp').database().ref('/movies/'+movie).once('value').then(function(snapshot) {
						    // get rating
							var rating=parseFloat(snapshot.val().rating);
							
							rating=parseFloat((rating+parseInt(document.getElementById('rating_mov').value))/2); //Calculate average
							
							var movieData = {
							genre: snapshot.val().genre,
							views: (snapshot.val().views),
							rating: rating
						    };
							//update averaged ratings
						    var updates = {};
                            updates['/movies/' + movie] = movieData;
						    self.get('firebaseApp').database().ref().update(updates);
						
						    document.getElementById('rating').innerHTML=rating+"/5";
						
						
						}).catch(function(error){
							 console.log(error.code+" - "+error.message);
					    });
						 
						 
						 
						 
    }
  },
  firebaseApp: Ember.inject.service(),
});
