
'use strict'

// setup method.
document.addEventListener( 'DOMContentLoaded', function (){
  Setup();
}, false);

function Setup() {
  document.getElementById("SearchButton").onclick = SendSearch;
}

// send search method.
function SendSearch() {
  var queryInfo = {
    active: true ,windowId: chrome.windows.WINDOW_ID_CURRENT
  };
  chrome.tabs.query(queryInfo, function(result) {
    var text = document.getElementById("SearchText").value;
    var currentTab = result.shift();
    var msgContent = {searchText:text};
    chrome.tabs.sendMessage(currentTab.id, msgContent, function() {});
    console.log("pu.js sendMessage searchText: " + text);
  });
}
