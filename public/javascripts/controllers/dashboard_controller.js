var getRandColor = require('../utils/color');

var IndexController = Em.ArrayController.extend({
sortProperties: ['date', 'name'],
sortAscending: true,
  actions: {
    createLesson: function  () {
        var lesson = this.store.createRecord('lesson', {
         title:"Lesson "+ (this.get('length')+1),
         color: getRandColor(3),
         date: new Date()
        });
        //lesson.save();
        //
        console.log("lesson",lesson);
        lesson.save();
    },
    remove: function (lesson) {
      console.log(lesson);
      lesson.destroyRecord();
    }
  }
});

module.exports = IndexController;
