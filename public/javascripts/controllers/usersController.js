module.exports =   Em.ArrayController.extend({
  usersCount: function  () {
    return this.get('model.length');
  }.property('@each')
});