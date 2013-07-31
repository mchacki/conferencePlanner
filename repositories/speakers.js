/*jslint indent: 2, nomen: true, maxlen: 100, white: true, plusplus: true, unparam: true */
/*global require, exports*/

////////////////////////////////////////////////////////////////////////////////
/// @brief 
///
/// @file This Document represents the repository communicating with ArangoDB
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



(function () {
  "use strict";
  
  var _ = require("underscore"),
    Foxx = require("org/arangodb/foxx"),
    db = require("internal").db,
    Speakers_Repository = Foxx.Repository.extend({
      // Define the functionality to display all elements in the collection
      list: function () {
        return this.collection.toArray();
      },
      
      head: function() {
        return _.map(
          this.collection.toArray(),
          function(s) {
            require("console").log(JSON.stringify(s));
            return {
              id: s._key,
              text: s.Name
            }
          }
        );
      },
      
      show: function(id) {
        return this.collection.document(id);
      },
      
      save: function(content) {
        return this.collection.save(JSON.parse(content));
      },
      
      update: function(id, content) {
        var col = this.collection;
        var res = {};
        db._executeTransaction({
          collections: {
            write: col.name()
          },
          action: function() {
            if (col.exists(id)) {
              res = col.replace(id, JSON.parse(content));
            }
          }
        });
        return res;
      },
      
      del: function(id) {
        return this.collection.remove(id);
      }
    });
  exports.Repository = Speakers_Repository;
  
}());
