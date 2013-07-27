var app = app || {};

app.Talks = Backbone.Collection.extend({
  model: app.Talk,
  url: "talk",
  
  save: function(o, cb) {
    var mod = this.get(o._key);
    if (mod) {
      mod.save(o);
    } else {
      mod = this.create(o, {
        success: function(r) {
          cb(r);
        }
      });
    }
  },
  
  destroy: function(key) {
    var mod = this.get(key);
    if (mod) {
      mod.destroy();
      this.remove(mod);
    }
  },
  
  toArray: function() {
    return this.models.map(function(m) {
      return m.attributes;
    });
  },
});