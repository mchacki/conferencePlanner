/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true*/
/*global window, $, Backbone */

var app = app || {};
var login = false;

app.Router = Backbone.Router.extend({

  routes: {
    ""        : "main",
    "home"    : "main",
    "talks"   : "talks",
    "speaker" : "speaker",
    "login"   : "login"
  },

  initialize: function () {
    $(document).ajaxError(function(err1, err2) {
      if (err2.status === 401) {
        login = true;
      }
    });

    this.loginView = new app.loginView();
    this.overView = new app.overView();
    this.naviView = new app.navigationView();
    this.speakerView = new app.SpeakerView();
    this.talkView = new app.TalkView();
  },

  main: function () {
    this.overView.render();
    this.naviView.setActive("home");
    this.naviView.render();
  },

  talks: function () {
    this.talkView.render();
    this.naviView.setActive("talks");
    this.naviView.render();
  },

  speaker: function () {
    this.speakerView.render();
    this.naviView.setActive("speaker");
    this.naviView.render();
  },

  login: function () {
    this.loginView.render();
  }

});

app.router = new app.Router();
Backbone.history.start();

if (login === true) {
  app.router.navigate('/login', true);
}
else {
  app.router.naviView.render();
}
