var InteractionController = Em.ObjectController.extend({

  canEdit: false,
  isEditing: false,
  selectedNextScene: null,
  init: function() {
    this._super();
    // var model = this.get('model');
    //target is sceneController
    v = this.get('target.canEdit');
    this.set('canEdit', this.get('target.canEdit'));

  },
  scenes: function() {
    return this.get('model.scene.lesson.scenes');
  }.property('@each.scene.lesson.scenes'),

  actions: {

    toggleEdit: function() {
      var interaction = this.get('model');
      var promises;
      console.log('editing interaction', interaction);

      if (this.get('isEditing')) {
        // console.log('here');
        // debugger
        if (interaction.get('isContinue') && this.get('selectedNextScene')) {
          var nextScene = interaction.get('nextScene'),
            // pointers = interaction.get('scene.pointers'),
            newScene = this.get('selectedNextScene');
          // if (nextScene && nextScene !== newScene) {
          //   pointers.removeObject(interaction);
          // }
          // pointers.addObject(interaction);
          interaction.set('nextScene', newScene);
          // interaction.get('scene').save();
        } else if (interaction.get('isDrag')) {
          promises = Em.A();
          interaction.get('targets').forEach(function (item) {
            promises.push(item.save());
          });
          interaction.get('items').forEach(function (item) {
            promises.push(item.save());
          });
          Em.RSVP.Promise.all(promises).then(function(resolvedPromises){
              console.log('All is up to date!');
          });
        } else if (interaction.get('isChoose')) {
          promises = Em.A();
          interaction.get('targets').forEach(function (item) {
            promises.push(item.save());
          });
          Em.RSVP.Promise.all(promises).then(function(resolvedPromises){
              console.log('All is up to date!');
          });
        }

        interaction.save().then(function() {
          var s = interaction.get('scene');
          s.set('interaction', interaction); //because for some reason it becomes null
          // debugger
        });
      } else {
        // debugger
        if (!this.get('selectedNextScene') && interaction.get('nextScene')) {
          this.set('selectedNextScene', interaction.get('nextScene'));
        }
      }
      this.set('isEditing', !this.get('isEditing'));
    },
    itemDrop: function(drop) {
      var sceneRoute = this.get('canEdit') ? 'scene.edit' : 'scene';
      var m = this.get('model');
      if (drop.target.get('id') === drop.item) {
        this.transitionToRoute(sceneRoute, this.get('model.lesson'), drop.target.get('nextScene'));
      } else {
        alert("wrong Answer :(");
        this.transitionToRoute(sceneRoute, this.get('model.lesson'), drop.target.get('nextScene'));
      }

      return false;
    },
    next: function(model) { //model may be target
      if (model) {
        this.transitionToRoute(this.get('canEdit') ? 'scene.edit' : 'scene', this.get('model.scene.lesson'), model.get('nextScene'));
      } else {
        console.log('scene is not set');
      }
      return false;
    },
    //type can be item or target
    itemAdd: function(interaction, type) {
      var items = interaction.get(type + 's'),
      item = this.store.createRecord(type, {
        name: type+" "+(items.get('length')+1),
        interaction: interaction,
        nextScene: interaction.get('scene')
      });
      items.addObject(item);
    },
    itemRemove: function(interaction, item, type) {
      interaction.get(type + 's').removeObject(item);
      
      
      if(!item.get('isNew'))
        item.destroyRecord();
      else
        item.deleteRecord();
    },
    save: function(item) {
      item.save();
    },
    selectImage: function(item, image_type) {

      var url = prompt("Image URL", item.get(image_type));
      if(url) {
        item.set(image_type, url);
      }
    }
  }
});

module.exports = InteractionController;
