module.exports =  Em.Route.extend({
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  // beforeModel: function(m) {
  // },
//   afterModel: function(model) {
//     var store = this.get('store');
//     var promises = [];
//     var i = model._data.startScene;
// // debugger
//     if(i!==null) {

//       modelId = model.get('id');
//       // promises.push(store.find('scene',  modelId).then(function(obj){
//       //   model.set('startScene', obj.get('firstObject'));
//       // }));
//     }

//     return Ember.RSVP.all(promises);
//   },
  
  model: function(params) {
      return this.store.find('lesson', params.lesson_id);
  }
});
