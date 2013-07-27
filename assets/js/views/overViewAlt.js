/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.overView = Backbone.View.extend({
  el: '#content',

  initialize: function () {
    var self = this;
    
    //TODO
    this.start = 540;
    this.unitSize = 30;
    this.units = 16;
    this.tracks = 4;
    this.rows = [];
    this.hr = {};
    this.talks = new app.Talks();
    this.dragging = null;
    this.oldSib = null;
    this.oldParent = null; 
  },

  events: {
    "mousedown .talk": "grabTalk",
    "mouseup td": "dropTalk",
    "mouseup" : "cancelDrag"
  },

  template: new EJS({url: 'templates/overView.ejs'}),

  grabTalk: function(e) {
    e = e || window.event;
    var sel = e.currentTarget;
    this.dragging = sel;
    this.oldSib = sel.nextElementSibling;
    this.oldParent = sel.parentElement;
    sel.parentElement.removeChild(sel);
    
    e.cancelBubble = true;
    e.stopPropagation();
  },

  dropTalk: function(e) {
    e = e || window.event;
    var sel = e.currentTarget;
    var talk = this.talks.get(this.dragging.id);
    sel.rowSpan = 4; // TODO
    
    sel.appendChild(this.dragging);
    this.dragging = null;
    this.oldSib = null;
    this.oldParent = null;
    e.cancelBubble = true;
    e.stopPropagation();
  },

  cancelDrag: function(e) {
    console.log("cancle");
    this.oldParent.insertBefore(this.dragging, this.oldSib);
    this.dragging = null;
    this.oldSib = null;
    this.oldParent = null;
  },

  render: function() {
    var self = this, i;
    $(this.el).html(this.template.render({
      tracks: this.tracks,
      start: this.start,
      units: this.units,
      unitSize: this.unitSize
    }));
    this.talks.fetch({
      success: function() {
        self.appendCollectionTracks();
      }
    });
    return this;
  },

  addTalk: function (t) {
    var div = document.createElement("div");
    div.className = "talk";
    div.id = t.get("_key");
    div.appendChild(
      document.createTextNode(t.get("Topic"))
    );
    div.style.height = (4 * 37) + "px"
    $('#availableTalks').append(div);
  },

  appendCollectionTracks: function () {
    var self = this;
    this.talks.each(function(k) {
      self.addTalk(k);
    });
  },

  setTrackSize: function () {
    var counter = $('#midOverview').children().length;
    var width = 100 / counter;
    $('#midOverview ul').css("width", width+"%");
  }

});
