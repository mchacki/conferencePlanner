/*jslint indent: 2, nomen: true, maxlen: 100, white: true, plusplus: true, unparam: true */
/*global require, exports*/

var fs = require("fs");
var _ = require("underscore");
var console = require("console");
var internal = require("internal");

var talks

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
      tracks: 3
    });

  };

  this.createTable = createTable;
};
