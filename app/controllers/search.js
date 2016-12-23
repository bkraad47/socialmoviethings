import Ember from 'ember';

export default Ember.Controller.extend({
  sortProperties: ['timestamp'],
  sortAscending: false, // sorts post by timestamp
  actions: {
    Search: function() {
	  //on search goto result page
      window.location = "/result/t/"+this.get('title');
    }
  }
});