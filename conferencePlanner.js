/*jslint indent: 2, nomen: true, maxlen: 100, white: true, plusplus: true, unparam: true */
/*global todos*/
/*global require, applicationContext, repositories*/

////////////////////////////////////////////////////////////////////////////////
/// @brief 
///
/// @file
///
/// DISCLAIMER
///
/// Copyright 2010-2012 triagens GmbH, Cologne, Germany
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// Copyright holder is triAGENS GmbH, Cologne, Germany
///
/// @author Michael Hackstein
/// @author Copyright 2011-2013, triAGENS GmbH, Cologne, Germany
////////////////////////////////////////////////////////////////////////////////


(function() {
  "use strict";

  // Initialise a new FoxxApplication called app under the urlPrefix: "ayeaye".
  var FoxxApplication = require("org/arangodb/foxx").Application,
  app = new FoxxApplication(applicationContext);
  var internal = require("internal");
  var foxxAuthentication = require("org/arangodb/foxx-authentication");

  function setupAuthentication () {
    var lifetime = 600;

    var sessions = new foxxAuthentication.FoxxSessions(applicationContext, { 
      lifetime: lifetime
    });

    var cookieAuth = new foxxAuthentication.FoxxCookieAuthentication(applicationContext, {
      lifetime: lifetime,
      name: "mycookie"
    }); 

    var auth = new foxxAuthentication.FoxxAuthentication(applicationContext, sessions, cookieAuth);

    return auth;
  }

  var auth = setupAuthentication();

  var _ = require("underscore");

  var conferences = app.createRepository("conferences", {
    repository: "repositories/conferences"
  });

  var speakers = app.createRepository("speakers", {
    repository: "repositories/speakers"
  });

  var talks = app.createRepository("talks", {
    repository: "repositories/talks"
  });

  var tracks = app.createRepository("tracks", {
    repository: "repositories/tracks"
  });

  var gives = app.createRepository("gives", {
    repository: "repositories/gives"
  });

  var inConf = app.createRepository("inConf", {
    repository: "repositories/inConf"
  });

  app.before("/*", function (req, res) {
    app.currentSession = null;

    // make an exception for the /login handler
    if (Array.isArray(req.suffix) && req.suffix.length > 0 ) {
      if (req.suffix[0].match(/^(login|index\.html|style\.css|apps\.js|lib\.js|templates)$/)) {
        return true;
      }
    }

    // run the authentication
    var authResult = auth.authenticate(req);

    if (authResult.errorNum !== internal.errors.ERROR_NO_ERROR) {
      // not authenticated
      res.json({
        "msg": "not authenticated!",
        "result": authResult
      });

      res.status(401);
      return false;
    }

    // authenticated, now we have a session
    app.currentSession = authResult.session;
    return true;
  }, {honorResult: true});

  app.after("/*", function (req, res) {
    var session = app.currentSession;

    if (session === null) {
      // we don't have any session
      return;
    }

    session.update();
  });

  app.post("/logout", function (req, res) {
    if (app.currentSession !== null) {
      auth.endSession(req, res, app.currentSession._key);
      app.currentSession = null;
    }

    res.json({
      "msg": "logged out"
    });
  });

  // some example method that can only be accessed when authenticated
  app.get('/counter', function (req, res) {
    app.currentSession.set("counter", 1 + (app.currentSession.get("counter") || 0));

    res.json({
      "counter": app.currentSession.get("counter") 
    });
  });

	app.post("/login", function (req, res) {

    var parsedResponse = JSON.parse(req.requestBody);
		var username = parsedResponse.username;
		var password = parsedResponse.password;

		try {
			var users = new foxxAuthentication.FoxxUsers(applicationContext);

			// only valid & active users can login
			if (users.isValid(username, password)) {
				app.currentSession = auth.beginSession(req, res, username, {
					foo: "bar",
					baz: "bam"
				});

				res.json({
					"msg": "logged in",
					"session": app.currentSession
				});
				return;
			}
		}
		catch (err) {
		}

		// user is invalid. show error
		res.json({
			"msg": "invalid user"
		});
		res.status(401);
	});

	app.get("conference", function(req, res) {
		res.json(conferences.list());
	});

	app.get("conference/:id", function(req, res) {
		var id = req.params("id");
		res.json(conferences.show(id));
	});

	app.post("conference", function(req,res) {
		res.json(conferences.save(JSON.parse(req.requestBody)));
	});

	app.put("conference/:id", function(req, res) {
		var id = req.params("id");
		res.json(conferences.update(id, JSON.parse(req.requestBody)));
	});

	app.del("conference/:id", function(req, res) {
		var id = req.params("id");
		res.json(conferences.del(id));
	});  

	app.get("speaker", function(req, res) {
		res.json(speakers.list());
	});

	app.get("speaker/:id", function(req, res) {
		var id = req.params("id");
		res.json(speakers.show(id));
	});

	app.get("list/speakers", function(req, res) {
		res.json(speakers.head());
	});

	app.post("speaker", function(req,res) {
		res.json(speakers.save(JSON.parse(req.requestBody)));
	});

	app.put("speaker/:id", function(req, res) {
		var id = req.params("id");
		res.json(speakers.update(id, JSON.parse(req.requestBody)));
	});

	app.del("speaker/:id", function(req, res) {
		var id = req.params("id");
		res.json(speakers.del(id));
	});

	app.get("talk", function(req, res) {
		res.json(talks.list());
	});

	app.get("talk/:id", function(req, res) {
		var id = req.params("id");
		talks.show(id);
	});

	app.post("talk", function(req,res) {
		var content = JSON.parse(req.requestBody),
		ret = talks.save(content);
		if (content.Speaker_key) {
			gives.save(content.Speaker_key, ret._key);
		}
		res.json(ret);
	});

	app.put("talk/:id", function(req, res) {
		var id = req.params("id"),
		content = JSON.parse(req.requestBody),
		ret = talks.update(id, content);
		gives.update(content.Speaker_key, ret._key);
		res.json(ret);
	});

	app.del("talk/:id", function(req, res) {
		var id = req.params("id");
		inConf.removeTalk(id)
		res.json(talks.del(id));
	});

	app.get("track", function(req, res) {
		res.json(tracks.list());
	});

	app.get("track/:id", function(req, res) {
		var id = req.params("id");
		tracks.show(id);
	});

	app.post("track", function(req,res) {
		tracks.save(req.requestBody);
		res.json("OK");
	});

	app.del("track/:id", function(req, res) {
		var id = req.params("id");
		res.json(tracks.del(id));
	});

	app.post("gives/:speakerId/:talkId", function(req, res) {
		var sId = req.params("speakerId");
		var tId = req.params("talkId");
		res.json(gives.save(sId, tId));
	});

	app.get("gives/:speakerId", function(req, res) {
		var sId = req.params("speakerId");
		var edges = gives.listTalksOf(sId);
		res.json(_.map(edges, function(e) {
			return talks.show(e._to);
		}));
	});

	app.del("gives/:edgeId", function(req, res) {
		var id = req.params("edgeId");
		res.json(gives.del(id));
	});

	app.get("inTrack/:trackId", function(req, res) {
		var tId = req.params("trackId");
		res.json(inTrack.listTalksIn(tId));
	});

	app.get("html/:confId/:day", function(req, res) {
		var confId = req.params("confId");
		var day = req.params("day");
		var TG = require("lib/templateGenerator").TemplateGenerator;
		var tg = new TG(applicationContext.basePath);

		var test = tg.createTable("Home");

		res.body = test;
	});

	app.post("inTrack/:trackId/:talkId", function(req, res) {
		var talkId = req.params("talkId");
		var trackId = req.params("trackId");
		res.json(inTrack.save(talkId, trackId));
	});

	app.del("inTrack/:edgeId", function(req, res) {
		var id = req.params("edgeId");
		res.json(inTrack.del(id));
	});

	app.get("talksInConf/:confId", function(req, res) {
		var id = req.params("confId");
		res.json(inConf.talksInConf(id));
	});

	app.post("inConf/:talkId/:confId", function(req, res) {
		var talkId = req.params("talkId"),
		confId = req.params("confId"),
		content = JSON.parse(req.requestBody);
		res.json(inConf.save(talkId, confId, content));
	});
}());
