var app = app || {};

app.Speakers = Backbone.Collection.extend({
  model: app.Speaker,
  url: "speaker"
});