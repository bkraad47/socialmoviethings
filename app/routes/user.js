import Ember from 'ember';
export default Ember.Route.extend({
	
	model() {
		  //get unique uid
		  var user=this.get('firebaseApp').auth().currentUser.uid;
		  //Get user data
		  this.get('firebaseApp').database().ref('/user/'+user).once('value').then(function(snapshot) {
		  if(snapshot.val()!=null){
		  //Set user preferences
		  document.getElementById('ucomedy').value=snapshot.val().comedy;
		  document.getElementById('udrama').value=snapshot.val().drama;
		  document.getElementById('uaction').value=snapshot.val().action;
		  }
		 });
  },
  firebaseApp: Ember.inject.service(),
});