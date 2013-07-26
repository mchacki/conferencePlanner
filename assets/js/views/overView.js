/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.overView = Backbone.View.extend({
  el: '#content',

  initialize: function () {
  },

  count: 0,

  template: new EJS({url: 'templates/overView.ejs'}),

  render: function() {
    $(this.el).html(this.template.text);
    this.applyEvents();
    this.applyCSS();
    this.setTrackSize();
    return this;
  },

  applyCSS: function () {
    var winHeight = $(window).height() - 40;
    $('#leftOverview').height(winHeight);
    $('#midOverview').height(winHeight);
    $('#rightOverview').height(winHeight);
  },

  applyEvents: function () {
    $( "ul.droptrue" ).sortable({
      connectWith: "ul",
      //mouse position
      start: function (e, ui) {
        $(ui.item).css('width', '100px');
      },
      stop: function (e, ui) {
        $(ui.item).css('width', '100%');
      }
    });
  },

  addTrack: function (track) {
    var ul = document.createElement('ul');
    $(ul).addClass('droptrue sortable');
    $(ul).css('id','sortable' + (this.count));
    $('#midOverview').append(ul);
    //content missing

    this.setTrackSize();
  },

  addLiElement: function (content) {
    var li = document.createElement('li');
    $(li).addClass('ui-state-default');
    $(li).text("TEXT");
    //content missing

    $('#availableTalks').append(li);
  },

  removeTrack: function () {

  },

  setTrackSize: function () {
    var counter = $('#midOverview').children().length;
    this.count = counter;
    var width = 100 / counter;
    $('#midOverview ul').css("width", width+"%");
  }

});
