;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Lesson = require('../models/lesson'),
Scene = require('../models/scene'),
Interaction = require('../models/interaction'),
Target = require('../models/target'),
Item = require('../models/item');

Ember.Application.initializer({
  name: 'authentication',
  initialize: function(container, application) {
    Ember.SimpleAuth.setup(container, application);
  }
});

var App = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_MODULE_RESOLVER: true,
  LOG_TRANSITIONS: true,
  LOG_TRANSITIONS_INTERNAL: true,
  LOG_VIEW_LOOKUPS: true,
  // modulePrefix: 'appkit', // TODO: loaded via config
  // Resolver: Resolver['default']
});


// App.ApplicationSerializer = DS.RESTSerializer.extend({
//   primaryKey: '_id'
// });

// App.ApplicationAdapter = DS.RESTAdapter.extend({
//   namespace: 'api'
// });

// App.ApplicationSerializer = DS.IndexedDBSerializer.extend();
// App.ApplicationAdapter = DS.IndexedDBAdapter.extend({
//   databaseName: 'abkar',
//   version: 4,
//   migrations: function() {
//     this.addModel(Interaction); 
//     this.addModel(Lesson);
//     this.addModel(Scene);
//     this.addModel(Target);
//     this.addModel(Item);
//     //this.addModel(App.Phone);
//   }
// });
 App.ApplicationSerializer = DS.LSSerializer.extend();
 App.ApplicationAdapter = DS.LSAdapter.extend({});

// App.ApplicationAdapter =  DS.FixtureAdapter.extend({
//     queryFixtures: function(records, query, type) {
//         return records.filter(function(record) {
//             for (var key in query) {
//                 if (!query.hasOwnProperty(key)) {
//                     continue;
//                 }
//                 var value = query[key];
//                 if (record[key] !== value) {
//                     return false;
//                 }
//             }
//             return true;
//         });
//     }
// });

