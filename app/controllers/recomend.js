import Ember from 'ember';

export default Ember.Controller.extend({
	//Sort search model by rating and views
	sortProperties: ['views:desc','rating:desc'],
	smodel:Ember.computed.sort('model', 'sortProperties')
});
