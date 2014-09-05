var Notificator = function(defaultNotification) {
    this.showNotification = function(notificationDetails,callback) {
        sendMessage({type:"notification", method:"showNotification",param:[notificationDetails] },function(promise){
            setTimeout(function(){
                sendMessage({type:"notification", method:"getPromise",param:[promise]},callback);
            },500)
        });
    };
    this.showDefaultNotification = function(message,callback){
        sendMessage({type:"notification", method:"showDefaultNotification",param:[message] },function(promise){
            setTimeout(function(){
                sendMessage({type:"notification", method:"getPromise",param:[promise]},callback);
            },500)
        });
    };
    return this;
}

var currentNotificator = new Notificator();