module.exports = App;

},{"../models/interaction":23,"../models/item":24,"../models/lesson":25,"../models/scene":28,"../models/target":29}],2:[function(require,module,exports){
var App = require('./app');

App.Router.map(function() {
  // this.route('login');
  // this.route('logout');
  // this.route('signup');
  // this.route('people');
  // this.route('protected');
  // this.resource('person', { path: '/people/:person_id' });
  // this.route('edit_person', { path: '/people/:person_id/edit' });
  // this.route('new_person', { path: '/people/new' });
  
  // this.resource('users', function() {
  //   this.resource('user', {path:'/:user_id'}, function  () {
  //       this.route('edit');
  //   });
  //   this.route('create');
  // });
  this.route('lessons');
  this.route('dashboard');
  this.resource('lesson', {path:"lesson/:lesson_id"}, function () {
    this.route('preview');
    this.route('edit');
    this.resource('scene', {path:"/scene/:scene_id"}, function () {
      this.route('edit');
    });
  });
});
},{"./app":1}],3:[function(require,module,exports){
var getRandColor = require('../utils/color');

var IndexController = Em.ArrayController.extend({
sortProperties: ['date', 'name'],
sortAscending: true,
  actions: {
    createLesson: function  () {
        var lesson = this.store.createRecord('lesson', {
         title:"Leçon "+ (this.get('length')+1),
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

},{"../utils/color":47}],4:[function(require,module,exports){
var EditPersonController = Ember.ObjectController.extend({
  actions: {
    save: function() {
      this.get('model').save();
      this.redirectToModel();
    },
    cancel: function() {
      this.transitionToRoute('people');
    }
  },
  redirectToModel: function() {
    var router = this.get('target');
    var model = this.get('model');
    router.transitionTo('person', model);
  }
});

module.exports = EditPersonController;

},{}],5:[function(require,module,exports){

var IndexController = Em.ArrayController.extend({
sortAscending: true,
  actions: {
    
  }
});

module.exports = IndexController;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
var LessonController = Em.ObjectController.extend({
  // needs: [],
  editTitle:false,
  editDescription:false,
  startSceneId: null,
  actions: {
    togglEditTitle: function () {
      if (this.get('editTitle')) {
        this.get('model').save();
      }
      this.set('editTitle', !this.get('editTitle'));
    },
    toggelEditDescription: function () {
      if (this.get('editDescription')) {
        this.get('model').save();
      }
      this.set('editDescription', !this.get('editDescription'));
    },
    addScene: function () {
      var lesson = this.get('model'),
          scenes = lesson.get('scenes');

      var scene = this.store.createRecord('scene', {
         name:"Scène "+ (scenes.get('length')+1),
         lesson: lesson
        });
      scene.save().then(function () {
        lesson.get('scenes').pushObject(scene);
        lesson.save();
      // debugger
      });
     },
    removeScene: function (scene) {
      var lesson = this.get('model');
      lesson.get('scenes').removeObject(scene);
      scene.destroyRecord();
      var v = lesson.get('scenes.length');
      // debugger
      
      lesson.save();


      return false;
      // this.transitionToRoute('scene', lesson, scene);
    }
  }
});

module.exports =  LessonController;
},{}],8:[function(require,module,exports){
var LessonIndexController = Em.ObjectController.extend({
  needs: ['lesson'],
  isEditing: false,
  actions: {
    setStartScene: function setStartScene() {
      console.log('set start');
      this.get('model').save();
    },
    start: function start() {
      var
      model = this.get('model'),
      scenes = this.get('model.scenes'),
      controller = this;

      scenes.then(function (ss) {
        var scene = ss.get('firstObject');
        if (scene) {
          controller.transitionToRoute('scene', model, scene);
        } else {
          Em.Logger.error("Start Scene Not Set");
        }
      });

    }
  }
});

module.exports = LessonIndexController;

},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
var getRandColor = require('../utils/color');

var IndexController = Em.ArrayController.extend({
sortProperties: ['date', 'name'],
sortAscending: true,
  actions: {
    
  }
});

module.exports = IndexController;

},{"../utils/color":47}],11:[function(require,module,exports){
var LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
  actions: {
    loginFailed: function(xhr) {
      this.set('errorMessage', xhr.responseText);
    }
  }
});

module.exports = LoginController;

},{}],12:[function(require,module,exports){
var EditPersonController = require('./edit_person_controller');

// Inherit from edit controller
var NewPersonController = EditPersonController.extend();

module.exports = NewPersonController;

},{"./edit_person_controller":4}],13:[function(require,module,exports){
var PeopleController = Ember.ArrayController.extend({
  sortProperties: ['name'],
  sortAscending: true
});

module.exports = PeopleController;


},{}],14:[function(require,module,exports){
var PersonController = Ember.ObjectController.extend({
  actions: {
    destroy: function() {
      if (!confirm('Are you sure?')) return;
      this.get('model').deleteRecord();
      this.get('model').save();
      this.get('target.router').transitionTo('people');
    }
  }
});

module.exports = PersonController;

},{}],15:[function(require,module,exports){
var SceneController = Em.ObjectController.extend({
   needs: ['lesson'],
   editContent: false,
   canEdit:false,
   selectedNextScene : null,
   scenes: function () {
     return this.get('model.lesson.scenes');
   }.property('@each.lesson.scenes'),
   
   
   actions: {
    toggelEditContent: function () {
      if (this.get('editContent')) {
        this.get('model').save();
      }
      this.set('editContent', !this.get('editContent'));
    },
    clearContent: function () {
      this.get('model').set('content', '');
    },
    toggleEdit: function (interaction) {

      // console.log('interaction', interaction);

      if (this.get('editInteraction')) {
        if (interaction.isContinue) {
          interaction.set('nextScene', selectedNextScene);
        }
        interaction.save().then(function (intr) {
        //   console.log("success", intr);
        // }).catch(function (e) {
        //   console.log("fail", e);
        });
      } else {

      }
      interaction.set('edit', !interaction.get('edit'));
    },
    addInteraction: function  () {
      var scene = this.get('model');
        var interaction = this.store.createRecord('interaction', {
         name:"Interaction for "+ (scene.get('name')),
         scene: scene
        });
        //lesson.save();
        //
        console.log("lesson",scene);
        interaction.save().then(function (intr) {
          scene.set('iteraction', intr);
          scene.save();
        });
        
    },

    itemDrop: function  (drop) {
      // if(drop.target===drop.item) {
      //   console.log("correct", drop.target)
      // } else {
      //   console.log("false", drop.target)
      // }
      // console.log(drop.target,drop.target.get('value'),drop.item);
      var sceneRoute = 'scene.edit';
      if(drop.target.get('value')===drop.item) {
        this.transitionTo(sceneRoute, this.get('model'), drop.target.get('nextScene'));
      } else {
        alert("wrong Answer :(");
        this.transitionTo(sceneRoute, this.get('model'), drop.target.get('nextScene'));
      }

      return false;
    },
    save: function (item) {
      item.save();
    },
    next: function (scene) {
        this.transitionTo('scene.edit', this.get('model'), scene);
    },
    itemAdd: function (interaction) {
      var item = this.store.createRecord('item', {
         interaction: interaction
        });
      interaction.get('items').addObject(item);
    },
    targetAdd: function (interaction) {
      var item = this.store.createRecord('target', {
         interaction: interaction
        });
      interaction.get('targets').addObject(item);
    },
    selectImage: function (item) {
      
    }
   }
});

module.exports =  SceneController;

},{}],16:[function(require,module,exports){
var SceneController;
SceneController = Em.ObjectController.extend({
  editTitle: false,
  editContent: false,
  editIterantion: false,
  canEdit: false,
  selectedNextScene: null,
  init: function() {
    this._super();
    this.set('editIterantion', false);
    this.set('editContent', false);
  },

  actions: {
    togglEditTitle: function() {
      if (this.get('editTitle')) {
        this.get('model').save();
      }
      this.set('editTitle', !this.get('editTitle'));
    },
    toggelEditContent: function() {
      if (this.get('canEdit')) {
        if (this.get('editContent')) {
          this.get('model').save();
        }
        this.set('editContent', !this.get('editContent'));

      }
    },
    clearContent: function() {
      this.get('model').set('content', '');
    },
    addInteraction: function() {
      var scene = this.get('model');
      console.log("interaction adding");
      if (scene.get('interaction')) {
        console.log("it's still set");
        return false;
      }
      var interaction = this.store.createRecord('interaction', {
        name: "interaction for " + (scene.get('name')),
        scene: scene,
        nextScene: scene
      });
      //lesson.save();


      scene.set('interaction', interaction);
      scene.save().then(function() {

        interaction.save().then(function() {
          console.log('interaction saved');
        }, function(error) {
          console.log('error', error);
          scene.set('iteraction', null);
        });
        console.log("nextScene", interaction.get('nextScene.name'));

      });

    },
    removeInteraction: function(interaction) {
      var scene = this.get('model');
      this.set('editIterantion', false);
      scene.set('interaction', null);
      scene.save();
      interaction.destroyRecord();
    }
  }
});

module.exports = SceneController;

},{}],17:[function(require,module,exports){
var SignupController = Ember.Controller.extend({
  actions: {
    signup: function() {
      $.ajax({
        type: 'POST',
        url: '/signup',
        context: this,
        data: this.getProperties('username', 'email', 'password', 'confirmPassword')
      }).done(function() {
        this.transitionToRoute('login');
      }).fail(function(xhr) {
        this.set('errorMessage', xhr.responseText);
      });
    }
  }
});

module.exports = SignupController;

},{}],18:[function(require,module,exports){
module.exports =   Em.ArrayController.extend({
  usersCount: function  () {
    return this.get('model.length');
  }.property('@each')
});
},{}],19:[function(require,module,exports){
module.exports =  Ember.Handlebars.registerHelper('bindStyle', function(options) {
  var fmt = Ember.String.fmt;
  var attrs = options.hash;

  Ember.assert("You must specify at least one hash argument to bindStyle", !!Ember.keys(attrs).length);

  var view = options.data.view;
  var ret = [];
  var style = [];
  var ctx = this;

  // Generate a unique id for this element. This will be added as a
  // data attribute to the element so it can be looked up when
  // the bound property changes.
  var dataId = ++Ember.uuid;

  var attrKeys = Ember.keys(attrs).filter(function(item, index, self) {
    return (item.indexOf("unit") === -1) && (item !== "static");
  });

  // For each attribute passed, create an observer and emit the
  // current value of the property as an attribute.
  attrKeys.forEach(function(attr) {
    var property = attrs[attr];

    Ember.assert(fmt("You must provide a String for a bound attribute, not %@", [property]), typeof property === 'string');

    var propertyUnit = attrs[attr+"-unit"] || attrs.unit || ''; 

    var value = Em.get(ctx, property);

    Ember.assert(fmt("Attributes must be numbers, strings or booleans, not %@", [value]), value === null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean');

    var observer, invoker;

    observer = function observer() {
      var result = Em.get(ctx, property);

      Ember.assert(fmt("Attributes must be numbers, strings or booleans, not %@", [result]), result === null || typeof result === 'number' || typeof result === 'string' || typeof result === 'boolean');

      var elem = view.$("[data-bindAttr-" + dataId + "='" + dataId + "']");

      // If we aren't able to find the element, it means the element
      // to which we were bound has been removed from the view.
      // In that case, we can assume the template has been re-rendered
      // and we need to clean up the observer.
      if (Ember.isNone(elem) || elem.length === 0) {
        Ember.removeObserver(ctx, property, invoker);
        return;
      }

      var currentValue = elem.css(attr);

      if (currentValue !== result) {
        elem.css(attr, result+propertyUnit);
      }
    };

    invoker = function() {
      Ember.run.once(observer);
    };

    // Add an observer to the view for when the property changes.
    // When the observer fires, find the element using the
    // unique data id and update the attribute to the new value.
    Ember.addObserver(ctx, property, invoker);

    style.push(attr+':'+value+propertyUnit+';'+(attrs.static || ''));
  }, this);

  // Add the unique identifier
  ret.push('style="' + style.join(' ') + '" data-bindAttr-' + dataId + '="' + dataId + '"');
  return new Ember.Handlebars.SafeString(ret.join(' '));
});
},{}],20:[function(require,module,exports){
// Please note that Handlebars helpers will only be found automatically by the
// resolver if their name contains a dash (reverse-word, translate-text, etc.)
// For more details: http://stefanpenner.github.io/ember-app-kit/guides/using-modules.html

module.exports =  Ember.Handlebars.makeBoundHelper(function(word) {
  return word.split('').reverse().join('');
});


},{}],21:[function(require,module,exports){
// Please note that Handlebars helpers will only be found automatically by the
// resolver if their name contains a dash (reverse-word, translate-text, etc.)
// For more details: http://stefanpenner.github.io/ember-app-kit/guides/using-modules.html

Ember.Handlebars.helper('safe-string', function(word) {
    // Em.$().parseHTML(word)
  return new Handlebars.SafeString(word);
});


},{}],22:[function(require,module,exports){
// This file is auto-generated by `ember build`.
// You should not modify it.

var App = window.App = require('./config/app');
require('./templates');
require('./helpers/bind-style');
require('./helpers/reverse-word');
require('./helpers/safe-string');


App.DashboardController = require('./controllers/dashboard_controller');
App.EditPersonController = require('./controllers/edit_person_controller');
App.IndexController = require('./controllers/index_controller');
App.InteractionController = require('./controllers/interaction_controller');
App.LessonController = require('./controllers/lesson_controller');
App.LessonsController = require('./controllers/lessons_controller');
App.LoginController = require('./controllers/login_controller');
App.NewPersonController = require('./controllers/new_person_controller');
App.PeopleController = require('./controllers/people_controller');
App.PersonController = require('./controllers/person_controller');
App.SceneController = require('./controllers/scene_controller');
App.SignupController = require('./controllers/signup_controller');
App.Userscontroller = require('./controllers/usersController');
App.SceneEditController = require('./controllers/scene/edit_controller');
App.LessonEditController = require('./controllers/lesson/edit_controller');
App.LessonIndexController = require('./controllers/lesson/index_controller');
App.Interaction = require('./models/interaction');
App.Item = require('./models/item');
App.Lesson = require('./models/lesson');
App.Person = require('./models/person');
App.Reaction = require('./models/reaction');
App.Scene = require('./models/scene');
App.Target = require('./models/target');
App.User = require('./models/user');
App.ApplicationRoute = require('./routes/application_route');
App.ComponentTest = require('./routes/component-test');
App.DashboardRoute = require('./routes/dashboard_route');
App.HelperTest = require('./routes/helper-test');
App.IndexRoute = require('./routes/index_route');
App.LessonRoute = require('./routes/lesson_route');
App.LessonsRoute = require('./routes/lessons_route');
App.NewPersonRoute = require('./routes/new_person_route');
App.PeopleRoute = require('./routes/people_route');
App.ProtectedRoute = require('./routes/protected_route');
App.SceneRoute = require('./routes/scene_route');
App.Users = require('./routes/users');
App.SceneEditRoute = require('./routes/scene/edit_route');
App.LessonEditRoute = require('./routes/lesson/edit_route');
App.LessonIndexRoute = require('./routes/lesson/index_route');
App.ApplicationView = require('./views/application_view');
App.EditLabel = require('./views/edit_label');
App.ItemView = require('./views/item_view');
App.LoginView = require('./views/login_view');
App.TargetView = require('./views/target_view');
App.TextfieldView = require('./views/textfield_view');
App.WysiwygView = require('./views/wysiwyg_view');

require('./config/routes');

module.exports = App;


},{"./config/app":1,"./config/routes":2,"./controllers/dashboard_controller":3,"./controllers/edit_person_controller":4,"./controllers/index_controller":5,"./controllers/interaction_controller":6,"./controllers/lesson/edit_controller":7,"./controllers/lesson/index_controller":8,"./controllers/lesson_controller":9,"./controllers/lessons_controller":10,"./controllers/login_controller":11,"./controllers/new_person_controller":12,"./controllers/people_controller":13,"./controllers/person_controller":14,"./controllers/scene/edit_controller":15,"./controllers/scene_controller":16,"./controllers/signup_controller":17,"./controllers/usersController":18,"./helpers/bind-style":19,"./helpers/reverse-word":20,"./helpers/safe-string":21,"./models/interaction":23,"./models/item":24,"./models/lesson":25,"./models/person":26,"./models/reaction":27,"./models/scene":28,"./models/target":29,"./models/user":30,"./routes/application_route":31,"./routes/component-test":32,"./routes/dashboard_route":33,"./routes/helper-test":34,"./routes/index_route":35,"./routes/lesson/edit_route":36,"./routes/lesson/index_route":37,"./routes/lesson_route":38,"./routes/lessons_route":39,"./routes/new_person_route":40,"./routes/people_route":41,"./routes/protected_route":42,"./routes/scene/edit_route":43,"./routes/scene_route":44,"./routes/users":45,"./templates":46,"./views/application_view":48,"./views/edit_label":49,"./views/item_view":50,"./views/login_view":51,"./views/target_view":52,"./views/textfield_view":53,"./views/wysiwyg_view":54}],23:[function(require,module,exports){
var Interaction = DS.Model.extend({
  name: DS.attr('string'),
  toStringExtension: function  () {
    return this.get('name');
  },
  type: DS.attr('string',{defaultValue: 'continuer'}), //based on type
  types: ['lisser', 'continuer', 'choisir'],
  isDrag: function(){
    return (this.get('type')==='lisser');
  }.property('type'),
  isContinue: function(){
    return (this.get('type')==='continuer');
  }.property('type'),
   isChoose: function(){
    return (this.get('type')==='choisir');
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
        type:"lisser",
        scene: 1,
        nextScene: null,
        items: [100],
        targets:[101,102]
    },
     {
        id:2,
        name: "Interaction for Scene 2",
        type:"continuer",
        scene: 2,
        nextScene: 4,
        items: [],
        targets:[]
    }
];


module.exports =  Interaction;
},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){

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
},{}],26:[function(require,module,exports){
var Person = DS.Model.extend({
  name: DS.attr('string'),
  age: DS.attr('number')
});

module.exports = Person;

},{}],27:[function(require,module,exports){
var ReactionModel = DS.Model.extend({
  name: DS.attr('string'),
  evaluation: DS.attr('string'),
  nextScene: DS.belongsTo('scene'),
  scene: DS.belongsTo('scene'),
  transition: DS.hasMany('string')
});



module.exports =  ReactionModel;
},{}],28:[function(require,module,exports){
var SceneModel = DS.Model.extend({
  name: DS.attr('string'),
  lesson: DS.belongsTo('lesson', {inverse:'scenes'}),
  content: DS.attr('string'),
  interaction: DS.belongsTo('interaction', {inverse:'scene'}),
  
  // pointers are interactions that lead to this scene
  // pointers: DS.hasMany('interaction', {async:true,inverse:'nextScene'}),
  // reactions: DS.hasMany('reaction')
  // interactionChange:function () {
  //    console.log("observing",this);
  //    console.log(this.get('interaction.id'));
  //  }.observes('interaction')
});

var content=[
'<span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"><br><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); font-weight: bold; text-decoration-line: underline; vertical-align: baseline; white-space: pre-wrap;"></span></span><p dir="rtl" style="line-height: 1.1500000000000001; margin-top: 0pt; margin-bottom: 10pt; text-align: right;"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;">ة</span><img src="https://lh6.googleusercontent.com/v5AiiQv6fT4oxSLIyu81ZtJxxGicRnoVLTTqeiP39E6FORVKZdm-BTGzXMvd5TUrT8lrJWHGSHX6KPIcH0VfSWDOfz24hpXQ8hbU7eUIGD2P7dTgvDFN9Le-_ently8akt7ooNQ" width="291px;" height="212px;" style="line-height: 1.1500000000000001; border: none; -webkit-transform: rotate(0rad);"><br></p><p dir="rtl" style="line-height: 1.1500000000000001; margin-top: 0pt; margin-bottom: 10pt; text-align: right;"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"></span></p><span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"></span><p dir="rtl" style="margin-top: 0pt; margin-bottom: 10pt; line-height: 1.1500000000000001; text-align: right;"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;">١٣.٨ مليون طن مخلفات منزلي</span></p><p dir="rtl" style="line-height: 1.1500000000000001; margin-top: 0pt; margin-bottom: 10pt; text-align: right;"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"><span id="sceditor-start-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span><span id="sceditor-end-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span>٣٨ ألف طن في اليوم</span></p><span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"></span><p dir="rtl" style="line-height: 1.1500000000000001; margin-top: 0pt; margin-bottom: 10pt; text-align: right;"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;">١٧٣ كيلو قمامة من كل شخص في العام</span></p><span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"></span><p dir="rtl" style="line-height: 1.1500000000000001; margin-top: 0pt; margin-bottom: 10pt; text-align: right;"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;">٥٠٠ جرام قمامة من كل شخص كل يوم</span></p><span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"><br><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"></span><br><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"></span><br><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"></span></span>',
'<span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"><span id="docs-internal-guid-b3adafe1-f39a-7451-7f9f-a13ab3508f60"><br></span></span><div style="text-align: center;"><span id="sceditor-start-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span><img src="https://lh6.googleusercontent.com/VZSq5qX-1EAbaB7NNWX1duDiux5LwKEbEy8kT2tjYIRhaYIIDKRi_8u59DtWQLQJi3OhanR9aj4O9ZBUtnfT_dal6EaRDfljTqsIHd-HCXrR58kMNCiv5QzpHQASJQ" width="401px;" height="455px;" style="border: none; -webkit-transform: rotate(0rad);"><span id="sceditor-end-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span></div><span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"><span id="docs-internal-guid-b3adafe1-f39a-7451-7f9f-a13ab3508f60"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"></span><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); font-weight: bold; text-decoration-line: underline; vertical-align: baseline; white-space: pre-wrap;"></span></span></span><p dir="rtl" style="line-height: 1.1500000000000001; margin-top: 0pt; margin-bottom: 10pt; text-align: right;"><br></p><span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"><span id="docs-internal-guid-b3adafe1-f39a-7451-7f9f-a13ab3508f60"></span><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"></span></span>',
'<div style="text-align: center;"><span id="sceditor-start-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span><span id="sceditor-end-marker" class="sceditor-selection sceditor-ignore" style="line-height: 0; display: none;"> </span><iframe width="560" height="315" src="http://www.youtube.com/embed/YknKtGIhFCo?wmode=opaque" data-youtube-id="YknKtGIhFCo" frameborder="0" allowfullscreen=""></iframe></div><span id="docs-internal-guid-b3adafe1-f390-0e84-4136-7fe98728774e"><span style="font-size: 16px; font-family: Calibri; color: rgb(0, 0, 0); vertical-align: baseline; white-space: pre-wrap;"></span></span>'
];


SceneModel.FIXTURES = [
    {
        id:1,
        name: "Scene 1",
        content:content[0],
        lesson: 1,
        interaction:1
    },
    {
        id:2,
        name: "Scene 2",
        content:content[1],
        lesson: 1,
        interaction:2
    },
    {
        id:4,
        name: "Scene 3",
        content: content[2],
        lesson: 1,
        interaction:null
    },
    {
        id:5,
        name: "The End",
        content:content[1],
        lesson: 1,
        interaction:null
    },
     {
        id:3,
        name: "Scene 1",
        lesson: 2,
        interaction:null
    }
];

module.exports =  SceneModel;
},{}],29:[function(require,module,exports){
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

},{"../utils/color":47}],30:[function(require,module,exports){
var User = DS.Model.extend({
    name: DS.attr(),
    email: DS.attr(),
    bio: DS.attr(),
    avatarUrl: DS.attr(),
    creationDate: DS.attr(),
    lessons: DS.hasMany('lesson', {async:true})
});

// User.reopenClass({
//     FIXTURES: [{
//         id: 1,
//         name: 'Sponge Bob',
//         email: 'bob@sponge.com',
//         bio: 'Lorem ispum dolor sit amet in voluptate fugiat nulla pariatur.',
//         avatarUrl: 'http://jkneb.github.io/ember-crud/assets/images/avatars/sb.jpg',
//         creationDate: 'Mon, 26 Aug 2013 20:23:43 GMT'
//     }, {
//         id: 2,
//         name: 'John David',
//         email: 'john@david.com',
//         bio: 'Lorem ispum dolor sit amet in voluptate fugiat nulla pariatur.',
//         avatarUrl: 'http://jkneb.github.io/ember-crud/assets/images/avatars/jk.jpg',
//         creationDate: 'Fri, 07 Aug 2013 10:10:10 GMT'
//     }
//     ]
// });

module.exports =  User;

},{}],31:[function(require,module,exports){
ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin);

module.exports = ApplicationRoute;

},{}],32:[function(require,module,exports){
module.exports =  Ember.Route.extend({
  model: function() {
    return ['purple', 'green', 'orange'];
  }
});

},{}],33:[function(require,module,exports){
module.exports =  Ember.Route.extend({
  model: function() {
    return this.store.find(' lesson');
  }
});

},{}],34:[function(require,module,exports){
module.exports =  Ember.Route.extend({
  model: function() {
    return {
      name: "rebmE"
    };
  }
});

},{}],35:[function(require,module,exports){
module.exports =  Ember.Route.extend({
	beforeModel: function() {
    this.transitionTo('lessons');
  },
  model: function() {
    return this.store.find('lesson');
  }
});

},{}],36:[function(require,module,exports){
var LessonEditRoute = Em.Route.extend({
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  // beforeModel: function() {},
  // afterModel: function(model) {
  //   return model.get('startScene');
  // },

  model: function() {
    return this.modelFor('lesson');
  }
});

module.exports = LessonEditRoute;

},{}],37:[function(require,module,exports){
var LessonIndexRoute = Em.Route.extend({
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  // beforeModel: function() {},
  // afterModel: function() {},
  
  model: function() {
      return this.modelFor('lesson');
  }
});

module.exports =  LessonIndexRoute;
},{}],38:[function(require,module,exports){
module.exports =  Em.Route.extend({
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  // beforeModel: function(m) {
  // },
//   afterModel: function(model) {
//     var store = this.get('store');
//     var promises = [];
//     var i = model._data.startScene;
// // debugger
//     if(i!==null) {

//       modelId = model.get('id');
//       // promises.push(store.find('scene',  modelId).then(function(obj){
//       //   model.set('startScene', obj.get('firstObject'));
//       // }));
//     }

//     return Ember.RSVP.all(promises);
//   },
  
  model: function(params) {
      return this.store.find('lesson', params.lesson_id);
  }
});

},{}],39:[function(require,module,exports){
module.exports=require(33)
},{}],40:[function(require,module,exports){
var NewPersonRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('edit_person', { controller: 'new_person' });
  },
  model: function() {
    return this.store.createRecord('person');
  },
  deactivate: function() {
    var model = this.get('controller.model');
    if (!model.get('isSaving')) {
      model.deleteRecord();
    }
  }
});

module.exports = NewPersonRoute;

},{}],41:[function(require,module,exports){
var PersonRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('person');
  }
});

