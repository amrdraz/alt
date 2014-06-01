var SceneController = Em.ObjectController.extend({
   needs: ['lesson'],
   editContent: false,
   canEdit:false,
   selectedNextScene : null,
   scenes: function () {
     return this.get('model.lesson.scenes');
   }.property('@each.lesson.scenes'),
   
   
   actions: {
    toggelEditContent: function () {
      if (this.get('editContent')) {
        this.get('model').save();
      }
      this.set('editContent', !this.get('editContent'));
    },
    clearContent: function () {
      this.get('model').set('content', '');
    },
    toggleEdit: function (interaction) {

      // console.log('interaction', interaction);

      if (this.get('editInteraction')) {
        if (interaction.isContinue) {
          interaction.set('nextScene', selectedNextScene);
        }
        interaction.save().then(function (intr) {
        //   console.log("success", intr);
        // }).catch(function (e) {
        //   console.log("fail", e);
        });
      } else {

      }
      interaction.set('edit', !interaction.get('edit'));
    },
    addInteraction: function  () {
      var scene = this.get('model');
        var interaction = this.store.createRecord('interaction', {
         name:"Interaction for "+ (scene.get('name')),
         scene: scene
        });
        //lesson.save();
        //
        console.log("lesson",scene);
        interaction.save().then(function (intr) {
          scene.set('iteraction', intr);
          scene.save();
        });
        
    },

    itemDrop: function  (drop) {
      // if(drop.target===drop.item) {
      //   console.log("correct", drop.target)
      // } else {
      //   console.log("false", drop.target)
      // }
      // console.log(drop.target,drop.target.get('value'),drop.item);
      var sceneRoute = 'scene.edit';
      if(drop.target.get('value')===drop.item) {
        this.transitionTo(sceneRoute, this.get('model'), drop.target.get('nextScene'));
      } else {
        alert("wrong Answer :(");
        this.transitionTo(sceneRoute, this.get('model'), drop.target.get('nextScene'));
      }

      return false;
    },
    save: function (item) {
      item.save();
    },
    next: function (scene) {
        this.transitionTo('scene.edit', this.get('model'), scene);
    },
    itemAdd: function (interaction) {
      var item = this.store.createRecord('item', {
         interaction: interaction
        });
      interaction.get('items').addObject(item);
    },
    targetAdd: function (interaction) {
      var item = this.store.createRecord('target', {
         interaction: interaction
        });
      interaction.get('targets').addObject(item);
    },
    selectImage: function (item) {
      
    }
   }
});

module.exports =  SceneController;
