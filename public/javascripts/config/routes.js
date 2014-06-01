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