module.exports = PersonRoute;

},{}],42:[function(require,module,exports){
var ProtectedRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin);

module.exports = ProtectedRoute;

},{}],43:[function(require,module,exports){
var SceneEditRoute = Em.Route.extend({
  // activate: function() {},
  // deactivate: function() {},
  renderTemplate: function() {
    this.render('scene');
  },
  // beforeModel: function() {},
  // afterModel: function(model) {
  //   var store = this.get('store'),
  //       modelId = model.get('id');
  //       console.log("scene hook");
  //   var promises = [];
  //   if(model.interaction) {
  //     promises.push(store.find('interaction', {scene: modelId }));
  //   }

  //   return Ember.RSVP.all(promises);
  // },
  setupController: function(controller, model) {
    controller = this.controllerFor('scene');
    this._super(controller, model);
    controller.set('canEdit', true);
  },
  model: function() {
      return this.modelFor('scene');
  }
});


module.exports =  SceneEditRoute;
},{}],44:[function(require,module,exports){
module.exports =  Em.Route.extend({
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  // beforeModel: function() {},
  afterModel: function(model) {
    var store = this.get('store'),
        modelId = model.get('id');
    var promises = [];
    var i = model._data.interaction;

    if(i!==null) {
      console.log("scene hook");
      promises.push(store.find('interaction', {scene: modelId }).then(function(obj){
        model.set('interaction', obj.get('firstObject'));
      }));
    } else {
      model.set('interaction', null);
    }

    return Ember.RSVP.all(promises);
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('canEdit', false);
  },
  model: function(params) {
    // console.log(params); this is the working one
      return this.store.find('scene', params.scene_id);
  }
});

},{}],45:[function(require,module,exports){
module.exports =  Em.Route.extend({
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  // beforeModel: function() {},
  // afterModel: function() {},
  
  model: function() {
      return this.store.find('user');
  }
});

},{}],46:[function(require,module,exports){

Ember.TEMPLATES['RomanticRide.html'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<!DOCTYPE html><html><head><meta charset=\"utf-8\"><style>html { font-size: 100%; overflow-y: scroll; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }\n\nbody{\n  color:#444;\n  font-family:Georgia, Palatino, 'Palatino Linotype', Times, 'Times New Roman',\n              \"Hiragino Sans GB\", \"STXihei\", \"微软雅黑\", serif;\n  font-size:12px;\n  line-height:1.5em;\n  background:#fefefe;\n  width: 45em;\n  margin: 10px auto;\n  padding: 1em;\n  outline: 1300px solid #FAFAFA;\n}\n\na{ color: #0645ad; text-decoration:none;}\na:visited{ color: #0b0080; }\na:hover{ color: #06e; }\na:active{ color:#faa700; }\na:focus{ outline: thin dotted; }\na:hover, a:active{ outline: 0; }\n\nspan.backtick {\n  border:1px solid #EAEAEA;\n  border-radius:3px;\n  background:#F8F8F8;\n  padding:0 3px 0 3px;\n}\n\n::-moz-selection{background:rgba(255,255,0,0.3);color:#000}\n::selection{background:rgba(255,255,0,0.3);color:#000}\n\na::-moz-selection{background:rgba(255,255,0,0.3);color:#0645ad}\na::selection{background:rgba(255,255,0,0.3);color:#0645ad}\n\np{\nmargin:1em 0;\n}\n\nimg{\nmax-width:100%;\n}\n\nh1,h2,h3,h4,h5,h6{\nfont-weight:normal;\ncolor:#111;\nline-height:1em;\n}\nh4,h5,h6{ font-weight: bold; }\nh1{ font-size:2.5em; }\nh2{ font-size:2em; border-bottom:1px solid silver; padding-bottom: 5px; }\nh3{ font-size:1.5em; }\nh4{ font-size:1.2em; }\nh5{ font-size:1em; }\nh6{ font-size:0.9em; }\n\nblockquote{\ncolor:#666666;\nmargin:0;\npadding-left: 3em;\nborder-left: 0.5em #EEE solid;\n}\nhr { display: block; height: 2px; border: 0; border-top: 1px solid #aaa;border-bottom: 1px solid #eee; margin: 1em 0; padding: 0; }\n\n\npre , code, kbd, samp { \n  color: #000; \n  font-family: monospace; \n  font-size: 0.88em; \n  border-radius:3px;\n  background-color: #F8F8F8;\n  border: 1px solid #CCC; \n}\npre { white-space: pre; white-space: pre-wrap; word-wrap: break-word; padding: 5px 12px;}\npre code { border: 0px !important; padding: 0;}\ncode { padding: 0 3px 0 3px; }\n\nb, strong { font-weight: bold; }\n\ndfn { font-style: italic; }\n\nins { background: #ff9; color: #000; text-decoration: none; }\n\nmark { background: #ff0; color: #000; font-style: italic; font-weight: bold; }\n\nsub, sup { font-size: 75%; line-height: 0; position: relative; vertical-align: baseline; }\nsup { top: -0.5em; }\nsub { bottom: -0.25em; }\n\nul, ol { margin: 1em 0; padding: 0 0 0 2em; }\nli p:last-child { margin:0 }\ndd { margin: 0 0 0 2em; }\n\nimg { border: 0; -ms-interpolation-mode: bicubic; vertical-align: middle; }\n\ntable { border-collapse: collapse; border-spacing: 0; }\ntd { vertical-align: top; }\n\n@media only screen and (min-width: 480px) {\nbody{font-size:14px;}\n}\n\n@media only screen and (min-width: 768px) {\nbody{font-size:16px;}\n}\n\n@media print {\n  * { background: transparent !important; color: black !important; filter:none !important; -ms-filter: none !important; }\n  body{font-size:12pt; max-width:100%; outline:none;}\n  a, a:visited { text-decoration: underline; }\n  hr { height: 1px; border:0; border-bottom:1px solid black; }\n  a[href]:after { content: \" (\" attr(href) \")\"; }\n  abbr[title]:after { content: \" (\" attr(title) \")\"; }\n  .ir a:after, a[href^=\"javascript:\"]:after, a[href^=\"#\"]:after { content: \"\"; }\n  pre, blockquote { border: 1px solid #999; padding-right: 1em; page-break-inside: avoid; }\n  tr, img { page-break-inside: avoid; }\n  img { max-width: 100% !important; }\n  @page :left { margin: 15mm 20mm 15mm 10mm; }\n  @page :right { margin: 15mm 10mm 15mm 20mm; }\n  p, h2, h3 { orphans: 3; widows: 3; }\n  h2, h3 { page-break-after: avoid; }\n}\n</style><title>RomanticRide</title></head><body><h1 id=\"romanticride\">RomanticRide</h1>\n<p>After the fabilous success of PRKEI park and inspired by the popular GUC crushes facebook page, we decided that there isn't enaugh love in our park.</p>\n<p>So we decided to add some romance to PARKEI</p>\n<h3 id=\"task\">Task</h3>\n<p>To bring some romance you will need to impliment/modify a couple of new things</p>\n<h4 id=\"for-amusers\">For Amusers</h4>\n<p>You can Start by implimenting the <code>Romantic</code> interface.</p>\n<ul>\n<li>Only Amusers of type <code>Adult</code> and <code>Senior</code> impliment the <code>Romantic</code> interface</li>\n<li>The Romantic interface has 2 mehtods it imposes on its implimentors<ul>\n<li>public void hug();</li>\n<li>public int getConnectionAmount();</li>\n</ul>\n</li>\n</ul>\n<p>The catch is Adults and Seniors both interpret the strength of a realthionship differently\nso take care that for an <strong>Adult</strong> when they hug they're <code>love</code> increases, while for a <strong>Senior</strong> their <code>affection</code> is what increases.</p>\n<p>you'll need to impliment <em>love</em> and <em>affection</em> respectivly inside their relevent class;</p>\n<h4 id=\"for-rides\">For Rides</h4>\n<p>Now that we have romantic Amusers in PARKEI we need to gave them a sapce to practice romance.</p>\n<p>You need to create a new <em>FunRide</em> called <strong>RomanticRide</strong></p>\n<ul>\n<li>romantic rides can't be initialized only classes that inherit from it can.</li>\n<li>RomanticRide has to child rides <strong>LoveTunnel</strong> and <strong>Dancerina</strong></li>\n<li>in addition to it's FunRide behaviore RomanticRides have some constrains<ul>\n<li>only couples can board a romantic ride, should an amuser attempt to board one alone they would get a CouplesOnlyException</li>\n<li>only <strong>Romantic</strong> people are eligable to board a <strong>RomanticRide</strong></li>\n</ul>\n</li>\n<li>RomanticRides make it's riders happy.</li>\n<li>when a RomanticRide starts it's riders will hug.</li>\n</ul></body></html>");
  
});

