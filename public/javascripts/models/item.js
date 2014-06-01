var Item = DS.Model.extend({
    name: DS.attr('string'),
    image: DS.attr('string', {defaultValue:"/images/composable/poultry.jpg"}),
    image_src: function () {
        return  this.get('image');
    }.property('image'),
    value: DS.attr('string'),
    interaction: DS.belongsTo('interaction'),
    isDropped: false
});



Item.FIXTURES = [
    {
        id: 100,
        name: "Some food",
        image: "/images/composable/poultry.jpg",
        value: "organic",
        interaction:1
    }
];

module.exports = Item;
