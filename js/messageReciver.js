chrome.runtime.onMessage.addListener(receivedMessage);
function receivedMessage(request, sender, sendResponse) {
    var retorno = null;
	if(request.type == "function"){
        var methodCall = alert;
        if(request.method == "getPromise"){
            var aaa = promise.getPromise(request.param[0]).data;
            sendResponse(aaa);
        }
        else {
            methodCall = eval(request.method);
            p = promise.addPromise(request.method);
            if(!request.param || request.param.length == 0){
                methodCall(function(data){
                    p.data = data;
                });
            }
            else if(request.param.length > 0){
                methodCall(request.param[0],function(data){
                    p.data = data;
                });
            }
            sendResponse(p);
        }
    }
    else if(request.type == "co"){
        var methodCall = alert;
        if(request.method == "getPromise"){
            var aaa = promise.getPromise(request.param[0]).data;
            sendResponse(aaa);
        }
        else {
            methodCall = marcacoes[request.method];
            p = promise.addPromise(request.method);
            if(!request.param || request.param.length == 0){
                methodCall(function(data){
                    p.data = data;
                });
            }
            else if(request.param.length > 0){
                methodCall(request.param[0],function(data){
                    p.data = data;
                });
            }
            sendResponse(p);
        }
    }
    else if(request.type == "db"){
        var methodCall = alert;
        if(request.method == "getPromise"){
            var bbb= promise.getPromise(request.param[0]).data;
            sendResponse(bbb);
        }
        else {
            methodCall = html5rocks.webdb[request.method];
            p = promise.addPromise(request.method);
            if(!request.param || request.param.length == 0){
                methodCall(function(data){
                    p.data = data;
                });
            }
            else if(request.param.length > 0){
                methodCall(request.param[0],function(data){
                    p.data = data;
                });
            }
            sendResponse(p);
        }
    }
    else if(request.type == "notification"){
        var methodCall = alert;
        if(request.method == "getPromise"){
            var bbb= promise.getPromise(request.param[0]).data;
            sendResponse(bbb);
        }
        else {
            methodCall = currentNotificator[request.method];
            p = promise.addPromise(request.method);
            if(!request.param || request.param.length == 0){
                methodCall.apply(currentNotificator, [function(data){
                    p.data = data;
                }]);
            }
            else if(request.param.length > 0){
                methodCall.apply(currentNotificator, [request.param[0],function(data){
                    p.data = data;
                }]);
            }
            sendResponse(p);
        }
    }
}