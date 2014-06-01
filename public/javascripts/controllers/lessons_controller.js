var getRandColor = require('../utils/color');

var IndexController = Em.ArrayController.extend({
sortProperties: ['date', 'name'],
sortAscending: true,
  actions: {
    
  }
});

module.exports = IndexController;
