import DS from 'ember-data';

export default DS.Model.extend({
   imdbID: DS.attr('string'),
   poster: DS.attr('string'),
   title: DS.attr('string'),
   lastwatched:DS.attr('string'),
   rating: DS.attr('float'),
   views: DS.attr('views')
});
