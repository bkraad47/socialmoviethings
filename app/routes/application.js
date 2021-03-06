import Ember from 'ember';
export default Ember.Route.extend({
  beforeModel: function() {
	//get session
    return this.get('session').fetch().catch(function() {});
  },
  actions: {
    signIn: function(provider) {
	   // signin by provider
      this.get('session').open('firebase', { provider: provider}).then(function(data) {
        window.location="/user";
      });
    },
    signOut: function() {
		//singout
      this.get('session').close();
    }
  }
});