var ReactionModel = DS.Model.extend({
  name: DS.attr('string'),
  evaluation: DS.attr('string'),
  nextScene: DS.belongsTo('scene'),
  scene: DS.belongsTo('scene'),
  transition: DS.hasMany('string')
});



module.exports =  ReactionModel;