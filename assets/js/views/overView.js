/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.overView = Backbone.View.extend({
  el: '#content',

  initialize: function () {
  },

  count: 1,

  events: {
    "click #newTrack"    : "addTrack",
    "click .removeTrack" : "removeTrack"
  },

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
    var self = this;
    $( "ul.droptrue" ).sortable({
      cursor: 'move',
      cursorAt: {top: 17, left: 50},
      connectWith: "ul",
      start: function (e, ui) {
        $(ui.item).css('width', '200px');
      },
      stop: function (e, ui) {
        $(ui.item).css('width', '100%');
      }
    });
  },

  addTrack: function (track) {
    var ul = document.createElement('ul');
    $(ul).addClass('droptrue sortable');
    var id = 'sortable'+this.count;
    $(ul).attr('id',id);
    $('#midOverview').append(ul);
    $(ul).append("Track "+(this.count+1));
    this.addRemoveButton(ul);
    //content missing

    this.count = this.count+1;

    this.setTrackSize();
    this.applyEvents();
  },

  addRemoveButton: function (item) {
    $('.removeTrack').remove();
    var button = document.createElement('button');
    $(button).text("Remove");
    $(button).addClass("removeTrack");
    $(button).attr("id","deleteTrack"+this.count);
    $(item).append(button);
  },

  removedTrackToTalks: function () {

  },

  removeTrack: function (e) {
    console.log("before remo : " + this.count);
    this.removedTrackToTalks()
    var id = e.currentTarget.id;
    var count = id.replace( /^\D+/g, '');
    $('#sortable'+count).remove();

    if (this.count - 1 === 1) {
      this.setTrackSize();
      return;
    }

    this.count = this.count - 1;
    var ul = $('#sortable'+(this.count - 1));

    this.addRemoveButton(ul);
    this.setTrackSize();
    console.log("after remo : " + this.count);
  },

  addLiElement: function (content) {
    var li = document.createElement('li');
    $(li).addClass('ui-state-default');
    $(li).text("TEXT");
    //content missing

    $('#availableTalks').append(li);
  },

  setTrackSize: function () {
    var counter = $('#midOverview').children().length;
    var width = 100 / counter;
    $('#midOverview ul').css("width", width+"%");
  }

});
