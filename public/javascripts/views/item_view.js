var DragNDrop = Ember.Namespace.create();

DragNDrop.cancel = function(event) {
    event.preventDefault();
    return false;
};

DragNDrop.Draggable = Ember.Mixin.create({
    attributeBindings: 'draggable',
    draggable: 'true',
    dragStart: function(event) {
        var dataTransfer = event.originalEvent.dataTransfer;
        dataTransfer.setData('id', this.get('elementId'));
    }
});

var ItemView = Ember.View.extend(DragNDrop.Draggable, {
    tagName: 'li',
    classNames: ["drag-item"],
    attributeBindings: ['draggable'],
    draggable:true,
    // .setDragImge (in #dragStart) requires an HTML element as the first argument
    // so you must tell Ember to create the view and it's element and then get the 
    // HTML representation of that element.
    dragIconElement: Ember.View.create({
        attributeBindings: ['src'],
        tagName: 'img',
        src: 'http://twitter.com/api/users/profile_image/twitter'
    }).createElement().get('element'),

    dragStart: function(event) {
        this._super(event);
        // Let the controller know this view is dragging
        this.set('isDragging', true);
        // Set the drag image and location relative to the mouse/touch event
        var dataTransfer = event.originalEvent.dataTransfer;
        dataTransfer.setData('value', this.get('value'));
    },

    dragEnd: function(event) {
        // Let the controller know this view is done dragging
        this.set('isDragging', false);
    }
});


module.exports = ItemView;