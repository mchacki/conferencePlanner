var app = app || {};

app.LiveEditTable = function (titles, options) {

  var
    table = document.createElement("table"),
    count = titles.length,
    rows = [],
    titleMap = {},
    isReadOnly = {},
    isBoolean = {},
    selection = {},
    changeCallback = function() {},
    deleteCallback = function() {},
    titleRow = document.createElement("tr"),
  /********************
  * Private Functions *
  ********************/
  
  
    parseOptions = function(opts) {
      _.each(opts, function(o, key) {
        if (key === "onChange") {
          changeCallback = o;
          return;
        }
        if (key === "onDelete") {
          deleteCallback = o;
          return;
        }
        if (o.type) {
          if (o.type === "selection") {
            selection[titleMap[key]] = o.list;
          }
          return;
        }
        switch (o) {
          case "readonly":
            isReadOnly[titleMap[key]] = true;
            break;
          case "boolean":
            isBoolean[titleMap[key]] = true;
            break;
          
        }
      });
    },
  
    isEmptyCell = function(cell, index) {
      if (isReadOnly[index]) {
        return cell.firstChild.innerHTML === "";
      }
      if (isBoolean[index]) {
        return !cell.firstChild.checked;
      }
      return cell.firstChild.value === "";
    },
  
    isEmptyRow = function(r) {
      return !_.any(r.children, function(td, i) {
        return !isEmptyCell(td, i);
      });
    },
  
    getCellValue = function(cell, index) {
      if (isReadOnly[index]) {
        return cell.firstChild.innerHTML;
      }
      if (isBoolean[index]) {
        return cell.firstChild.checked;
      }
      if (selection[index]) {
        return cell.firstChild.options[cell.firstChild.selectedIndex].value;
      }
      return cell.firstChild.value;
    },
  
    checkEmptyRows = function() {
      var i = 0, r;
      for (i = 0; i < rows.length - 1; i++) {
        r = rows[i];
        if (isEmptyRow(r)) {
          deleteCallback(r.id);
          table.removeChild(r);
          rows.splice(i, 1);
          i--;
        }
      }
      if (!isEmptyRow(rows[rows.length - 1])) {
        insertEmptyRow();
      }
    },
  
    rowToJSON = function(tr) {
      var res = {}, i = 0;
      if (tr.id) {
        res._key = tr.id;
      }
      for (i = 0; i < count; i++) {
        res[titles[i]] = getCellValue(tr.children[i], i);
      }
      return res;
    },
  
    insertReadOnlyCell = function(tr) {
      var td, span;
      td = document.createElement("td");
      span = document.createElement("span");
      tr.appendChild(td);
      td.appendChild(span);
    },
  
    insertSelectionCell = function(tr, list) {
      var td, input, empty;
      td = document.createElement("td");
      input = document.createElement("select");
      tr.appendChild(td);
      td.appendChild(input);
      empty = document.createElement("option");
      empty.value = null;
      input.appendChild(empty);
      _.each(list, function(l) {
        var op = document.createElement("option");
        op.value = l.id;
        op.appendChild(document.createTextNode(l.text));
        input.appendChild(op);
      });
      input.onchange = function() {
        changeCallback(rowToJSON(tr), tr);
        checkEmptyRows();
      }
    },
  
    insertCheckBoxCell = function(tr) {
      var td, input;
      td = document.createElement("td");
      input = document.createElement("input");
      input.type = "checkbox";
      tr.appendChild(td);
      td.appendChild(input);
      input.onchange = function() {
        changeCallback(rowToJSON(tr), tr);
        checkEmptyRows();
      }
    },
  
    insertTextCell = function(tr) {
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
  
    insertCell = function(tr, index) {
      if (isReadOnly[index]) {
        insertReadOnlyCell(tr);
        return;
      }
      if (isBoolean[index]) {
        insertCheckBoxCell(tr);
        return;
      }
      if (selection[index]) {
        insertSelectionCell(tr, selection[index]);
        return;
      }
      insertTextCell(tr);
    },
    
    insertValueInCell = function(cell, val, index) {
      if (isReadOnly[index]) {
        cell.firstChild.innerHTML = val || "";
        return;
      }
      if (isBoolean[index]) {
        cell.firstChild.checked = val || false;
        return;
      }
      if (selection[index]) {
        cell.firstChild.selectedIndex = 0;
        _.each(cell.firstChild.childNodes, function(opt, index) {
          if (opt.value === val) {
            cell.firstChild.selectedIndex = index;
          }
        });
        return;
      }
      cell.firstChild.value = val || "";
    },
    
    insertEmptyRow = function (id) {
      var i = 0,
        tr = document.createElement("tr");
      if (id) {
        tr.id = id;
      }
      for (i = 0; i < count; i++) {
        insertCell(tr, i);
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
        insertValueInCell(tr.children[i], o[titles[i]], i);
      }
      insertEmptyRow();
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
  _.each(titles, function(t, i) {
    var th = document.createElement("th");
    th.appendChild(document.createTextNode(t));
    titleRow.appendChild(th);
    titleMap[t] = i;
  });
  table.appendChild(titleRow);
  parseOptions(options);
  
  
  this.insertEmptyRow = insertEmptyRow;
  this.insertEntry = insertEntry;
  this.insertBulk = insertBulk;
  this.clean = clean;
  this.getTableHTML = getTableHTML;
}