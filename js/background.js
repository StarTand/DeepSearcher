
console.log("pass 100  ");

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.executeScript(null, {
    "code": "document.body.style.backgroundColor='red'"
  });
});
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  console.log("pass 100 : " + msg.download);
});
