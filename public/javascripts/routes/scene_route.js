module.exports =  Em.Route.extend({
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  // beforeModel: function() {},
  afterModel: function(model) {
    var store = this.get('store'),
        modelId = model.get('id');
    var promises = [];
    var i = model._data.interaction;

    if(i!==null) {
      console.log("scene hook");
      promises.push(store.find('interaction', {scene: modelId }).then(function(obj){
        model.set('interaction', obj.get('firstObject'));
      }));
    } else {
      model.set('interaction', null);
    }

    return Ember.RSVP.all(promises);
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('canEdit', false);
  },
  model: function(params) {
    // console.log(params); this is the working one
      return this.store.find('scene', params.scene_id);
  }
});
