var getRandColor = require('../utils/color');
var TargetModel = DS.Model.extend({
    name: DS.attr('string'),
    content: DS.attr('string'),
    color: DS.attr('string', { defaultValue: function () {
        return getRandColor(2);
    }}),
    image: DS.attr('string', {defaultValue:"/images/green-trash-closed.png"}),
    image_src: function () {
        return this.get('image');
    }.property('image'),
    hover: DS.attr('string', {defaultValue:"/images/green-trash-open.png"}),
    hover_src: function () {
        return this.get('hover');
    }.property('hover'),
    value: DS.attr('string'),
    interaction: DS.belongsTo('interaction'),
    nextScene: DS.belongsTo('scene'),
    interactionChange:function () {
     // this.get('currentState').send('becomeDirty'); 
     // this.get('currentState').transitionTo('root.loaded.updated.uncommitted');
   }.observes('nextScene')
});



TargetModel.FIXTURES = [
    {
        id: 101,
        name: "Green Bin",
        content: "",
        image: "/images/green-trash-closed.png",
        hover: "/images/green-trash-open.png",
        value: "organic",
        interaction:1,
        nextScene:2
    }, {
        id: 102,
        name: "Blue Bin",
        content: "",
        image: "/images/blue-trash-closed.png",
        hover: "/images/blue-trash-open.png",
        value: "non-organic",
        interaction:1,
        nextScene:1
    }

];

module.exports =  TargetModel;
