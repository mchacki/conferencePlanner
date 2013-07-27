/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true*/
/*global window, $, Backbone */

var app = app || {};
app.Router = Backbone.Router.extend({

  routes: {
    ""        : "main",
    "home"    : "main",
    "talks"   : "talks",
    "speaker" : "speaker"
  },

  initialize: function () {
    this.overView = new app.overView();
    this.naviView = new app.navigationView();
    this.naviView.render();
    this.speakerView = new app.SpeakerView();
    this.talkView = new app.TalkView();
  },

  main: function () {
    this.overView.render();
    this.naviView.setActive("home");
  },

  talks: function () {
    this.talkView.render();
    this.naviView.setActive("talks");
  },

  speaker: function () {
    this.speakerView.render();
    this.naviView.setActive("speaker");
  }

});

app.router = new app.Router();
Backbone.history.start();
