var app = app || {};

app.LiveEditTable = function (titles) {

  var
    table = document.createElement("table"),
    rows = {},
    count = titles.length,
    titleRow = document.createElement("tr"),
  
  /********************
  * Private Functions *
  ********************/
  
    insertEmptyRow = function () {
    
    },
  
    insertEntry = function(o) {
      // TODO
    },
    
    getTableHTML = function() {
      return table;
    },
    
    insertBulk = function(objects) {
      _.each(objects, function(o) {
        insertEntry(o);
      });
    };
  
  
  _.each(titles, function(t) {
    var th = document.createElement("th");
    th.appendChild(document.createTextNode(t));
    titleRow.appendChild(th);
  });
  
  this.insertEmptyRow = insertEmptyRow;
  this.insertEntry = insertEntry;
  this.insertBulk = insertBulk;
  
  this.getTableHTML = getTableHTML;
}