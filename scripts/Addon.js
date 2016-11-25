/**
 * how to poll server side from client side
 * this is a very simplified version of 
 * http://ramblings.mcpher.com/Home/excelquirks/gassnips/gaswatch
 */

'use strict';
/**
 * Adds a custom menu with items to show the sidebar and dialog.
 *
 * @param {Object} e The event parameter for a simple onOpen trigger.
 */
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createAddonMenu()
      .addItem('Create tu5Polling', 'showTu5Polling')
      .addToUi();
}

/**
 * Runs when the add-on is installed; calls onOpen() to ensure menu creation and
 * any other initializion work is done immediately.
 *
 * @param {Object} e The event parameter for a simple onInstall trigger.
 */
function onInstall(e) {
  onOpen(e);
}


/**
 * Opens a sidebar. 
 */
function showTu5Polling() {

  var ui = HtmlService.createTemplateFromFile('index.html')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('tu5 polling')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');

  SpreadsheetApp.getUi().showSidebar(ui);
}


/**
 * webapp using realtime api
 */
function doGet (e) {
  

  return HtmlService.createTemplateFromFile('rtindex.html')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('tu5 with drive real time service')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
