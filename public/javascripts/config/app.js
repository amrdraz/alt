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