Ember.TEMPLATES['RomanticRide.md'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("#RomanticRide\n\nAfter the fabilous success of PRKEI park and inspired by the popular GUC crushes facebook page, we decided that there isn't enaugh love in our park.\n\nSo we decided to add some romance to PARKEI\n\n###Task\n\nTo bring some romance you will need to impliment/modify a couple of new things\n\n####For Amusers\n\nYou can Start by implimenting the `Romantic` interface.\n\n- Only Amusers of type `Adult` and `Senior` impliment the `Romantic` interface\n- The Romantic interface has 2 mehtods it imposes on its implimentors\n	- public void hug();\n	- public int getConnectionAmount();\n\nThe catch is Adults and Seniors both interpret the strength of a realthionship differently\nso take care that for an **Adult** when they hug they're `love` increases, while for a **Senior** their `affection` is what increases.\n\nyou'll need to impliment *love* and *affection* respectivly inside their relevent class;\n\n####For Rides\n\n\nNow that we have romantic Amusers in PARKEI we need to gave them a sapce to practice romance.\n\nYou need to create a new *FunRide* called **RomanticRide**\n\n- romantic rides can't be initialized only classes that inherit from it can.\n- RomanticRide has to child rides **LoveTunnel** and **Dancerina**\n- in addition to it's FunRide behaviore RomanticRides have some constrains\n	- only couples can board a romantic ride, should an amuser attempt to board one alone they would get a CouplesOnlyException\n	- only **Romantic** people are eligable to board a **RomanticRide**\n- RomanticRides make it's riders happy.\n- when a RomanticRide starts it's riders will hug.");
  
});

Ember.TEMPLATES['application'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n           <a ");
  hashContexts = {'href': depth0};
  hashTypes = {'href': "STRING"};
  options = {hash:{
    'href': ("view.href")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" class=\"btn\">\n            Leçons\n            </a>\n        ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n           <a ");
  hashContexts = {'href': depth0};
  hashTypes = {'href': "STRING"};
  options = {hash:{
    'href': ("view.href")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" class=\"btn\" >\n            Tableau\n            </a>\n        ");
  return buffer;
  }

  data.buffer.push("\n<div class=\"main-container\"><header class=\"navbar navbar-static-top bs-docs-nav main-header\" id=\"top\" role=\"banner\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <button class=\"navbar-toggle\" type=\"button\" data-toggle=\"collapse\" data-target=\".bs-navbar-collapse\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      \n        <a href=\"../\" class=\"navbar-brand logo\">abkar</a>\n      \n    </div>\n    <nav class=\"collapse navbar-collapse bs-navbar-collapse\" role=\"navigation\">\n      \n      <ul class=\"nav navbar-nav navbar-right\">\n        ");
  hashContexts = {'tagName': depth0,'href': depth0};
  hashTypes = {'tagName': "STRING",'href': "BOOLEAN"};
  options = {hash:{
    'tagName': ("li"),
    'href': (false)
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "lessons", options) : helperMissing.call(depth0, "link-to", "lessons", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        ");
  hashContexts = {'tagName': depth0,'href': depth0};
  hashTypes = {'tagName': "STRING",'href': "BOOLEAN"};
  options = {hash:{
    'tagName': ("li"),
    'href': (false)
  },inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "dashboard", options) : helperMissing.call(depth0, "link-to", "dashboard", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        <li>\n          <a id=\"feedbackForm\" href=\"https://docs.google.com/forms/d/1ZHTGJUY_oqzwwL1pigcD2Ls9Q6MGtsV6HGcEAXmFA0s/viewform\" class=\"btn\">Donnez votre avis</a>\n        </li>\n      </ul>\n    </nav>\n  </div>\n</header>\n  <main class=\"container-fluid\">\n  ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("  \n  </main>\n  \n  \n  <footer class=\"footer\" >\n    <p>droit d'auteur © abkar 2014</p>\n  </footer>\n  </div>");
  return buffer;
  
});

Ember.TEMPLATES['dashboard'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("\n  <div class=\"col-sm-6 col-md-4 col-lg-3\">\n    <div class=\"thumbnail\">\n      <div style=\"background:");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "color", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\" class=\"lesson-color\"></div>\n      <div class=\"caption\">\n        <h3>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h3>\n        <p>\n        ");
  hashContexts = {'class': depth0,'role': depth0};
  hashTypes = {'class': "STRING",'role': "STRING"};
  options = {hash:{
    'class': ("btn btn-primary"),
    'role': ("button")
  },inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "lesson", "", options) : helperMissing.call(depth0, "link-to", "lesson", "", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        ");
  hashContexts = {'class': depth0,'role': depth0};
  hashTypes = {'class': "STRING",'role': "STRING"};
  options = {hash:{
    'class': ("btn btn-default"),
    'role': ("button")
  },inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "lesson.edit", "", options) : helperMissing.call(depth0, "link-to", "lesson.edit", "", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "remove", "", {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-danger\">Supprimer</button>\n      </div>\n    </div>\n  </div>\n  ");
  return buffer;
  }
function program2(depth0,data) {
  
  
  data.buffer.push("Aperçu");
  }

function program4(depth0,data) {
  
  
  data.buffer.push("Modifier");
  }

  data.buffer.push("\n<div class=\"row\">\n  <div class=\"col-sm-6 col-md-4 col-lg-3\">\n  <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "createLesson", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"thumbnail glyphicon glyphicon-plus create-btn\"></a>\n  &nbsp;\n    ");
  data.buffer.push("\n  </div>\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "model", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>");
  return buffer;
  
});

Ember.TEMPLATES['edit_person'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashContexts, hashTypes, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"container\">\n  <h3>Edit/Create Person Template</h3>\n\n  <form ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{
    'on': ("submit")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n    <div class=\"form-group\">\n      <label for=\"name\">Name</label><br>\n      ");
  hashContexts = {'valueBinding': depth0,'id': depth0,'classNames': depth0,'autofocus': depth0};
  hashTypes = {'valueBinding': "STRING",'id': "STRING",'classNames': "STRING",'autofocus': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextField", {hash:{
    'valueBinding': ("name"),
    'id': ("name"),
    'classNames': ("form-control"),
    'autofocus': ("autofocus")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    </div>\n    <div class=\"form-group\">\n      <label for=\"age\">Age</label>\n      ");
  hashContexts = {'valueBinding': depth0,'id': depth0,'classNames': depth0};
  hashTypes = {'valueBinding': "STRING",'id': "STRING",'classNames': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.TextField", {hash:{
    'valueBinding': ("age"),
    'id': ("age"),
    'classNames': ("form-control")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    </div>\n    <button class=\"btn btn-default\" type=\"submit\">Save</button>\n    <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-default\">Cancel</button>\n  </form>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("\n  <div class=\"col-sm-6 col-md-4 col-lg-3\">\n    <div class=\"thumbnail\">\n      <div style=\"background:");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "color", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\" class=\"lesson-color\"></div>\n      <div class=\"caption\">\n        <h3>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h3>\n        <p>\n        ");
  hashContexts = {'class': depth0,'role': depth0};
  hashTypes = {'class': "STRING",'role': "STRING"};
  options = {hash:{
    'class': ("btn btn-primary"),
    'role': ("button")
  },inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "lesson", "", options) : helperMissing.call(depth0, "link-to", "lesson", "", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        ");
  hashContexts = {'class': depth0,'role': depth0};
  hashTypes = {'class': "STRING",'role': "STRING"};
  options = {hash:{
    'class': ("btn btn-default"),
    'role': ("button")
  },inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "lesson.edit", "", options) : helperMissing.call(depth0, "link-to", "lesson.edit", "", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n        <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "remove", "", {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-danger\">Remove</button>\n      </div>\n    </div>\n  </div>\n  ");
  return buffer;
  }
function program2(depth0,data) {
  
  
  data.buffer.push("Preview");
  }

function program4(depth0,data) {
  
  
  data.buffer.push("Edit");
  }

  data.buffer.push("\n<div class=\"row\">\n  <div class=\"col-sm-6 col-md-4 col-lg-3\">\n  <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "createLesson", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"thumbnail glyphicon glyphicon-plus create-btn\"></a>\n  &nbsp;\n    ");
  data.buffer.push("\n  </div>\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "model", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>");
  return buffer;
  
});

Ember.TEMPLATES['interaction'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n  <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleEdit", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-default pull-right\">\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "isEditing", {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    <i class=\"glyphicon glyphicon-pencil\"></i>\n  </a>\n");
  return buffer;
  }
