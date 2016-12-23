import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('user');
  this.route('search');
  this.route('result',{ path: "/result/:type_id/:movie_id" });
  this.route('watched');
  this.route('recomend');
  this.route('oboxrecomend');
});

export default Router;
