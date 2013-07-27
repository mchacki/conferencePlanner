var app = app || {};

app.LiveEditTable = function (titles, changeCallback, addNewRowCallback) {

  var
    table = document.createElement("table"),
    count = titles.length,
    rows = [],
    titleRow = document.createElement("tr"),
  
  /********************
  * Private Functions *
  ********************/
  
    isEmptyRow = function(r) {
      return !_.any(r.children, function(td) {
        return td.firstChild.value !== "";
      });
    },
  
    checkEmptyRows = function() {
      var i = 0, r;
      for (i = 0; i < rows.length - 1; i++) {
        r = rows[i];
        if (isEmptyRow(r)) {
          table.removeChild(r);
          rows.splice(i, 1);
          i--;
        }
      }
      if (!isEmptyRow(rows[rows.length - 1])) {
        addNewRowCallback();
      }
    },
  
    rowToJSON = function(tr) {
      var res = {}, i = 0;
      if (tr.id) {
        res._key = tr.id;
      }
      for (i = 0; i < count; i++) {
        res[titles[i]] = tr.children[i].firstChild.value;
      }
      return res;
    },
  
    insertCell = function(tr) {
      var td, input;
      td = document.createElement("td");
      input = document.createElement("input");
      input.type = "text";
      tr.appendChild(td);
      td.appendChild(input);
      input.onchange = function() {
        changeCallback(rowToJSON(tr), tr);
        checkEmptyRows();
      }
    },

    insertEmptyRow = function (id) {
      var i = 0,
        tr = document.createElement("tr");
      if (id) {
        tr.id = id;
      }
      for (i = 0; i < count; i++) {
        insertCell(tr);
      }
      table.appendChild(tr);
      rows.push(tr);
      return tr;
    },
  
    clean = function() {
      _.each(rows, function(r) {
        table.removeChild(r);
      });
      rows = [];
      insertEmptyRow();
    },
  
    insertEntry = function(o) {
      var tr = rows[rows.length - 1],
        i = 0;
      tr.id = o._key;
      for (i = 0; i < count; i++) {
        tr.children[i].firstChild.value = o[titles[i]] || "";
      }
      addNewRowCallback();
    },
    
    getTableHTML = function() {
      return table;
    },
    
    insertBulk = function(objects) {
      _.each(objects, function(o) {
        insertEntry(o);
      });
    };
  insertEmptyRow();
  
  _.each(titles, function(t) {
    var th = document.createElement("th");
    th.appendChild(document.createTextNode(t));
    titleRow.appendChild(th);
  });
  table.appendChild(titleRow);
  
  
  this.insertEmptyRow = insertEmptyRow;
  this.insertEntry = insertEntry;
  this.insertBulk = insertBulk;
  this.clean = clean;
  this.getTableHTML = getTableHTML;
}