var DragNDrop = Ember.Namespace.create();

DragNDrop.cancel = function(event) {
    event.preventDefault();
    return false;
};


DragNDrop.Droppable = Ember.Mixin.create({
    dragEnter: DragNDrop.cancel,
    dragOver: DragNDrop.cancel,
    drop: function(event) {
        event.preventDefault();
        return false;
    }
});

var ItemTargetView = Ember.View.extend(DragNDrop.Droppable, {
    tagName:'li',
    attributeBindings: ['draggable'],
    classNames: ["drag-target"],
    draggable:false,
    dragEnter: function  (event) {

        var el = $(event.target);
        el.attr('src', el.attr('data-hover'));

        return this._super(event);
    },
    dragLeave: function  () {
         var el = $(event.target);
        el.attr('src', el.attr('data-src'));

        return this._super(event);
    },
    drop: function  (event) {
        var dataTransfer = event.originalEvent.dataTransfer;
        var el = $(event.target);
        el.attr('src', el.attr('data-src'));
        
        this.get("controller").send("itemDrop", {
            target:this.get('model'),
            item:dataTransfer.getData('value')
        });
        
        return this._super(event);
    }
});

module.exports =  ItemTargetView;