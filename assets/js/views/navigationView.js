/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.navigationView = Backbone.View.extend({
  el: '#header',

  events: {
    "click li": "navTo"
  },

  init: function () {
  },

  template: new EJS({url: 'templates/navigationView.ejs'}),

  switchToTab: function(e) {
    console.log(e.currentTarget);
  },

  navTo: function(e) {
  
  },

  render: function() {
    $(this.el).html(this.template.text);
    return this;
  }

});
