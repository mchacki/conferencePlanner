/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.overView = Backbone.View.extend({
  el: '#content',

  initialize: function () {
    var self = this;
    
    //TODO
    this.start = 540;
    this.slotSize = 30;
    this.slots = 16;
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
    "mouseup td.slot": "dropTalk",
    "mouseup" : "cancelDrag"
  },

  template: new EJS({url: 'templates/overView.ejs'}),


  getSizeOfTalk: function (t) {
    return 4;
  },

  removeFromParent: function(talk) {
    var p = talk.parentElement;
    if (p.tagName.toLowerCase() === "ul") {
      p.removeChild(talk);
      return;
    }
    var t = this.talks.get(talk.id);
    var id = p.id.split("_"),
      slotId = parseInt(id[0]),
      trackId = parseInt(id[1]);
    p.rowSpan = 1;
    for (i = this.getSizeOfTalk(t) - 1; i > 0; i--) {
      next = document.getElementById((slotId + i) + "_" + trackId);
      next.style.display = "";
    }
    p.removeChild(talk);
  },

  insertBackToParent: function(talk, p, sib) {
    if (p.tagName.toLowerCase() === "ul") {
      p.insertBefore(talk, sib);
      return;
    }
    var t = this.talks.get(talk.id);
    var id = p.id.split("_"),
      slotId = parseInt(id[0]),
      trackId = parseInt(id[1]);
      size = this.getSizeOfTalk(t);
    p.rowSpan = size;
    //t.size
    for (i = size - 1; i > 0; i--) {
      next = document.getElementById((slotId + i) + "_" + trackId);
      next.style.display = "none";
    }
    p.insertBefore(talk, sib);
  },

  grabTalk: function(e) {
    e = e || window.event;
    var sel = e.currentTarget;
    this.dragging = sel;
    this.oldSib = sel.nextElementSibling;
    this.oldParent = sel.parentElement;
    this.removeFromParent(sel);
    
    
    e.cancelBubble = true;
    e.stopPropagation();
  },

  checkAndReserveSpace: function (td, size) {
    var id = td.id.split("_"),
      slotId = parseInt(id[0]),
      trackId = parseInt(id[1]),
      i,
      next,
      failed = false;
      if (slotId + size > this.slots) {
        return false;
      }
      for (i = 1; i < size; i++) {
        next = document.getElementById((slotId + i) + "_" + trackId);
        if (next.style.display !== "none" && next.childNodes.length === 0) {
          next.style.display = "none";
        } else {
          failed = true;
          i--;
          break;
        }
      }
      if (failed) {
        for (i; i > 0; i--) {
          next = document.getElementById((slotId + i) + "_" + trackId);
          next.style.display = "";
        }
        return false;
      }
      td.rowSpan = size;
      return true;
  },

  dropTalk: function(e) {
    e = e || window.event;
    if (!this.dragging) {
      return;
    }
    e.cancelBubble = true;
    var sel = e.currentTarget;
    var talk = this.talks.get(this.dragging.id);
    if (this.checkAndReserveSpace(sel, this.getSizeOfTalk(talk))) {
      sel.appendChild(this.dragging);
      this.dragging = null;
      this.oldSib = null;
      this.oldParent = null;
    } else {
      this.cancelDrag();
    }
    e.stopPropagation();
  },

  cancelDrag: function(e) {
    if (!this.dragging) {
      return;
    }
    this.insertBackToParent(this.dragging, this.oldParent, this.oldSib);
    this.dragging = null;
    this.oldSib = null;
    this.oldParent = null;
  },

  render: function() {
    var self = this, i;
    $(this.el).html(this.template.render({
      tracks: this.tracks,
      start: this.start,
      slots: this.slots,
      slotSize: this.slotSize
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
    div.style.height = (this.getSizeOfTalk(t) * 37) + "px"
    $('#availableTalks').append(div);
  },

  appendCollectionTracks: function () {
    var self = this;
    this.talks.each(function(k) {
      self.addTalk(k);
    });
  }
});
