/**
* used to expose memebers of a namespace
* @param {string} namespace name
* @param {method} method name
*/
function exposeRun (namespace, method , argArray ) {
  
  // I'm using whitelisting to ensure that only namespaces 
  // authorized to be run from the client are enabled
  // why? to avoid mistakes, or potential poking somehow from the dev tools
  var whitelist;
  
  // check allowed
  if (whitelist && !whitelist.some(function(d) {
    return namespace === d.namespace && 
      (!d.methods || d.methods.some(function(e) { return e===method}));
  })) {
    throw (namespace || "this") + "." + method + " is not whitelisted to be run from the client";
  }
  
  var func = (namespace ? this[namespace][method] : this[method]);
  if (typeof func !== 'function' ) {
    throw (namespace || "this") + "." + method + " should be a function";
  }
  if (argArray && argArray.length) {
    return func.apply(this,argArray);
  }
  else {
    return func();
  }
}
/**
 * simulate binding with apps script
 * various changes server side can be watched for server side
 * and resolved client side
 * @constructor SeverBinder
 */
var ServerWatcher = (function (ns) {

  /**
   * called server side to get data from active sheet
   * @param {object} what to get
   * @return {object} the result
   */
  ns.poll = function (what) {
    
    Utils.assert (what, "what to poll is unspecified");
    Utils.assert (["selected" , "active", "data"].indexOf (what.scope.name) !== -1 , "scope name " + what.scope.name + " unknown");
    
    // open the current sheet etc.
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    var activeRange = sheet.getActiveRange();
    var dataRange = sheet.getDataRange();
    
    var selectedRange = what.scope.name === "selected" ? 
      sheet.getRange (what.scope.range) : ( what.scope.name === "data" ? dataRange : activeRange);
   
    // start working on the returns package
    return (what.domains || []).reduce (function (p,c) {
      
      var ob = null;
      
      // we're checking for navigational or scope changes
      if (c === "sheet") {
        ob = {
          sheetId:sheet.getSheetId(),
          sheetName:sheet.getName(),
          ss:ss.getId(),
          dataRange:dataRange.getA1Notation(),
          selectedRange:selectedRange.getA1Notation()
        };

      }
      
      // we're checking for active changes
      else if (c === "active") {
        ob = {
          activeRange:activeRange.getA1Notation()
        }
      }
      
      // we're checking for data changes
      else if (c === "values") {
        ob = what.properties.reduce (function (dp , dc) {
          // get the value property from the sheet
          dp[dc] = selectedRange['get'+dc]();
          return dp;
        } , {});
        
      }
      
      else {
        Utils.assert (false, "Dont know what to do with " + c);
      }
      
      // get a checksum for the new value
      var cs = Utils.keyDigest (ob);
      p.checksums[c] = cs;
        
      // if its different, we'll need to send it back
      if (cs !== what.checksums[c]) {
        p.data[c] = ob;
      }
      
    
      return p;
    },{data:{} , checksums:{}});
    
    
  };
  
  return ns;
})(ServerWatcher || {});
