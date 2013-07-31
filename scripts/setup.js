/*jslint indent: 2, nomen: true, maxlen: 100, white: true, plusplus: true, unparam: true */
/*global todos*/
/*global require, applicationContext*/

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

  var console = require("console");
  var arangodb = require("org/arangodb");
  var db = arangodb.db;

  var createCollection = function(name) {
    var handle = applicationContext.collectionName(name);
    if (db._collection(handle) === null) {
      db._create(handle);
    } else {
      console.warn("collection '%s' already exists. Leaving it untouched.", handle);
    }
  };

  var createEdgeCollection = function(name) {
    var handle = applicationContext.collectionName(name);
    if (db._collection(handle) === null) {
      db._createEdgeCollection(handle);
    } else {
      console.warn("collection '%s' already exists. Leaving it untouched.", handle);
    }
  };

  var f = require("org/arangodb/foxx-authentication");

  // set up users
  var users = new f.FoxxUsers(applicationContext);
  users.setup({ journalSize: 1 * 1024 * 1024 });

  // set up a default admin user
  users.add("admin", "secret", true);

  // set up sessions
  var s = new f.FoxxSessions(applicationContext);
  s.setup();

  createCollection("speakers");
  createCollection("talks");
  createCollection("tracks");
  createCollection("conferences");
  createEdgeCollection("gives");
  createEdgeCollection("inConf");

}());
