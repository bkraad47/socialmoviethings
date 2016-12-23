import Ember from 'ember';

export default Ember.Controller.extend({
	//Sort search model by last views
	sortProperties: ['lastwatched:desc'],
	smodel:Ember.computed.sort('model', 'sortProperties')
});