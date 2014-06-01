var SceneEditRoute = Em.Route.extend({
  // activate: function() {},
  // deactivate: function() {},
  renderTemplate: function() {
    this.render('scene');
  },
  // beforeModel: function() {},
  // afterModel: function(model) {
  //   var store = this.get('store'),
  //       modelId = model.get('id');
  //       console.log("scene hook");
  //   var promises = [];
  //   if(model.interaction) {
  //     promises.push(store.find('interaction', {scene: modelId }));
  //   }

  //   return Ember.RSVP.all(promises);
  // },
  setupController: function(controller, model) {
    controller = this.controllerFor('scene');
    this._super(controller, model);
    controller.set('canEdit', true);
  },
  model: function() {
      return this.modelFor('scene');
  }
});


module.exports =  SceneEditRoute;