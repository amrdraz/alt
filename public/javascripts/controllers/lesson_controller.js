var LessonController = Em.ObjectController.extend({
  // needs: [],
  isEditing: false,

  actions: {
    editTitle: function() {
      this.set('isEditing', true);
    },
    acceptChanges: function() {
      this.set('isEditing', false);
      this.get('model').save();
    },
    removeLesson: function() {
      var lesson = this.get('model');
      lesson.deleteRecord();
      lesson.save();
    }
  }
});

module.exports =  LessonController;