import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr('string'),
    year: DS.attr('string'),
	genre: DS.attr('string'),
	poster: DS.attr('string'),
	plot: DS.attr('string'),
	actors: DS.attr('string'),
	director: DS.attr('string'),
	imdbID: DS.attr('string'),
	imdbRating: DS.attr('string'),
	rating: DS.attr('string'),
	views: DS.attr('string')
	
});
