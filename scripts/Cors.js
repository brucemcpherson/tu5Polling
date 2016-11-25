/**
 * @namespace Cors
 * make cors requests
 */
var Cors = (function (ns) {


   /**
    *do a cors request
    *@param {string}  url the url
    *@param {string} method the method (default GET)
    *@param {*} payload the optional payload
    *@return {object} the response
    */
   ns.exec = function (url, method, payload, headers) {
     return new Promise(function(resolve, reject) {
       return corsRequest(resolve, reject, url, method, payload,headers);
     });
   };
   /**
    *do a cors request
    *thanks to http://enable-cors.org/ for info on cors/html5
    *@param {function} callback the load callback
    *@param {function} errorCallback the error callback
    *@param {string}  url the url
    *@param {string} method the method (default GET)
    *@param {*} payload the optional payload
    *@return {object} the response
    */
   function corsRequest(callback, errorCallback, url, method, payload,headers) {

     // get the appropriate xhr
     var xhr = getXhr();
     if (!xhr) throw 'cant do cors with this browser';

     // now we can go
     xhr.open(method || "GET", url, true);
     
     // set up any headers
     Object.keys(headers || {}).forEach(function (d) {
       xhr.setRequestHeader (d , headers[d]);
     });
     
     // set up callbacks
     xhr.onload = function(evt) {
       // meed to catch this since it doesnt actually catch http errors
       if (evt.target.status < 200 || evt.target.status >= 300) {
         errorCallback(evt.target.responseText);
       } else {
         callback(evt.target);
       }

     }
     xhr.onerror = function(response) {
       errorCallback("request error- check that " + url + "exists and has CORS enabled");
     }

     // execute
     return xhr.send(payload);

     /**
      * get the correct xhr object for the browser being used
      * @return {XDomainRequest|XMLHttpReQuest} the xhr
      */
     function getXhr() {

       // likely to be this, unless its IE
       var xhr = new XMLHttpRequest();
       return isDefined(xhr.withCredentials) ?
         xhr : (isDefined(XDomainRequest) ? new XDomainRequest() : undefined);
     }

     function isDefined(ob) {
       return typeof ob !== typeof undefined;
     }

   }
  return ns;
}) (Cors || {});