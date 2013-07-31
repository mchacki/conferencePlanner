var app = app || {};

app.Sessions = Backbone.Collection.extend({
  model: app.Session,
  url: "login",

  login: function (username, password) {
    var success = false;
    $.ajax({
      cache: false,
      type: "POST",
      url: "login",
      data: JSON.stringify({
        username: username,
        password: password
      }),
      contentType: "application/json",
      processData: false,
      async: false,
      success: function(data) {
        success = true;
      },
      error: function(data) {
      }
    });
    return success;
  },

  logout: function () {
    var success = false;
    $.ajax({
      cache: false,
      type: "POST",
      url: "logout",
      contentType: "application/json",
      processData: false,
      async: false,
      success: function(data) {
        success = true;
      },
      error: function(data) {
      }
    });
    return success;
  }
});
