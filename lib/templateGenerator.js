/*jslint indent: 2, nomen: true, maxlen: 100, white: true, plusplus: true, unparam: true */
/*global require, exports*/

var fs = require("fs");
var _ = require("underscore");
var console = require("console");
var internal = require("internal");

var tracks = 3;
var steps = 10;
var duration = 15;

var talks = [
  {name:"Heiko Kernbach", content:"HTML", track:1},
  {name:"Jan S.", content:"JSON", track:1},
  {name:"Michael H.", content:"JQUERY", track:1}
];

exports.TemplateGenerator = function(basepath) {
  "use strict";
  var self = this;
  var templatePath = fs.join(basepath, "templates");
  var tableTmpl = _.template(fs.read(fs.join(templatePath, "table.tmpl")));

  var duration;
  var startDate;

  var createTable = function (home) {

    return tableTmpl({
      name:home,
      tracks: tracks,
      talks: talks
    });

  };

  this.createTable = createTable;
};
