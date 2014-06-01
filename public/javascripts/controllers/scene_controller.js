var SceneController;
SceneController = Em.ObjectController.extend({
  editTitle: false,
  editContent: false,
  editIterantion: false,
  canEdit: false,
  selectedNextScene: null,
  init: function() {
    this._super();
    this.set('editIterantion', false);
    this.set('editContent', false);
  },

  actions: {
    togglEditTitle: function() {
      if (this.get('editTitle')) {
        this.get('model').save();
      }
      this.set('editTitle', !this.get('editTitle'));
    },
    toggelEditContent: function() {
      if (this.get('canEdit')) {
        if (this.get('editContent')) {
          this.get('model').save();
        }
        this.set('editContent', !this.get('editContent'));

      }
    },
    clearContent: function() {
      this.get('model').set('content', '');
    },
    addInteraction: function() {
      var scene = this.get('model');
      console.log("interaction adding");
      if (scene.get('interaction')) {
        console.log("it's still set");
        return false;
      }
      var interaction = this.store.createRecord('interaction', {
        name: "Interaction for " + (scene.get('name')),
        scene: scene,
        nextScene: scene
      });
      //lesson.save();


      scene.set('interaction', interaction);
      scene.save().then(function() {

        interaction.save().then(function() {
          console.log('interaction saved');
        }, function(error) {
          console.log('error', error);
          scene.set('iteraction', null);
        });
        console.log("nextScene", interaction.get('nextScene.name'));

      });

    },
    removeInteraction: function(interaction) {
      var scene = this.get('model');
      this.set('editIterantion', false);
      scene.set('interaction', null);
      scene.save();
      interaction.destroyRecord();
    }
  }
});

module.exports = SceneController;
