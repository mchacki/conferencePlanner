/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.overViewOld = Backbone.View.extend({
  el: '#content',

  initialize: function () {
    var self = this;
    this.talks = new app.Talks();
    this.talks.fetch({
      success: function() {
        self.appendCollectionTracks();
      }
    });
  },

  setup: {
    start: 9,
    stop: 18,
    steps: 0.5
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
    this.appendTime();
    this.appendTrack();

    if( $('#availableTalks').children().length <= 1) {
      this.appendCollectionTracks();
    }

    return this;
  },

  appendCollectionTracks: function () {
    var self = this;
    $.each(this.talks.models, function(k,v) {
      self.addTalk(v.attributes.Topic);
    });
  },

  appendTime: function() {
    var count;

    for (count=this.setup.start; count<=this.setup.stop; count = count+this.setup.steps) {
    var tr = document.createElement('tr');
    $('#planTable tbody').append(tr);
      var td = document.createElement('td');
      $(td).text(count);
      $(tr).append(td);
    }
  },

  appendTrack: function() {
    var th = document.createElement('th');
    $(th).text("Track: "+this.count);

    var children = $('#planTable tbody').children();
    $('#planTable thead tr').append(th);
    $('#planTable thead tr').append(th);
    $.each(children, function(k,v) {
      var emptyTd = document.createElement('td');
      //var emptyUl = document.createElement('ul');
      $(emptyTd).addClass('droptrue sortable ui-sortable')
      .css("background", "cyan")
      .css("min-height", "40px")
      .css("width", "100%");
      $(this).append(emptyTd);
     // $(emptyTd).append(emptyUl);
    });
    this.count++;

    this.applyEvents();
  },

  applyCSS: function () {
    var winHeight = $(window).height() - 40;
    $('#leftOverview').height(winHeight);
    $('#midOverview').height(winHeight);
    $('#rightOverview').height(winHeight);
  },

  applyEvents: function () {
    var self = this;
    /*
    $( "ul.droptrue" ).sortable({
      cursor: 'move',
      cursorAt: {top: 17, left: 50},
      connectWith: "ul",
      start: function (e, ui) {
        $(ui.item).css('width', '200px');
      },
      stop: function (e, ui) {
        $(ui.item).css('width', 'auto');
      }
    }); 
    */
    
    
    $( "td.droptrue" ).droppable({
      drop: function( event, ui ) {
        alert("!");
      }
    });
    
  },

  addTrack: function (track) {
    this.count = this.count+1;
    var ul = document.createElement('ul');
    $(ul).addClass('droptrue sortable');
    var id = 'sortable'+this.count;
    $(ul).attr('id',id);
    $('#midOverview').append(ul);
    $(ul).append("Track "+(this.count));
    this.addRemoveButton(ul);
    this.addNewButton();
    //content missing

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

  addNewButton: function () {
    $('.newTrack').remove();
    var button = document.createElement('button');
    $(button).text("Add track");
    $(button).attr("id", "newTrack");
    $(button).addClass("newTrack");
    $("#sortable"+this.count).prepend(button);
  },

  pullTrackToTalks: function () {
    var elements = $('#sortable'+this.count).children('li');
    $('#availableTalks').append(elements);
  },

  removeTrack: function (e) {
    var addButton = false;
    this.pullTrackToTalks()

    if (this.count === 2) {
      addButton = false;
    }
    else {
      addButton = true;
    }

    $('#sortable'+this.count).remove();
    this.count = this.count - 1;

    if (addButton === true) {
      this.addRemoveButton('#sortable'+this.count);
    }

    this.addNewButton();
    this.setTrackSize();
  },

  addTalk: function (content) {
    if (content === undefined) {
      content = "TEXT";
    }
    var li = document.createElement('li');
    $(li).addClass('ui-state-default')
     .text(content)
     .draggable();
     
    $('#availableTalks').append(li);
  },

  setTrackSize: function () {
    var counter = $('#midOverview').children().length;
    var width = 100 / counter;
    $('#midOverview ul').css("width", width+"%");
  }

});
