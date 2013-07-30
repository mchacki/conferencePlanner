/*jslint indent: 2, nomen: true, maxlen: 100, sloppy: true, vars: true, white: true, plusplus: true */
/*global require, exports, Backbone, EJS, $*/

var app = app || {};

app.TalkView = Backbone.View.extend({
  el: '#content',

  initialize: function () {
    var self = this;
    this.collection = new app.Talks();
    $.ajax({
      url: "list/speakers",
      method: "GET",
      success: function(list) {
        self.tbl = new app.LiveEditTable(
          ["Speaker", "Title", "Abstract", "Duration", "Category", "Level"],
          {
            Speaker:  {
              type: "selection",
              list: list
            },
            Category: {
              type: "selection",
              list: [
                {
                  id: "use_case",
                  text: "Use Case"
                },
                {
                  id: "detail",
                  text: "Technical / Algorithmic Detail"
                },
                {
                  id: "product",
                  text: "Product Demonstration"
                },
                {
                  id: "training",
                  text: "Training"
                }
              ]
            },
            Level: {
              type: "selection",
              list: [
                {
                  id: "beginner",
                  text: "Beginner"
                },
                {
                  id: "intermediate",
                  text: "Intermediate"
                },
                {
                  id: "advanced",
                  text: "Advanced"
                },
                {
                  id: "expert",
                  text: "Expert"
                }
              ]
            },
            onChange: function(o, row) {
              self.collection.save(o,
                function(obj) {
                  row.id = obj.get("_key");
                }
              );
            },
            onDelete: function(id) {
              self.collection.destroy(id);
            }
          }
        );
      },
      async: false
    });
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
    });
    $.ajax({
      url: "list/speakers",
      method: "GET",
      success: function(list) {
        self.tbl.updateSelectionList("Speaker", list);
      },
      async: true
    });
    
    
    
    
    return this;
  }

});
