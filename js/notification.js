function showNotification(notification,callback) {
    var notification;
    if(notification.notificationType == undefined || notification.notificationType == "default"){
        notification = new Notification(
            notification.title,{
                icon: 'img/icon_48.png',
                body: notification.message
            }
        );
    }else if(notification.notificationType == "html"){
        //
    }
    callback("ss");
}
// Then show the notification.
function showMarcacoes(rowOutput){
    showNotification({type:"message",image:'img/icon_48.png',title:'Marcações', message:toStringMarcacoes(rowOutput)});
}
function toStringMarcacoes(rowOutput){
    var s = "";
    for(var i = 0; i<rowOutput.length;i++){
        s += "\n" + zeroEsquerda(rowOutput[i].hora,2) + ":" + zeroEsquerda(rowOutput[i].minuto,2);
    }
    return s;
}