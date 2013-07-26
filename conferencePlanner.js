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
    
    var inTrack = app.createRepository("inTrack", {
      repository: "repositories/inTrack"
    });
    
    
    app.get("speaker", function(req, res) {
      res.json(speakers.list());
    });
  
    app.get("speaker/:id", function(req, res) {
      var id = req.params("id");
      speakers.show(id);
    });
  
    app.post("speaker", function(req,res) {
      res.json(speakers.save(req.requestBody));
    });
    
    app.put("speaker/:id", function(req, res) {
      var id = req.params("id");
      speakers.update(id, req.requestBody);
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
      talks.save(req.requestBody);
      res.json("OK");
    });

    app.del("talk/:id", function(req, res) {
      var id = req.params("id");
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
      res.json(gives.listTalksOf(sId));
    });
  
    app.del("gives/:edgeId", function(req, res) {
      var id = req.params("edgeId");
      res.json(gives.del(id));
    });
  
    app.get("inTrack/:trackId", function(req, res) {
      var tId = req.params("trackId");
      res.json(inTrack.listTalksIn(tId));
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
  
}());
