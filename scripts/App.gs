/**
 * @namespace App
 * set up notification areas
 */

var App = (function startApp (app) {
  'use strict';

  app.control = {
    toast:{
      interval:2000
    }
  };
  
  // sets up all the app management divs.
  app.initialize = function () {

    
    app.showNotification = function (header, text, toast) {
      DomUtils.elem('notification-header').innerHTML=header;
      DomUtils.elem('notification-message').innerHTML = text ;
      if (toast) {
        DomUtils.applyClass ("notification-area", false, "notification-error-header");
        DomUtils.applyClass ("notification-area", true, "notification-toast-header");
        DomUtils.applyClass('notification-header',false, "notification-error-header");  
        DomUtils.applyClass('notification-message',false, "notification-error-message");  
        DomUtils.applyClass('notification-header',true, "notification-toast-header");  
        DomUtils.applyClass('notification-message',true, "notification-toast-message"); 
      }
      else {
        DomUtils.applyClass ("notification-area", false, "notification-toast-header");
        DomUtils.applyClass ("notification-area", true, "notification-error-header");
        DomUtils.applyClass('notification-header',false, "notification-toast-header");  
        DomUtils.applyClass('notification-message',false, "notification-toast-message");  
        DomUtils.applyClass('notification-header',true, "notification-error-header");  
        DomUtils.applyClass('notification-message',true, "notification-error-message"); 
      }
      DomUtils.hide ("notification-area", false);
 

    };
    
    app.hideNotification = function () {
      DomUtils.hide('notification-area',true);
    };
    
    app.toast = function (header,text) {
      app.showNotification (header,text,true);
      Provoke.loiter (app.control.toast.interval)
      .then(function () {
         app.hideNotification()   ;
      });
    }
    
    DomUtils.elem('notification-close')
    .addEventListener("click", function () {
      DomUtils.hide('notification-area',true);
    },false);
    
    return Promise.resolve (null);
  };
  
  return app;
})(App || {});