function program2(depth0,data) {
  
  
  data.buffer.push("\n      Sauver \n    ");
  }

function program4(depth0,data) {
  
  
  data.buffer.push("\n      Modifier \n    ");
  }

function program6(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes;
  data.buffer.push("\n  <div  class=\"panel panel-default\">\n    <div class=\"panel-heading\">\n      <label for=\"\">Interaction Type\n      ");
  hashContexts = {'content': depth0,'value': depth0};
  hashTypes = {'content': "ID",'value': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("model.types"),
    'value': ("model.type")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n      </label>\n    </div>\n  <br>\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "model.isDrag", {hash:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "model.isChoose", {hash:{},inverse:self.noop,fn:self.program(12, program12, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "model.isContinue", {hash:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </div>\n");
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n    <div class=\"panel panel-info\">\n      <div class=\"panel-heading\">\n       <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "itemAdd", "model", "item", {hash:{},contexts:[depth0,depth0,depth0],types:["STRING","ID","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-info btn-sm pull-right\">Ajouter objet</button>\n      <h3 class=\"panel-title\">Objets</h3>\n      </div>\n      <ul class=\"list-group\">\n      ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "item", "in", "items", {hash:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </ul>\n    </div>\n\n     <div class=\"panel panel-success\">\n      <div class=\"panel-heading\">\n      <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "itemAdd", "model", "target", {hash:{},contexts:[depth0,depth0,depth0],types:["STRING","ID","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-default btn-sm pull-right\">Ajouter Cible</button>\n      <h3 class=\"panel-title\">Cible</h3>\n      </div>\n      <ul class=\"list-group\">\n      ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "target", "in", "targets", {hash:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </ul>\n    </div>\n  ");
  return buffer;
  }
function program8(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n        <li class=\"list-group-item\">\n          <a  ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "selectImage", "item", "image", {hash:{},contexts:[depth0,depth0,depth0],types:["STRING","ID","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn\"><img ");
  hashContexts = {'src': depth0};
  hashTypes = {'src': "STRING"};
  options = {hash:{
    'src': ("item.image_src")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push("  class=\"small-image img-responsive\"></a>\n          <label class=\"media-heading\">Objet Name: ");
  hashContexts = {'value': depth0};
  hashTypes = {'value': "ID"};
  options = {hash:{
    'value': ("item.name")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("</label>\n          <label for=\"\">Cible: ");
  hashContexts = {'content': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'value': depth0};
  hashTypes = {'content': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'value': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("model.targets"),
    'optionValuePath': ("content.id"),
    'optionLabelPath': ("content.name"),
    'value': ("item.value")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</label>\n          ");
  data.buffer.push("\n          <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "itemRemove", "model", "item", "item", {hash:{},contexts:[depth0,depth0,depth0,depth0],types:["STRING","ID","ID","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("  type=\"button\" title=\"Delete\" class=\"btn btn-info pull-right\" aria-hidden=\"true\">Supprimer &times;</button>\n           \n        </li>\n      ");
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n        <li class=\"list-group-item\">\n          <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "selectImage", "target", "image", {hash:{},contexts:[depth0,depth0,depth0],types:["STRING","ID","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("  class=\"btn\"><img ");
  hashContexts = {'src': depth0};
  hashTypes = {'src': "STRING"};
  options = {hash:{
    'src': ("target.image_src")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push("  class=\"img-responsive small-image\"></a>\n          |\n          <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "selectImage", "target", "hover", {hash:{},contexts:[depth0,depth0,depth0],types:["STRING","ID","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("  class=\"btn\"><img ");
  hashContexts = {'src': depth0};
  hashTypes = {'src': "STRING"};
  options = {hash:{
    'src': ("target.hover_src")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push("  class=\"img-responsive small-image\"></a>\n          <label class=\"media-heading\">Cible Name: ");
  hashContexts = {'value': depth0};
  hashTypes = {'value': "ID"};
  options = {hash:{
    'value': ("target.name")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("</label>\n          ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.log.call(depth0, "target.nextScene", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n          <label for=\"\">Acène Suivante (");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "target.nextScene.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(") : ");
  hashContexts = {'content': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'prompt': depth0,'selection': depth0,'value': depth0};
  hashTypes = {'content': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'prompt': "STRING",'selection': "ID",'value': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("scenes"),
    'optionValuePath': ("content"),
    'optionLabelPath': ("content.name"),
    'prompt': ("select scene"),
    'selection': ("target.nextScene"),
    'value': ("target.nextScene")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n\n          </label>\n          ");
  data.buffer.push("\n           <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "itemRemove", "model", "target", "target", {hash:{},contexts:[depth0,depth0,depth0,depth0],types:["STRING","ID","ID","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" type=\"button\" title=\"Delete\" class=\"btn btn-info pull-right\" aria-hidden=\"true\">Supprimer &times;</button>\n           \n        </li>\n      ");
  return buffer;
  }

function program12(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n     <div class=\"panel panel-success\">\n      <div class=\"panel-heading\">\n      <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "itemAdd", "model", "target", {hash:{},contexts:[depth0,depth0,depth0],types:["STRING","ID","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-default btn-sm pull-right\">Ajouter Choix</button>\n      <h3 class=\"panel-title\">Choix</h3>\n      </div>\n      <ul class=\"list-group\">\n      ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "target", "in", "targets", {hash:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n      </ul>\n    </div>\n  ");
  return buffer;
  }
function program13(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n        <li class=\"list-group-item\">\n           <div style=\"background:");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "target.color", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\" class=\"choice\">\n             ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "target.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n           </div>\n          <label class=\"media-heading\">Choix: ");
  hashContexts = {'value': depth0};
  hashTypes = {'value': "ID"};
  options = {hash:{
    'value': ("target.name")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("</label>\n          ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.log.call(depth0, "target.nextScene", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n          <label for=\"\">Acène Suivante (");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "target.nextScene.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(") : ");
  hashContexts = {'content': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'prompt': depth0,'selection': depth0,'value': depth0};
  hashTypes = {'content': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'prompt': "STRING",'selection': "ID",'value': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("scenes"),
    'optionValuePath': ("content"),
    'optionLabelPath': ("content.name"),
    'prompt': ("select scene"),
    'selection': ("target.nextScene"),
    'value': ("target.nextScene")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n\n          </label>\n          ");
  data.buffer.push("\n           <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "itemRemove", "model", "target", "target", {hash:{},contexts:[depth0,depth0,depth0,depth0],types:["STRING","ID","ID","STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" type=\"button\" title=\"Delete\" class=\"btn btn-info pull-right\" aria-hidden=\"true\">Supprimer &times;</button>\n           \n        </li>\n      ");
  return buffer;
  }

function program15(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n    <div class=\"panel-body\">\n      ");
  hashContexts = {'content': depth0,'optionLabelPath': depth0,'selected': depth0,'value': depth0,'prompt': depth0,'class': depth0};
  hashTypes = {'content': "ID",'optionLabelPath': "STRING",'selected': "ID",'value': "ID",'prompt': "STRING",'class': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
    'content': ("scenes"),
    'optionLabelPath': ("content.name"),
    'selected': ("selectedNextScene"),
    'value': ("selectedNextScene"),
    'prompt': ("Please select the next scene"),
    'class': ("form-control input-lg")
  },contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n    </div>\n  ");
  return buffer;
  }

function program17(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "model.isDrag", {hash:{},inverse:self.noop,fn:self.program(18, program18, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "model.isChoose", {hash:{},inverse:self.noop,fn:self.program(29, program29, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "model.isContinue", {hash:{},inverse:self.noop,fn:self.program(32, program32, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  \n");
  return buffer;
  }
function program18(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n    <div class=\"drag-select\">\n        <ul class=\"dragable-area list-unstyled\">\n        ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "model.items", {hash:{},inverse:self.program(22, program22, data),fn:self.program(19, program19, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </ul>\n        <ul class=\"targets-area list-unstyled\" >\n        ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "model.targets", {hash:{},inverse:self.program(27, program27, data),fn:self.program(24, program24, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        </ul>\n    </div>\n  ");
  return buffer;
  }
function program19(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes;
  data.buffer.push("\n          ");
  hashContexts = {'value': depth0,'model': depth0};
  hashTypes = {'value': "ID",'model': "ID"};
  stack1 = helpers.view.call(depth0, "App.ItemView", {hash:{
    'value': ("value"),
    'model': ("")
  },inverse:self.noop,fn:self.program(20, program20, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        ");
  return buffer;
  }
function program20(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n            <img ");
  hashContexts = {'src': depth0};
  hashTypes = {'src': "STRING"};
  options = {hash:{
    'src': ("image_src")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" class=\"img-responsive\" />\n          ");
  return buffer;
  }

function program22(depth0,data) {
  
  
  data.buffer.push("\n          Acun objet à faire glisser\n        ");
  }

function program24(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes;
  data.buffer.push("\n          ");
  hashContexts = {'value': depth0,'model': depth0};
  hashTypes = {'value': "ID",'model': "ID"};
  stack1 = helpers.view.call(depth0, "App.TargetView", {hash:{
    'value': ("value"),
    'model': ("")
  },inverse:self.noop,fn:self.program(25, program25, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n        ");
  return buffer;
  }
function program25(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n            <img ");
  hashContexts = {'src': depth0,'data-src': depth0,'data-hover': depth0};
  hashTypes = {'src': "STRING",'data-src': "STRING",'data-hover': "STRING"};
  options = {hash:{
    'src': ("image_src"),
    'data-src': ("image_src"),
    'data-hover': ("hover_src")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" draggable=\"false\" class=\"drag-target img-responsive\" />\n          ");
  return buffer;
  }

function program27(depth0,data) {
  
  
  data.buffer.push("\n          Pas de cible\n        ");
  }

function program29(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n  <hr>\n    <div class=\"row clearfix\">\n      ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "target", "in", "model.targets", {hash:{},inverse:self.noop,fn:self.program(30, program30, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n  ");
  return buffer;
  }
function program30(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n      <div class=\"col-sm-12 col-md-6\">\n      <div ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "next", "target", {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"choice thumbnail\" style=\"background:");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "target.color", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\" >");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "target.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" </div> \n      </div>\n      ");
  return buffer;
  }

function program32(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n  <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "next", "model", {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-block btn-lg btn-primary\">Continuer à ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "nextScene.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" </button>\n    \n  ");
  return buffer;
  }

  data.buffer.push("\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "canEdit", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "isEditing", {hash:{},inverse:self.program(17, program17, data),fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES['lesson'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("\n");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES['lessons'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n  ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("col-sm-6 col-md-4 col-lg-3")
  },inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "lesson", "", options) : helperMissing.call(depth0, "link-to", "lesson", "", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n    <div class=\"thumbnail\">\n      <div style=\"background:");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "color", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\" class=\"lesson-color\"></div>\n      <div class=\"caption\">\n        <h3 class=\"center\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h3>\n      </div>\n    </div>\n  ");
  return buffer;
  }

  data.buffer.push("\n<div class=\"row\">\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "model", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>");
  return buffer;
  
});

Ember.TEMPLATES['login'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n      <div class=\"alert alert-danger\">\n        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "errorMessage", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n      </div>\n    ");
  return buffer;
  }

  data.buffer.push("<div class=\"container\">\n  <div class=\"page-header\">\n    <h3>Sign in</h3>\n  </div>\n  <div class=\"col-sm-8 col-sm-offset-2\">\n\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "errorMessage", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n    <form ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "login", {hash:{
    'on': ("submit")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n      <div class=\"form-group text-center\">\n        <a class=\"btn btn-social btn-facebook\">\n          <i class=\"fa fa-facebook\"></i>\n          Sign in with Facebook\n        </a>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"identification\" class=\"control-label\">Username or Email</label>\n        ");
  hashContexts = {'type': depth0,'class': depth0,'id': depth0,'value': depth0,'autofocus': depth0};
  hashTypes = {'type': "STRING",'class': "STRING",'id': "STRING",'value': "ID",'autofocus': "STRING"};
  options = {hash:{
    'type': ("text"),
    'class': ("form-control"),
    'id': ("identification"),
    'value': ("identification"),
    'autofocus': ("autofocus")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n      </div>\n      <div class=\"form-group\">\n        <label for=\"password\" class=\"control-label\">Password</label>\n        ");
  hashContexts = {'type': depth0,'class': depth0,'id': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'class': "STRING",'id': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("password"),
    'class': ("form-control"),
    'id': ("password"),
    'value': ("password")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n      </div>\n      <button type=\"submit\" class=\"btn btn-primary\"><i class=\"fa fa-unlock-alt\"></i> Sign in</button>\n    </form>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['people'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("<i class=\"fa fa-plus\"></i> New Person");
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("\n      <tr>\n        <td>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</td>\n        <td>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "age", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</td>\n        <td>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "person", "", options) : helperMissing.call(depth0, "link-to", "person", "", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</td>\n      </tr>\n    ");
  return buffer;
  }
function program4(depth0,data) {
  
  
  data.buffer.push("View");
  }

function program6(depth0,data) {
  
  
  data.buffer.push("\n      <tr>\n        <td colspan=\"3\" class=\"warning\">No content</td>\n      </tr>\n    ");
  }

  data.buffer.push("<div class=\"container\">\n  <h2>People Template</h2>\n\n  <ul class=\"list-inline\">\n    <li>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "new_person", options) : helperMissing.call(depth0, "link-to", "new_person", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\n  </ul>\n\n  <table class=\"table table-bordered table-striped\">\n    <thead>\n    <th>Name</th>\n    <th>Age</th>\n    <th>Action</th>\n    </thead>\n    <tbody>\n    ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "controller", {hash:{},inverse:self.program(6, program6, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n    </tbody>\n  </table>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['person'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("<i class=\"fa fa-long-arrow-left\"></i> All People");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("<i class=\"fa fa-pencil\"></i> Edit");
  }

  data.buffer.push("<div class=\"container\">\n  <h3>Person Template</h3>\n\n  <p><strong>Name:</strong> ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</p>\n  <p><strong>Age:</strong> ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "age", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</p>\n\n  <div class=\"btn-group\">\n    ");
  hashContexts = {'classNames': depth0};
  hashTypes = {'classNames': "STRING"};
  options = {hash:{
    'classNames': ("btn btn-default")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "people", options) : helperMissing.call(depth0, "link-to", "people", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n    ");
  hashContexts = {'classNames': depth0};
  hashTypes = {'classNames': "STRING"};
  options = {hash:{
    'classNames': ("btn btn-default")
  },inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "edit_person", "model", options) : helperMissing.call(depth0, "link-to", "edit_person", "model", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n    <a href=\"#\" class=\"btn btn-default\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "destroy", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("><i class=\"fa fa-trash-o\"></i> Destroy</a>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['protected'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<div class=\"container\">\n  <h2>Protected Template</h2>\n  <div class=\"alert alert-info\">\n    If you can see this page, that means you are authenticated.\n  </div>\n</div>\n");
  
});

Ember.TEMPLATES['scene'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n  ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("btn btn-default glyphicon glyphicon-log-out refelect")
  },inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "lesson.edit", "lesson", options) : helperMissing.call(depth0, "link-to", "lesson.edit", "lesson", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n    ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "editTitle", {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n    ");
  return buffer;
  }
function program2(depth0,data) {
  
  
  data.buffer.push("\n    ");
  }

function program4(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n  ");
  hashContexts = {'class': depth0,'value': depth0,'focus-out': depth0,'insert-newline': depth0};
  hashTypes = {'class': "STRING",'value': "ID",'focus-out': "STRING",'insert-newline': "STRING"};
  options = {hash:{
    'class': ("edit"),
    'value': ("name"),
    'focus-out': ("togglEditTitle"),
    'insert-newline': ("togglEditTitle")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['edit-label'] || depth0['edit-label']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "edit-label", options))));
  data.buffer.push("\n");
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n  <span ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "togglEditTitle", {hash:{
    'on': ("doubleClick")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n");
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n    ");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("btn btn-default glyphicon glyphicon-log-out refelect")
  },inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "lesson", "lesson", options) : helperMissing.call(depth0, "link-to", "lesson", "lesson", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n\n    ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n  <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggelEditContent", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-default pull-right\">\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.unless.call(depth0, "editContent", {hash:{},inverse:self.program(13, program13, data),fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(" <i class=\"glyphicon glyphicon-pencil\"></i>\n  </button>\n");
  return buffer;
  }
function program11(depth0,data) {
  
  
  data.buffer.push("\n      Modifier\n      ");
  }

function program13(depth0,data) {
  
  
  data.buffer.push("\n      Sauver\n    ");
  }

function program15(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n  <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "clearContent", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" type=\"button\" class=\"btn btn-danger pull-left\" aria-hidden=\"true\">Clair</button>\n");
  return buffer;
  }

function program17(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n    <br class=\"clearfix\">\n        ");
  hashContexts = {'model': depth0,'value': depth0};
  hashTypes = {'model': "ID",'value': "ID"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "wysiwyg", {hash:{
    'model': ("model"),
    'value': ("model.content")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n        <hr>\n    ");
  return buffer;
  }

function program19(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n          ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['safe-string'] || depth0['safe-string']),stack1 ? stack1.call(depth0, "model.content", options) : helperMissing.call(depth0, "safe-string", "model.content", options))));
  data.buffer.push("\n        ");
  return buffer;
  }

function program21(depth0,data) {
  
  
  data.buffer.push("\n          S'il vous plaît insérer du contenu\n      ");
  }

function program23(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "interaction", {hash:{},inverse:self.program(26, program26, data),fn:self.program(24, program24, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  ");
  return buffer;
  }
function program24(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n      <button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "removeInteraction", "interaction", {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" type=\"button\" class=\"btn btn-danger pull-right\" aria-hidden=\"true\">Supprimer &times;</button>\n    ");
  return buffer;
  }

function program26(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n         <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "addInteraction", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-default pull-right\">Ajouter <i class=\"glyphicon glyphicon-plus\"></i>\n        </a>\n    ");
  return buffer;
  }

function program28(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n    ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "interaction", "interaction", options) : helperMissing.call(depth0, "render", "interaction", "interaction", options))));
  data.buffer.push("\n  ");
  return buffer;
  }

  data.buffer.push("<h2>\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "canEdit", {hash:{},inverse:self.program(8, program8, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    \n</h2>\n\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "canEdit", {hash:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "editContent", {hash:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n<div  class=\"panel panel-info well\">\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "editContent", {hash:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n     <section ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggelEditContent", {hash:{
    'on': ("doubleClick")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n        ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "model.content", {hash:{},inverse:self.program(21, program21, data),fn:self.program(19, program19, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n     </section>\n</div>\n\n<section class=\"clearfix\">\n  ");
  data.buffer.push("\n\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "canEdit", {hash:{},inverse:self.noop,fn:self.program(23, program23, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "interaction", {hash:{},inverse:self.noop,fn:self.program(28, program28, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  \n  ");
  data.buffer.push("\n  </section>");
  return buffer;
  
});

Ember.TEMPLATES['signup'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n      <div class=\"alert alert-danger\">\n        ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "errorMessage", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n      </div>\n    ");
  return buffer;
  }

  data.buffer.push("<div class=\"container\">\n  <div class=\"page-header\">\n    <h3>Create Account</h3>\n  </div>\n  <div class=\"col-sm-8 col-sm-offset-2\">\n\n    ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "errorMessage", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n    <form ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "signup", {hash:{
    'on': ("submit")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n      <div class=\"form-group text-center\">\n        <a class=\"btn btn-social btn-facebook\">\n          <i class=\"fa fa-facebook\"></i>\n          Sign in with Facebook\n        </a>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"username\" class=\"control-label\">Username</label>\n        ");
  hashContexts = {'type': depth0,'class': depth0,'value': depth0,'autofocus': depth0};
  hashTypes = {'type': "STRING",'class': "STRING",'value': "ID",'autofocus': "STRING"};
  options = {hash:{
    'type': ("text"),
    'class': ("form-control"),
    'value': ("username"),
    'autofocus': ("autofocus")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n      </div>\n      <div class=\"form-group\">\n        <label for=\"email\" class=\"control-label\">Email</label>\n        ");
  hashContexts = {'type': depth0,'class': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'class': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("text"),
    'class': ("form-control"),
    'value': ("email")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n      </div>\n      <div class=\"form-group\">\n        <label for=\"password\" class=\"control-label\">Password</label>\n        ");
  hashContexts = {'type': depth0,'class': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'class': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("password"),
    'class': ("form-control"),
    'value': ("password")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n        <small class=\"help-block\">Must be at least 8 characters long.</small>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"confirmPassword\" class=\"control-label\">Confirm Password</label>\n        ");
  hashContexts = {'type': depth0,'class': depth0,'value': depth0};
  hashTypes = {'type': "STRING",'class': "STRING",'value': "ID"};
  options = {hash:{
    'type': ("password"),
    'class': ("form-control"),
    'value': ("confirmPassword")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n      </div>\n      <button type=\"submit\" class=\"btn btn-success\" ");
  hashContexts = {'disabled': depth0};
  hashTypes = {'disabled': "STRING"};
  options = {hash:{
    'disabled': ("isProcessing")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push("><i class=\"fa fa-rocket\"></i> Sign up</button>\n    </form>\n  </div>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['scene/index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n  <div class=\"col-sm-6 col-md-4 col-lg-3\">\n    <div class=\"thumbnail\">\n      <div style=\"background:");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "lesson.color", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\" class=\"lesson-color\"></div>\n      <div class=\"caption\">\n        <h3>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</h3>\n        <p>\n       ");
  data.buffer.push("\n        </p>\n      </div>\n    </div>\n  </div>\n  ");
  return buffer;
  }

  data.buffer.push("\n<div class=\"row\">\n    <div class=\"col-sm-6 col-md-4 col-lg-3\">\n    <a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "addScene", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"thumbnail glyphicon glyphicon-plus create-btn\"></a>\n    ");
  data.buffer.push("\n  </div>\n");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "model", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>");
  return buffer;
  
});

Ember.TEMPLATES['lesson/edit'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("\n");
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n	");
  hashContexts = {'class': depth0,'value': depth0,'focus-out': depth0,'insert-newline': depth0};
  hashTypes = {'class': "STRING",'value': "ID",'focus-out': "STRING",'insert-newline': "STRING"};
  options = {hash:{
    'class': ("edit"),
    'value': ("title"),
    'focus-out': ("togglEditTitle"),
    'insert-newline': ("togglEditTitle")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['edit-label'] || depth0['edit-label']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "edit-label", options))));
  data.buffer.push("\n");
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n	<span ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "togglEditTitle", {hash:{
    'on': ("doubleClick")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n");
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n    <br class=\"clearfix\">\n        ");
  hashContexts = {'model': depth0,'value': depth0,'attr': depth0};
  hashTypes = {'model': "ID",'value': "ID",'attr': "STRING"};
  data.buffer.push(escapeExpression(helpers.view.call(depth0, "wysiwyg", {hash:{
    'model': ("model"),
    'value': ("description"),
    'attr': ("description")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n        <hr>\n    ");
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n          ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['safe-string'] || depth0['safe-string']),stack1 ? stack1.call(depth0, "description", options) : helperMissing.call(depth0, "safe-string", "description", options))));
  data.buffer.push("\n        ");
  return buffer;
  }

function program11(depth0,data) {
  
  
  data.buffer.push("\n          No content, please insert description\n      ");
  }

function program13(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n  ");
  hashContexts = {'tagName': depth0,'href': depth0};
  hashTypes = {'tagName': "STRING",'href': "BOOLEAN"};
  options = {hash:{
    'tagName': ("li"),
    'href': (false)
  },inverse:self.noop,fn:self.program(14, program14, data),contexts:[depth0,depth0,depth0],types:["STRING","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "scene.edit", "model", "scene", options) : helperMissing.call(depth0, "link-to", "scene.edit", "model", "scene", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  ");
  return buffer;
  }
function program14(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n     <a ");
  hashContexts = {'href': depth0};
  hashTypes = {'href': "STRING"};
  options = {hash:{
    'href': ("view.href")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" class='btn btn-default'>\n      ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "scene.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n      <i ");
  hashContexts = {'bubbles': depth0};
  hashTypes = {'bubbles': "BOOLEAN"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "removeScene", "scene", {hash:{
    'bubbles': (false)
  },contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\" glyphicon glyphicon-remove remove-scene\" aria-hidden=\"true\"></i>\n      </a>\n  ");
  return buffer;
  }

function program16(depth0,data) {
  
  
  data.buffer.push("\n  Rien Scène\n  ");
  }

  data.buffer.push("<h2>\n");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("btn glyphicon glyphicon-log-out refelect")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "dashboard", options) : helperMissing.call(depth0, "link-to", "dashboard", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "editTitle", {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n</h2>\n\n<div  class=\"panel panel-info well\">\n    ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "editDescription", {hash:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n     <section ");
  hashContexts = {'on': depth0};
  hashTypes = {'on': "STRING"};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggelEditDescription", {hash:{
    'on': ("doubleClick")
  },contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n        ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "description", {hash:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n     </section>\n</div>\n\n\n<div class=\"scenes\">\n    <ul class=\"nav nav-tabs\">\n");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "scene", "in", "scenes", {hash:{},inverse:self.program(16, program16, data),fn:self.program(13, program13, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n  	<li>\n  		<a ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "addScene", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-default\" title=\"Add Scene \" ><i class=\" glyphicon glyphicon-plus \"></i></a>\n  	</li>\n</ul>\n</div>\n");
  return buffer;
  
});

Ember.TEMPLATES['lesson/index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("Modifier");
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n	<div  class=\"panel panel-info well\">\n      ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['safe-string'] || depth0['safe-string']),stack1 ? stack1.call(depth0, "description", options) : helperMissing.call(depth0, "safe-string", "description", options))));
  data.buffer.push("\n	</div>\n");
  return buffer;
  }

  data.buffer.push("\n\n");
  hashContexts = {'class': depth0};
  hashTypes = {'class': "STRING"};
  options = {hash:{
    'class': ("btn btn-default pull-left")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "lesson.edit", "model", options) : helperMissing.call(depth0, "link-to", "lesson.edit", "model", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n<h2><span>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "title", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span></h2>\n\n<hr>\n\n");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "description", {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n\n\n<button ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "start", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" class=\"btn btn-block btn-lg btn-primary\" >Début</button>\n        \n");
  return buffer;
  
});

Ember.TEMPLATES['components/_input_text'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '';


  return buffer;
  
});

Ember.TEMPLATES['components/input-email'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "_input_text", options) : helperMissing.call(depth0, "partial", "_input_text", options))));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES['components/input-text'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.partial || depth0.partial),stack1 ? stack1.call(depth0, "_input_text", options) : helperMissing.call(depth0, "partial", "_input_text", options))));
  data.buffer.push("\n");
  return buffer;
  
});



},{}],47:[function(require,module,exports){
function getRandColor(brightness){
    //6 levels of brightness from 0 to 5, 0 being the darkest
    brightness = brightness || 3;
    var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    var mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
    var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){ return Math.round(x/2.0);});
    return "rgb(" + mixedrgb.join(",") + ")";
  }


 module.exports = getRandColor;
},{}],48:[function(require,module,exports){
var ApplicationView = Ember.View.extend({
  didInsertElement: function () {

    $('#feedbackForm').click(function () {
      window.localStorage.setItem('feedback', 1);
      window.location.href = "https://docs.google.com/forms/d/1ZHTGJUY_oqzwwL1pigcD2Ls9Q6MGtsV6HGcEAXmFA0s/viewform";
    });

    function loadExample() {
        localStorage['DS.LSAdapter'] = '{"App.Lesson":{"records":{"am78g":{"id":"am78g","title":"Example Lesson","color":"rgb(160,199,113)","description":"<p style=\\"text-align: center;\\"><font size=\\"4\\"><br></font></p><p style=\\"text-align: center;\\"><font size=\\"4\\">This is a Lessons description, you can Edit the lesson by going clicking on the Edit button next to the lesson\'s name.</font></p><p style=\\"text-align: center;\\"><font size=\\"4\\"><br></font></p><p style=\\"text-align: center;\\"><font size=\\"4\\">Click on start to Start the lesson.</font></p><p style=\\"text-align: center;\\"><font size=\\"4\\"><br></font></p><p style=\\"text-align: center;\\"><font size=\\"4\\">You can edit this text by going to lesson edit and double clicking, double click on the text preview below to stop editing.</font></p><p style=\\"text-align: center;\\"><font size=\\"4\\"><br></font></p><p style=\\"text-align: center;\\"><font size=\\"4\\">Double click on the name to change it as well.</font></p><p style=\\"text-align: center;\\"><font size=\\"4\\"><br></font></p><p style=\\"text-align: center;\\"><font size=\\"4\\">I<span id=\\"sceditor-end-marker\\" class=\\"sceditor-selection sceditor-ignore\\" style=\\"line-height: 0; display: none;\\"> </span><span id=\\"sceditor-start-marker\\" class=\\"sceditor-selection sceditor-ignore\\" style=\\"line-height: 0; display: none;\\"> </span>f you mess things up beyond repair just go to the dashboard and remove the lesson , then refresh the page.</font></p>","date":null,"scenes":["rrgc8","kq8c1","9aq44","d2ing","fpcnf"],"ueer":null}}},"App.Scene":{"records":{"rrgc8":{"id":"rrgc8","name":"Scene1","content":"<p><font size=\\"4\\">This is a Scene, each lesson can be composed of none or many scenes, a scene is meant to break down the lesson into interactive parts.</font></p><p><font size=\\"4\\">students visit scene\'s based on their interaction.</font></p><p><font size=\\"4\\"><br></font></p><p><font size=\\"4\\">Click on the interaciton bellow to proceed<span id=\\"sceditor-end-marker\\" class=\\"sceditor-selection sceditor-ignore\\" style=\\"line-height: 0; display: none;\\"> </span><span id=\\"sceditor-start-marker\\" class=\\"sceditor-selection sceditor-ignore\\" style=\\"line-height: 0; display: none;\\"> </span></font></p>","lesson":"am78g","interaction":"sff0i"},"kq8c1":{"id":"kq8c1","name":"Scene two","content":"<p style=\\"text-align: left;\\"><fontsize=\\"5\\"><font size=\\"4\\">This&nbsp;Scene&nbsp;contains&nbsp;a&nbsp;decisive&nbsp;interaction&nbsp;unlik<spanid=\\"sceditor-end-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"><spanid=\\"sceditor-start-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\">e&nbsp;the&nbsp;previous&nbsp;scene&nbsp;where&nbsp;the&nbsp;button&nbsp;just&nbsp;sends&nbsp;you&nbsp;to&nbsp;the&nbsp;next&nbsp;scene.</spanid=\\"sceditor-start-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"></spanid=\\"sceditor-end-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"></font></fontsize=\\"5\\"></p><p><pstyle=\\"text-align:center;\\"><br></pstyle=\\"text-align:center;\\"></p><p></p><p><pstyle=\\"text-align:center;\\"><font size=\\"4\\">This scene&nbsp;features&nbsp;a&nbsp;drag&nbsp;and&nbsp;drop&nbsp;interaction.</font></pstyle=\\"text-align:center;\\"></p><p><pstyle=\\"text-align:center;\\"><font size=\\"4\\">Based&nbsp;on&nbsp;your&nbsp;choice&nbsp;the&nbsp;lesson&nbsp;will&nbsp;progress&nbsp;differently.</font></pstyle=\\"text-align:center;\\"></p><p></p><p><pstyle=\\"text-align:center;\\"><font size=\\"4\\">This&nbsp;is&nbsp;useful&nbsp;for&nbsp;customizing&nbsp;the&nbsp;learning&nbsp;experience&nbsp;based&nbsp;on&nbsp;students&nbsp;understanding.</font></pstyle=\\"text-align:center;\\"></p><p></p><p><pstyle=\\"text-align:center;\\"><br></pstyle=\\"text-align:center;\\"></p><p></p><p style=\\"text-align: center; \\"><pstyle=\\"text-align:center;\\"><fontsize=\\"4\\"><pstyle=\\"text-align:center;\\"><fontsize=\\"4\\"><pstyle=\\"text-align:center;\\"><fontsize=\\"4\\"><pstyle=\\"text-align:center;\\"><pstyle=\\"text-align:center;\\"><fontsize=\\"7\\"><font size=\\"7\\">Which recycle bin should we throw&nbsp;the&nbsp;chicken in<span id=\\"sceditor-end-marker\\" class=\\"sceditor-selection sceditor-ignore\\" style=\\"line-height: 0; display: none;\\"> </span><span id=\\"sceditor-start-marker\\" class=\\"sceditor-selection sceditor-ignore\\" style=\\"line-height: 0; display: none;\\"> </span>?</font></fontsize=\\"7\\"></pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"></fontsize=\\"4\\"></pstyle=\\"text-align:center;\\"></fontsize=\\"4\\"></pstyle=\\"text-align:center;\\"></fontsize=\\"4\\"></pstyle=\\"text-align:center;\\"><br></p>","lesson":"am78g","interaction":"0mt87"},"9aq44":{"id":"9aq44","name":"Scene3","content":"<div style=\\"text-align: center;\\"><font size=\\"5\\">Congrats you won the ability to choose where to go next<span id=\\"sceditor-end-marker\\" class=\\"sceditor-selection sceditor-ignore\\" style=\\"line-height: 0; display: none;\\"> </span><span id=\\"sceditor-start-marker\\" class=\\"sceditor-selection sceditor-ignore\\" style=\\"line-height: 0; display: none;\\"> </span></font></div><p></p><pstyle=\\"text-align:center;\\"><fontsize=\\"5\\"><spanid=\\"sceditor-end-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"><spanid=\\"sceditor-start-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"></spanid=\\"sceditor-start-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"></spanid=\\"sceditor-end-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"></fontsize=\\"5\\"></pstyle=\\"text-align:center;\\">","lesson":"am78g","interaction":"9p36b"},"d2ing":{"id":"d2ing","name":"Blue Bin Scene","content":"<div style=\\"text-align: center;\\"><span id=\\"sceditor-start-marker\\" class=\\"sceditor-selection sceditor-ignore\\" style=\\"line-height: 0; display: none;\\"> </span><span id=\\"sceditor-end-marker\\" class=\\"sceditor-selection sceditor-ignore\\" style=\\"line-height: 0; display: none;\\"> </span><br></div><div style=\\"text-align: center;\\"><font size=\\"4\\">Oh no,&nbsp;seems&nbsp;you&nbsp;picked&nbsp;the&nbsp;<fontcolor=\\"#cc3366\\"><font color=\\"#cc3366\\">wrong</font>&nbsp;Bin</fontcolor=\\"#cc3366\\"></font></div><p></p><font size=\\"4\\"><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"></font><div style=\\"text-align: center;\\"><font size=\\"4\\">Now&nbsp;maybe&nbsp;you&nbsp;should&nbsp;watch&nbsp;this&nbsp;short&nbsp;video</font></div><font size=\\"4\\"><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"></font><p></p><font size=\\"4\\"><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"></font><div style=\\"text-align: center;\\"><font size=\\"4\\">the video is&nbsp;about&nbsp;a&nbsp;<fontcolor=\\"#33cc66\\"><font color=\\"#33cc66\\">recycling</font>&nbsp;campaign&nbsp;in&nbsp;Egypt</fontcolor=\\"#33cc66\\"></font></div><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><p></p><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><div style=\\"text-align: center;\\"><br></div><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><div style=\\"text-align: center;\\"><iframe width=\\"560\\" height=\\"315\\" src=\\"http://www.youtube.com/embed/YknKtGIhFCo?wmode=opaque\\" data-youtube-id=\\"YknKtGIhFCo\\" frameborder=\\"0\\" allowfullscreen=\\"\\"></iframe><br></div><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><p></p><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><div style=\\"text-align: center;\\"><br></div><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><p></p><pstyle=\\"text-align:center;\\"><fontcolor=\\"#cc3366\\"><pstyle=\\"text-align:center;\\"><pstyle=\\"text-align:center;\\"><fontcolor=\\"#33cc66\\"><pstyle=\\"text-align:center;\\"><spanid=\\"sceditor-start-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"><spanid=\\"sceditor-end-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"><pstyle=\\"text-align:center;\\"><iframewidth=\\"560\\"height=\\"315\\"src=\\"http: www.youtube.com=\\"\\" embed=\\"\\" yknktgihfco?wmode=\\"opaque&quot;data-youtube-id=&quot;YknKtGIhFCo&quot;frameborder=&quot;0&quot;allowfullscreen=&quot;&quot;\\"></iframewidth=\\"560\\"height=\\"315\\"src=\\"http:></pstyle=\\"text-align:center;\\"></spanid=\\"sceditor-end-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"></spanid=\\"sceditor-start-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"></pstyle=\\"text-align:center;\\"></fontcolor=\\"#33cc66\\"></pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"></fontcolor=\\"#cc3366\\"></pstyle=\\"text-align:center;\\">","lesson":"am78g","interaction":"nbqpg"},"fpcnf":{"id":"fpcnf","name":"The End","content":"<div style=\\"text-align: center;\\"><pstyle=\\"text-align:center;\\"><fontsize=\\"7\\"><br></fontsize=\\"7\\"></pstyle=\\"text-align:center;\\"></div><div style=\\"text-align: center;\\"><pstyle=\\"text-align:center;\\"><fontsize=\\"7\\"><br></fontsize=\\"7\\"></pstyle=\\"text-align:center;\\"></div><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><div style=\\"text-align: center;\\"><font size=\\"7\\">Congratulations You Finished!!</font></div><font size=\\"7\\"><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"></font><p></p><font size=\\"7\\"><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"></font><div style=\\"text-align: center;\\">This Scene does not contain&nbsp;an&nbsp;interaction&nbsp;which&nbsp;is&nbsp;why&nbsp;you&nbsp;cannot&nbsp;see&nbsp;anything&nbsp;below&nbsp;while&nbsp;not&nbsp;in&nbsp;edit<spanid=\\"sceditor-end-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"><spanid=\\"sceditor-start-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\">&nbsp;mode.</spanid=\\"sceditor-start-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"></spanid=\\"sceditor-end-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"></div><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><p></p><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><div style=\\"text-align: center;\\">&nbsp;<span id=\\"sceditor-end-marker\\" class=\\"sceditor-selection sceditor-ignore\\" style=\\"line-height: 0; display: none;\\"> </span><span id=\\"sceditor-start-marker\\" class=\\"sceditor-selection sceditor-ignore\\" style=\\"line-height: 0; display: none;\\"> </span></div><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><p></p><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><div style=\\"text-align: center;\\">Feel free to edit this lesson as you please</div><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><p></p><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><div style=\\"text-align: center;\\">currently this MVP is running locally on your computer only you can see the changes you make</div><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><p></p><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><div style=\\"text-align: center;\\"><font size=\\"3\\">if you wanna make more lessons go to the <a href=\\"http://0.0.0.0:3000/#/dashboard\\"><font color=\\"#66cc33\\"><b>Dashboard</b></font></a></font></div><pstyle=\\"text-align:center;\\"></pstyle=\\"text-align:center;\\"><p></p><pstyle=\\"text-align:center;\\"><fontsize=\\"7\\"><pstyle=\\"text-align:center;\\"><fontsize=\\"3\\"><spanid=\\"sceditor-end-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"><spanid=\\"sceditor-start-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"><pstyle=\\"text-align:center;\\"><fontsize=\\"5\\"><pstyle=\\"text-align:center;\\"><fontsize=\\"5\\"><pstyle=\\"text-align:center;\\"><fontsize=\\"5\\"><pstyle=\\"text-align:center;\\"><fontsize=\\"5\\"><ahref=\\"http: 0.0.0.0:3000=\\"\\" #=\\"\\" dashboard\\"=\\"\\"><fontcolor=\\"#66cc33\\"></fontcolor=\\"#66cc33\\"></ahref=\\"http:></fontsize=\\"5\\"></pstyle=\\"text-align:center;\\"></fontsize=\\"5\\"></pstyle=\\"text-align:center;\\"></fontsize=\\"5\\"></pstyle=\\"text-align:center;\\"></fontsize=\\"5\\"></pstyle=\\"text-align:center;\\"></spanid=\\"sceditor-start-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"></spanid=\\"sceditor-end-marker\\"class=\\"sceditor-selectionsceditor-ignore\\"style=\\"line-height:0;display:none;\\"></fontsize=\\"3\\"></pstyle=\\"text-align:center;\\"></fontsize=\\"7\\"></pstyle=\\"text-align:center;\\">","lesson":"am78g","interaction":null}}},"App.Interaction":{"records":{"nbqpg":{"id":"nbqpg","name":"InteractionforBlueBinScene","type":"continue","scene":"d2ing","nextScene":"kq8c1","items":[],"targets":[]},"0mt87":{"id":"0mt87","name":"InteractionforScene2","type":"drag","scene":"kq8c1","nextScene":"kq8c1","items":["mrndc"],"targets":["umdli","1p9gp"]},"9p36b":{"id":"9p36b","name":"InteractionforScene3","type":"choose","scene":"9aq44","nextScene":"9aq44","items":[],"targets":["b35j7","hm37p","2a7d4","jvboa"]},"sff0i":{"id":"sff0i","name":"Interaction for Scene1","type":"continue","scene":"rrgc8","nextScene":"kq8c1","items":[],"targets":[]}}},"App.Target":{"records":{"umdli":{"id":"umdli","name":"organic","content":null,"color":"rgb(94,58,84)","image":"/images/green-trash-closed.png","hover":"/images/green-trash-open.png","value":null,"interaction":"0mt87","nextScene":"9aq44"},"1p9gp":{"id":"1p9gp","name":"nonorganic","content":null,"color":"rgb(167,121,84)","image":"/images/blue-trash-closed.png","hover":"/images/blue-trash-open.png","value":null,"interaction":"0mt87","nextScene":"d2ing"},"b35j7":{"id":"b35j7","name":"See the scene that those who choose the blue bin go to","content":null,"color":"rgb(73,139,136)","image":"/images/green-trash-closed.png","hover":"/images/green-trash-open.png","value":null,"interaction":"9p36b","nextScene":"d2ing"},"hm37p":{"id":"hm37p","name":"Go back to chicken scene","content":null,"color":"rgb(176,115,53)","image":"/images/green-trash-closed.png","hover":"/images/green-trash-open.png","value":null,"interaction":"9p36b","nextScene":"kq8c1"},"2a7d4":{"id":"2a7d4","name":"Go back to the first scene","content":null,"color":"rgb(104,113,137)","image":"/images/green-trash-closed.png","hover":"/images/green-trash-open.png","value":null,"interaction":"9p36b","nextScene":"rrgc8"},"jvboa":{"id":"jvboa","name":"Finish this lesson","content":null,"color":"rgb(100,157,81)","image":"/images/green-trash-closed.png","hover":"/images/green-trash-open.png","value":null,"interaction":"9p36b","nextScene":"fpcnf"}}},"App.Item":{"records":{"mrndc":{"id":"mrndc","name":"chicken","image":"/images/composable/poultry.jpg","value":"umdli","interaction":"0mt87"}}}}';
        window.location.reload();
    }

    if (!localStorage['DS.LSAdapter']) {
        alert('On dirait que c\'est votre première fois, nous chargeons une leçon par défaut pour vous aider à démarrer.');
        loadExample();
    } else {


      window.onbeforeunload = (function () {
        if(!localStorage.getItem('feedback'))
            return "pourriez-vous nous donner quelques informations avant de partir?";
      });

        this.get('controller.store').find('lesson').then(function (lessons) {
            if(lessons.get('length')===0) {
                if(confirm("vous avez supprimé toutes les leçons, aimeriez-vous nous recharger la leçon, par exemple?")) {
                    loadExample();
                }
            }
        });
    }
  }
});

module.exports = ApplicationView;

},{}],49:[function(require,module,exports){
var EditLabelView = Ember.TextField.extend({
  didInsertElement: function() {
    this.$().focus();
  }
});

Ember.Handlebars.helper('edit-label', EditLabelView);

module.exports =  EditLabelView;
},{}],50:[function(require,module,exports){
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
},{}],51:[function(require,module,exports){
var LoginView = Ember.View.extend({
  willDestroyElement: function() {
    this.get('context').set('errorMessage', null);
  }
});

module.exports = LoginView;


},{}],52:[function(require,module,exports){
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
},{}],53:[function(require,module,exports){
Ember.TextField.reopen({
  attributeBindings: ['autofocus', 'title', 'required']
});
},{}],54:[function(require,module,exports){
var WysiwygEditor = Ember.TextArea.extend({
    attr:'content',
    didInsertElement: function(){

        var model = this.get('model'),
        attr = this.get('attr');
        var loadCSS = function(url, callback){
                var link = document.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = url;
                link.id = 'theme-style';

                document.getElementsByTagName('head')[0].appendChild(link);
        };          
        var initEditor = this.$().sceditor({
                    plugins: "none",
                    style: "/javascripts/vendor/sceditor/jquery.sceditor.default.min.css",
                    width: "100%",
                    height:"400px",
                    resizeMaxWidth:"100%",
                    resizeMinWidth:"100%",
                    resizeMinHeight: "400px",
                    emoticonsEnabled:false,
                    toolbar: "bold,italic,underline|left,center,right,justify,ltr,rtl|size,color,removeformat|bulletlist,orderedlist,table,code|image,link,unlink,youtube|source",
                    resizeEnabled:true,
        });
        var instance = this.$().sceditor('instance');
        instance.keyUp(function(e){
            model.set(attr, instance.val());
        });
        var theme = "/javascripts/vendor/sceditor//themes/default.min.css";
        loadCSS(theme, initEditor);
    }
});

// Ember.Handlebars.helper('wysiwyg', WysiwygEditor);


module.exports =  WysiwygEditor;

},{}]},{},[22])
;