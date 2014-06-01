var LessonController = Em.ObjectController.extend({
  // needs: [],
  editTitle:false,
  editDescription:false,
  startSceneId: null,
  actions: {
    togglEditTitle: function () {
      if (this.get('editTitle')) {
        this.get('model').save();
      }
      this.set('editTitle', !this.get('editTitle'));
    },
    toggelEditDescription: function () {
      if (this.get('editDescription')) {
        this.get('model').save();
      }
      this.set('editDescription', !this.get('editDescription'));
    },
    addScene: function () {
      var lesson = this.get('model'),
          scenes = lesson.get('scenes');

      var scene = this.store.createRecord('scene', {
         name:"Scene "+ (scenes.get('length')+1),
         lesson: lesson
        });
      scene.save().then(function () {
        lesson.get('scenes').pushObject(scene);
        lesson.save();
      // debugger
      });
     },
    removeScene: function (scene) {
      var lesson = this.get('model');
      lesson.get('scenes').removeObject(scene);
      scene.destroyRecord();
      var v = lesson.get('scenes.length');
      // debugger
      
      lesson.save();


      return false;
      // this.transitionToRoute('scene', lesson, scene);
    }
  }
});

module.exports =  LessonController;