var app = app || {};

app.Speaker = Backbone.Model.extend({
  idAttribute: "_key",
  
  isNew: function() {
    return !this.has("_key");
  },
  
  url: function() {
    var key = this.get("_key");
    if (!!key) {
      return "speaker/" + key;
    }
    return "speaker";
  }
  
});