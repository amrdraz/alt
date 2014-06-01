module.exports =  Ember.Route.extend({
	beforeModel: function() {
    this.transitionTo('lessons');
  },
  model: function() {
    return this.store.find('lesson');
  }
});
