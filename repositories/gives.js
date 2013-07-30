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
    Gives_Repository = Foxx.Repository.extend({
      
      // Define the functionality to display all elements in the collection
      listTalksOf: function (id) {
        var speakerId = this.prefix + "_speakers/" + id;
        return this.collection.outEdges(speakerId);
      },
      
      save: function(sId, tId) {
        var speakerId = this.prefix + "_speakers/" + sId;
        var talkId = this.prefix + "_talks/" + tId;
        return this.collection.save(speakerId, talkId, {});
      },
      
      del: function(id) {
        return this.collection.remove(id);
      },
      
      update: function(sId, tId) {
        var speakerId = this.prefix + "_speakers/" + sId;
        var talkId = this.prefix + "_talks/" + tId;
        var ins = this.collection.inEdges(talkId)[0];
        require("console").log(speakerId);
        if (sId === "null") {
          if (ins) {
            this.collection.remove(ins._id);
          }
          return;
        }
        if (!ins) {
          this.collection.save(speakerId, talkId, {});
          return;
        }
        if (ins._from !== speakerId) {
          this.collection.remove(ins._id);
          this.collection.save(speakerId, talkId, {});
          return;
        }
      }
    });
  exports.Repository = Gives_Repository;
  
}());
