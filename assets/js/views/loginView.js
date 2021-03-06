/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.loginView = Backbone.View.extend({
  el: '#content',

  initialize: function () {
    this.collection = new app.Sessions();
  },

  events: {
    "click #submitLogin"        : "login",
    "keypress #loginPassword"    : "checkKey",
    "keypress #loginUsername"    : "checkKey"
  },

  template: new EJS({url: 'templates/loginView.ejs'}),

  render: function() {
    $('#header').hide();
    $(this.el).html(this.template.text);
    return this;
  },

  checkKey: function(e) {
    if(e.which == 13) {
      this.login();
    }
  },

  backToLogin: function () {
    app.router.navigate('login',true);
  },

  login: function() {
    var username = $('#loginUsername').val();
    var password = $('#loginPassword').val();

    if( username === '') {
      alert("Username is empty");
      return;
    }
    if( password === '') {
      alert("Password is empty");
      return;
    }

    var response = this.collection.login(username, password);
    if (response === true) {
      $('#header').show();
      app.router.navigate('home', true);
    }
    else {
      this.loginError();
    }
  },

  loginError: function () {
    $('#loginErrorMsg').show();
  }

});
