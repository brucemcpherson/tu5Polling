/**
 * @namespace Render
 * used to draw google viz charts
 */
var Render = (function(ns) {

  var clearDate_, fiddler_;
  
  ns.initialize = function () {
    DomUtils.elem ("clear-button").addEventListener ("click", ns.clear);
    ns.clear();
  };
  
  
  ns.clear = function () {
    clearDate_ = new Date();
    DomUtils.elem ("changed-since").innerHTML = clearDate_.toString().split(" ")[4];
    fiddler_ = new Fiddler()
    .setValues([["id","name","mimeType","removed","time","count"]]);
    ns.changes([]);

  };
  
  ns.draw = function (values) {
    try {
      var chart = new google.visualization.GeoChart(document.getElementById('dicearea'));
      chart.draw(ns.getTable (values), {});
    }
    catch (err) {
      App.toast('warning', 'data was not good for chart');
    }
    return ns;
  };
  
  ns.drawTable = function (values) {
    try {
      var chart = new google.visualization.Table(document.getElementById('sheetarea'));
      chart.draw(ns.getTable (values), {});
    }
    catch (err) {
      App.toast('warning', 'data was not good for table');    
    }
    return ns;
  };

  ns.getTable = function (values) {
    return google.visualization.arrayToDataTable(values);
  };
  
  ns.changes = function (changes) {
    
    var now = new Date();
    
    // organize the data
    var fiddler = new Fiddler ()
    .setValues([fiddler_.getHeaders()]);

    if (changes.length) {
      fiddler.setData (changes.map(function(d) {
        return {
          id:d.fileId,
          name:d.file.name,
          mimeType:d.file.mimeType,
          removed:d.removed,
          time:new Date(d.time),
          count:1
        };
      }));
    }

    // find the ones already in the old one 
    fiddler_.mapRows(function (row) {
      
      // if they exist in the new one, then update them
      fiddler.selectRows("id", function (v) {
        return v === row.id;
      })
      .forEach (function (d) {
        row.count ++;
      })
      return row;
      
    })
    
    // add new ones
    fiddler.selectRows("id" , function (v) {
      return !fiddler_.selectRows ("id", function (d) {
        return v === d;
      }).length;
    })
    .forEach (function (d) {
      fiddler_.insertRows (undefined , 1 , fiddler.getData()[d]);
    });

    var chart = new google.visualization.Table(document.getElementById('sheetarea'));
    chart.draw(ns.getTable (fiddler_.createValues()), {width: '100%'});
    
    
  };
  return ns;
})(Render || {});
