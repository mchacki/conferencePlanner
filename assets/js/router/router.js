/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true, newcap: true */
/*global window, $, Backbone, document, arangoCollection, arangoHelper, dashboardView */

$(document).ready(function() {

  window.Router = Backbone.Router.extend({

    routes: {
      ""       : "main",
      "talks"   : "talks",
      "speaker" : "speaker"
    },

    initialize: {
      this.naviView = new window.navigationView();
    },

    main: {

    },

    talks: {

    },

    speaker: {

    }

  });

  window.App = new window.Router();
  Backbone.history.start();

});

