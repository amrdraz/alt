
var Lesson = DS.Model.extend({
  title: DS.attr('string'),
  color: DS.attr('string'),
  description: DS.attr('string'),
  date: DS.attr('date', {defaultValue: function () {
    return new Date();
  }}),
  startScene:function () {
    // debugger;
    var s = this.get('scenes.firstObject');
    return s;
  }.property('@each.scenes'),
  scenes: DS.hasMany('scene', {async:true, inverse:'lesson'}),
  ueer: DS.belongsTo('user')
});


Lesson.FIXTURES = [
 {
    id:1,
    title: "Lesson 1",
    color:"#a3f",
    startScene: 1,
    scenes : [1,2,4,5]
 },
 {
    id:2,
    title: "Lesson 2",
    color:"#3af",
    scenes: [3]
 }
];

module.exports =  Lesson;