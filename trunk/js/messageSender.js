function sendMessage(request, callback) {
    chrome.runtime.sendMessage(chrome.app.getDetails().id,request, callback);
}
