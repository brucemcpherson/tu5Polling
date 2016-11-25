/**
 *@namespace Realtime
 */
var Tu5Realtime = (function (ns) {

  var token_, nextPageToken_;
  var INTERVAL = 1997;
  
  ns.initialize = function () {

    // make sure were scoped for Drive
    // DriveApp.getFileById(id)
    var tp = Provoke.run('Tu5Realtime', 'getToken')
    .then (function (token) {
      token_ = token;
      return ns.getStartPageToken ();
    })
    .then (function (result) {
      nextPageToken_ = result.startPageToken;
    });
    
    return tp;
    
  };
  
  ns.start = function () {
    Provoke.loiter (INTERVAL)
    .then (function () {
      return ns.listChanges();
    })
    .then (function (result) {
      Render.changes (result.changes);
    })
    .then (function ()  {
      ns.start();
    });
  }
  
  ns.getStartPageToken = function () {
    return Cors.exec( "https://www.googleapis.com/drive/v3/changes/startPageToken",
      "GET", null, {
        Authorization:"Bearer " + token_
      })
     .then (function (response) {
       return Promise.resolve (JSON.parse(response.responseText));
     });
    
  };
  
  ns.listChanges = function () {
    
     return Cors.exec( "https://www.googleapis.com/drive/v3/changes?pageToken=" + nextPageToken_,
      "GET", null, {
        Authorization:"Bearer " + token_
      })
     .then (function (response) {
       var result = JSON.parse(response.responseText);
       nextPageToken_ = result.newStartPageToken
       return Promise.resolve (result);
     });
  };
  
  
  ns.load = function () {
    return Cors.exec( "https://realtime.googleapis.com/v1/files/1AfI3yZQI0LlvhIUevIX1jLX8QEPpxI-g_p7p7p3bQ7M",
      "GET", null, {
        Authorization:"Bearer " + token_
      }
    );
    
  };
  /**
   * returns token
   * runs server side
   * @return {string} token
   */
  ns.getToken = function () {
    return ScriptApp.getOAuthToken();
  };

  return ns;
})(Tu5Realtime || {});
