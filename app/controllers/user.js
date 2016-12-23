import Ember from 'ember';

export default Ember.Controller.extend({
  sortProperties: ['timestamp'],
  firebaseApp: Ember.inject.service(),
	  sortAscending: false,
  actions: {
    updateUser: function() {
		
		//get user id
		var user=this.get('firebaseApp').auth().currentUser.uid;
		
		//create user db object containing preferences
        var pref =  {
					action: document.getElementById('uaction').value, 
					comedy: document.getElementById('ucomedy').value,
					drama:document.getElementById('udrama').value
										
					 };
		
		var updates = {};
		updates['/user/'+user] = pref;
		
		//Update DB content
		this.get('firebaseApp').database().ref().update(updates);
		document.getElementById('updateMSG').innerHTML='Update Successful';
    }
  }
});