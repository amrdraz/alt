var Interaction = DS.Model.extend({
  name: DS.attr('string'),
  toStringExtension: function  () {
    return this.get('name');
  },
  type: DS.attr('string',{defaultValue: 'continue'}), //based on type
  types: ['drag', 'continue', 'choose'],
  isDrag: function(){
    return (this.get('type')==='drag');
  }.property('type'),
  isContinue: function(){
    return (this.get('type')==='continue');
  }.property('type'),
   isChoose: function(){
    return (this.get('type')==='choose');
  }.property('type'),
  scene: DS.belongsTo('scene', {inverse:'interaction'}),
  nextScene: DS.belongsTo('scene'),
  items: DS.hasMany('item', {async:true}),
  targets: DS.hasMany('target', {async:true})
  // reactions: DS.hasMany('reaction')
});



Interaction.FIXTURES = [
    {
        id:1,
        name: "Interaction for Scene 1",
        type:"drag",
        scene: 1,
        nextScene: null,
        items: [100],
        targets:[101,102]
    },
     {
        id:2,
        name: "Interaction for Scene 2",
        type:"continue",
        scene: 2,
        nextScene: 4,
        items: [],
        targets:[]
    }
];


module.exports =  Interaction;