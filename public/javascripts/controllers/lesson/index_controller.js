var LessonIndexController = Em.ObjectController.extend({
  needs: ['lesson'],
  isEditing: false,
  actions: {
    setStartScene: function setStartScene() {
      console.log('set start');
      this.get('model').save();
    },
    start: function start() {
      var
      model = this.get('model'),
      scenes = this.get('model.scenes'),
      controller = this;

      scenes.then(function (ss) {
        var scene = ss.get('firstObject');
        if (scene) {
          controller.transitionToRoute('scene', model, scene);
        } else {
          Em.Logger.error("Start Scene Not Set");
        }
      });

    }
  }
});

module.exports = LessonIndexController;
