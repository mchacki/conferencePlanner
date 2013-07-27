/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.TalkView = Backbone.View.extend({
  el: '#content',

  initialize: function () {
    var self = this;
    this.collection = new app.Talks();
    this.tbl = new app.LiveEditTable(
      ["Speaker", "Topic", "Abstract", "Duration", "Track", "Confirmed"],
      function(o, row) {
        self.collection.save(o,
          function(obj) {
            row.id = obj.get("_key");
          }
        );
      },
      function() {
        self.tbl.insertEmptyRow();
      }
    );
  },

  render: function() {
    var self = this;
    $(this.el).html("");
    $(this.el).append(this.tbl.getTableHTML());
    this.collection.fetch({
      success: function() {
        self.tbl.clean();
        self.tbl.insertBulk(self.collection.toArray());
      }
    })
    return this;
  }

});
