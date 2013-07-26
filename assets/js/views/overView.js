/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.overView = Backbone.View.extend({
  el: '.content',

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
  },

  applyEvents: function () {
    $( "ul.droptrue" ).sortable({
      connectWith: "ul"
    });
  },

  addTrack: function (content) {
    var ul = document.createElement('ul');
    $(ul).addClass('droptrue sortable');
    $(ul).css('id','sortable' + (this.count));
    $('#midOverview').append(ul);

    var li = document.createElement('li');
    $(li).addClass('ui-state-default');
    $(li).text("TEXT");
    $(ul).append(li);
    //content missing

    this.setTrackSize();
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
