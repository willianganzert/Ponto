var Notificator = function(defaultNotificationDetails) {
    this.defaultNotification = {type: 'default', image:'img/icon_48.png',title:'Nota', message:"Default Message"};
    if(defaultNotificationDetails)
        $.extend(this.defaultNotification,defaultNotificationDetails);
    this.showNotification = function(notificationDetailsUser,callback) {
        var notificationDetails = this.defaultNotification;
        $.extend(notificationDetails,notificationDetailsUser);
        var notification = null;
        if(notificationDetails.type == "default"){
            notification = new Notification(
                notificationDetails.title,{
                    icon: notificationDetails.image,
                    body: notificationDetails.message
                }
            );
        }else if(notificationDetails.type == "html"){
            //
            throw "Tipo de notificação não implementado. ["+notification.type+"]";
        }
        else {
            throw "Tipo de notificação desconhecido. ["+notification.type+"]";
        }
        if(typeof callback == "function")
            callback();
        return notification;
    };
    this.showDefaultNotification = function(message,callback){
        this.showNotification({type: this.defaultNotification.type, image:this.defaultNotification.image,title:this.defaultNotification.title, message:message},callback);
    };
    return this;
}

var currentNotificator = new Notificator();