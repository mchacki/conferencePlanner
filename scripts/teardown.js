(function() {
  "use strict";

  require("console").log("%s", "tearing down app " + applicationContext.name);

  var f = require("org/arangodb/foxx-authentication");
 
  var users = new f.FoxxUsers(applicationContext);
  users.teardown();
  
  var sessions = new f.FoxxSessions(applicationContext);
  sessions.teardown();

}());
