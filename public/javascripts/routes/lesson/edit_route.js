var LessonEditRoute = Em.Route.extend({
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  // beforeModel: function() {},
  // afterModel: function(model) {
  //   return model.get('startScene');
  // },

  model: function() {
    return this.modelFor('lesson');
  }
});

module.exports = LessonEditRoute;
