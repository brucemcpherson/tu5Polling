/**
* @namespace Process
*/
var Process = (function (ns) {
  
  "use strict";
  
  ns.control = {};
  
  /**
   * called at beginning to do anything that's needed to get started
   * @return {Promise}
   */
  ns.initialize = function () {
    
    var du = DomUtils;
    
    // set up the client watching stuff
    ns.control.watcher = new ClientWatcher()
    .on("sheet",function (data) {
      
      // the navigation - update the page title
      du.elem ("charttitle").innerHTML = data.sheet.sheetName;
      
      // show the navigation data
      showNavigation_ (data);
      
    })
    .on("values",function (data) {
      // redraw the chart
      Render.draw (data.values.Values);
    
    })
    .on("active", function (data) {
      showNavigation_ (data);
    })
    
    function showNavigation_ (data) {
      
      var title = [["property","value"]];
      ['active','sheet']
      .forEach (function (k) {
        Array.prototype.push.apply ( title,
        Object.keys(data[k]).map(function(d) {
          return [d,data[k][d]]; 
        }));
      });
      Render.drawTable (title);

    }
    return Promise.resolve (null);
  }
  return ns;
}) (Process || {});