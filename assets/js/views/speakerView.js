/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.SpeakerView = Backbone.View.extend({
  el: '#content',
  
  template: new EJS({url: 'templates/speakerView.ejs'}),

  initialize: function () {
    var self = this;
    this.collection = new app.Speakers();
    this.tbl = new app.LiveEditTable(
      ["Meier", "Hansi", "Fuxx"],
      self.save,
      self.insertNew
    );
  },

  save: function(o) {
    this.collection.save(o);
  },
  
  insertNew: function() {
    this.tbl.insertEmptyRow();
  },

  render: function() {
    var self = this;
    $(this.el).html("");
    $(this.el).append(this.tbl.getTableHTML());
    this.collection.fetch({
      success: function() {
        self.tbl.insertBulk(self.collection);
      }
    })
    return this;
  }

});
