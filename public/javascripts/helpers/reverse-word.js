// Please note that Handlebars helpers will only be found automatically by the
// resolver if their name contains a dash (reverse-word, translate-text, etc.)
// For more details: http://stefanpenner.github.io/ember-app-kit/guides/using-modules.html

module.exports =  Ember.Handlebars.makeBoundHelper(function(word) {
  return word.split('').reverse().join('');
});

