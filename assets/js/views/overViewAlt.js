/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.overView = Backbone.View.extend({
  el: '#content',

  initialize: function () {
    var self = this;
    
    //TODO
    this.conf = {
      _key: "123"
    };
    this.day = 1;
    this.days = 3;
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
    this.moveAbleDiv = document.createElement("div");
    this.moveAbleDiv.className = "moveable";
    $.ajax({
      url: "talksInConf/" + this.conf._key,
      method: "GET",
      success: function(data) {
        self.updateLinkedTalks(data);
      }
    });
  },

  events: {
    "mousedown .talk": "grabTalk",
    "mouseup td.slot": "dropTalk",
    "mouseup" : "cancelDrag",
    "mousemove" : "updateMoveAblePosition",
    "click .day": "switchDay"
  },

  template: new EJS({url: 'templates/overView.ejs'}),

  switchDay: function(e) {
    var newDay = parseInt(e.currentTarget.id.substring(4));
    $("#day_" + this.day).parent().toggleClass("active", false);
    $("#day_" + newDay).parent().toggleClass("active", true);
    $("#table_" + this.day).css("display", "none");
    $("#table_" + newDay).css("display", "");
    this.day = newDay;
  },

  updateMoveAblePosition: function(e) {
    var x,y;
    console.log("Gemeiert!");
    if (e) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x = event.clientX + document.body.scrollLeft;
      y = event.clientY + document.body.scrollTop;
    }
    x += 10;
    y += 10;
    this.moveAbleDiv.style.left = x + "px";
    this.moveAbleDiv.style.top = y + "px";
    console.log("Gemeiert!");
  },
  
  cleanUpMovable: function() {
    _.each(this.moveAbleDiv.childNodes, function(c) {
      this.moveAbleDiv.removeChild(c);
    });
  },
  
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
      dayId = parseInt(id[0]),
      slotId = parseInt(id[1]),
      trackId = parseInt(id[2]);
    p.rowSpan = 1;
    for (i = this.getSizeOfTalk(t) - 1; i > 0; i--) {
      next = document.getElementById(dayId + "_" + (slotId + i) + "_" + trackId);
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
      dayId = parseInt(id[0])
      slotId = parseInt(id[1]),
      trackId = parseInt(id[2]);
      size = this.getSizeOfTalk(t);
    p.rowSpan = size;
    //t.size
    for (i = size - 1; i > 0; i--) {
      next = document.getElementById(dayId + "_" + (slotId + i) + "_" + trackId);
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
    this.moveAbleDiv.appendChild(sel);
    e.stopPropagation();
  },

  checkAndReserveSpace: function (td, size) {
    var id = td.id.split("_"),
      dayId = parseInt(id[0]),
      slotId = parseInt(id[1]),
      trackId = parseInt(id[2]),
      i,
      next,
      failed = false;
      if (slotId + size > this.slots) {
        return false;
      }
      for (i = 1; i < size; i++) {
        next = document.getElementById(dayId + "_" + (slotId + i) + "_" + trackId);
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
          next = document.getElementById(dayId + "_" + (slotId + i) + "_" + trackId);
          next.style.display = "";
        }
        return false;
      }
      td.rowSpan = size;
      return true;
  },


  moveTalkToCalender: function(talkId, day, slot, track) {
    var td = document.getElementById(day + "_" + slot + "_" + track),
      talkDiv = document.getElementById(talkId);
      
     
    if (this.checkAndReserveSpace(td, this.getSizeOfTalk(talkId))) {
      td.appendChild(talkDiv);
      return true;
    }
    return false;
  },

  dropTalk: function(e) {
    e = e || window.event;
    if (!this.dragging) {
      return;
    }
    e.cancelBubble = true;
    var sel = e.currentTarget;
    var talk = this.talks.get(this.dragging.id);
    var tdId = sel.id.split("_");
    var day = tdId[0];
    var slot = tdId[1];
    var track = tdId[2];
    if (this.moveTalkToCalender(this.dragging.id, day, slot, track)) {
      $.ajax({
        url: "inConf/" + talk.get("_key") + "/" + this.conf._key,
        method: "POST",
        data: JSON.stringify({
          day: this.day,
          track: track,
          slot: slot
        })
      });
      this.cleanUpMovable();
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
    this.cleanUpMovable();
    this.dragging = null;
    this.oldSib = null;
    this.oldParent = null;
  },

  render: function(conference) {
    if (conference) {
      this.tracks = conference.tracks;
      this.start = conference.start;
      this.slots = conference.slots;
      this.slotSize = conference.slotSize;
      this.day = 1;
      this.days = conference.days;
    }
    var self = this, i;
    $(this.el).html(this.template.render({
      active_day: this.day,
      days: this.days,
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
    $(this.el).append(this.moveAbleDiv);
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
  },
  
  updateLinkedTalks: function(data) {
    var self = this;
    _.each(data, function(t) {
      var talkId = t._from.substring(t._from.lastIndexOf("/") + 1);
      self.moveTalkToCalender(talkId, t.day, t.slot, t.track);
    });
  }
});
