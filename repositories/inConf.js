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
    InConf_Repository = Foxx.Repository.extend({
      
      save: function(tKey, cKey, content) {
        var confId = this.prefix + "_conferences/" + cKey;
        var talkId = this.prefix + "_talks/" + tKey;
        var old = _.findWhere(
          this.collection.outEdges(talkId),
          {_to: confId}
        );
        if (old) {
          return this.collection.replace(old._key, content);
        } else {
          return this.collection.save(talkId, confId, content);
        }        
      },
      
      removeTalk: function(tKey) {
        var talkId = this.prefix + "_talks/" + tKey;
        var toRm = this.collection.outEdges(talkId);
        var self = this;
        _.each(toRm, function(e) {
          self.collection.remove(e._id);
        });
      },
      
      talksInConf: function(cKey) {
        var confId = this.prefix + "_conferences/" + cKey;
        return this.collection.inEdges(confId);
      },
      
      del: function(id) {
        return this.collection.remove(id);
      }
    });
  exports.Repository = InConf_Repository;
  
}());
