var redirects = [];
/*
 chrome.webRequest.onBeforeRequest.addListener(function(details) {
 return redirectToMatchingRule(details);
 }, {
 urls : ["<all_urls>"]
 }, ["blocking"]);
 */
function redirectToMatchingRule(details) {
    for (var i = 0; i < redirects.length; i++) {
        var redirect = redirects[i];
        if (redirect.isActive && redirect.startWith && details.url.startsWith(redirect.from) > -1 && details.requestId !== lastRequestId ) {
            lastRequestId = details.requestId;
            return{
                redirectUrl : details.url.replace(redirect.from, redirect.to)
            };
        }
        else if (redirect.isActive && details.url.indexOf(redirect.from) > -1 && details.requestId !== lastRequestId ) {
            lastRequestId = details.requestId;
            return{
                redirectUrl : details.url.replace(redirect.from, redirect.to)
            };
        }
    }
}