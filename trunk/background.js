/*

var html5rocks = {};
html5rocks.webdb = {};
html5rocks.webdb.db = null;

html5rocks.webdb.open = function() {
  var dbSize = 5 * 1024 * 1024; // 5MB
  html5rocks.webdb.db = openDatabase("PONTO", "1.0", "Gerenciamento Ponto", dbSize);
}

html5rocks.webdb.createTable = function() {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS CONFIGURACOES(ID DATETIME PRIMARY KEY ASC, SERVIDOR TEXT,PORTA TEXT,USUARIO TEXT,SENHA TEXT)", []);
	tx.executeSql("CREATE TABLE IF NOT EXISTS MARCACOES(ano INTEGER, mes INTEGER, dia INTEGER, hora INTEGER, minuto INTEGER, obs TEXT)", []);
  });
}

function show(settings) {
  var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
  var notification = window.webkitNotifications.createNotification(
    'img/icon_48.png',                      // The image.
    hour + time[2] + ' ' + period, // The title.
    'Time to make the toast.('+settings.USUARIO+')'      // The body.
  );
  notification.show();
}

html5rocks.webdb.getConfiguracoes = function(callback) {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("SELECT ID, SERVIDOR,PORTA ,USUARIO ,SENHA FROM CONFIGURACOES", [], function(tx, rs){
			if(rs.rows.length > 0) {
				callback(rs.rows.item(rs.rows.length -1));
			}
			else{
				callback(null);
			}
		},
        html5rocks.webdb.onError);
  });
}
html5rocks.webdb.getConfiguracoes(show);
*/

var lastRequestId;
var redirects = [];
//redirects[0] = {from:"https://sonata:1818/ConsultaPontoWS/ConsultaPonto?wsdl",isActive:true,to:"https://sonata.interno.senior.com.br:1818/ConsultaPontoWS/ConsultaPonto?wsdl"};
redirects[0] = {startWith:true, from:"http://sonata:8585/",isActive:true,to:"https://sonata.interno.senior.com.br:1818/"};
var promise = {
    promises : [],
    count : 0,

    addPromise : function(descricao){
        var promise = {
            id: this.count++,
            data:null,
            descricao:descricao
        };
        this.promises.push(promise);

        return promise;
    },
    getPromise : function(promise){
        for(var p in this.promises){
            if(promise.id == this.promises[p].id){
                return this.promises[p];
            }
        }
        return null;
    }
}

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
/*
// Create a simple text notification:
var notification = webkitNotifications.createNotification(
  'img/icon_48.png',  // icon url - can be relative
  'Hello!',  // notification title
  'Lorem ipsum...'  // notification body text
);


// Or create an HTML notification:
var notification = webkitNotifications.createHTMLNotification(
  'notification.html'  // html url - can be relative
);
*/
/*
var html5rocks = {};
html5rocks.webdb = {};
html5rocks.webdb.db = null;
html5rocks.webdb.open = function() {
  var dbSize = 5 * 1024 * 1024; // 5MB
  html5rocks.webdb.db = openDatabase("PONTO", "1.0", "Gerenciamento Ponto", dbSize);
}
html5rocks.webdb.getMarcacoesDia = function({user:user,data:data},callback) {
  var db = html5rocks.webdb.db;
  var dia = mes = ano = 0;
	dia = data.getDate();
	mes = data.getMonth()+1;
	ano = data.getFullYear();


  db.transaction(function(tx) {
	result = function(tx,rs){

		var rowOutput = new Array();
		for (var i=0; i < rs.rows.length; i++) {
			rowOutput.push(rs.rows.item(i));
		}
		callback(rowOutput);
	}
	tx.executeSql("SELECT * FROM MARCACOES WHERE user = ? AND ano = ? AND mes = ? AND dia = ?", [user, ano,mes,dia],result,html5rocks.webdb.onError);
  });
}
*/
chrome.runtime.onMessage.addListener(receivedMessage);
function receivedMessage(request, sender, sendResponse) {
	var retorno = null;
    if (request.type == "teste"){
        showNotification(request.msg,function(dados){if(sendResponse)sendResponse(dados);});

    }
    else if (request.type == "notification"){
		showNotification(request);
		retorno = {result:"OK"}
	}
	else if(request.type == "message"){
		retorno = {result:"OK"}
		if(request.messageType == "showMarcacoes"){
			html5rocks.webdb.getMarcacoesDia({user:request.user,data:request.data}, showMarcacoes);
		}
		else{
			retorno = {result:"ERRO mensagem nao pode ser tratada"};
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
        /*else if(request.method == "setConfiguracoes"){
            html5rocks.webdb.setConfiguracoes(request.param[0], function(dados){if(sendResponse)sendResponse(dados);});
        }
        else if(request.method == "getConfiguracoes"){
            p = promise.addPromise();
            html5rocks.webdb.getConfiguracoes(function(data){
                p.data = data;
            });
            sendResponse(p);
        }
        else if(request.method == "getMarca"){
            html5rocks.webdb.getMarca(request.param[0], function(dados){if(sendResponse)sendResponse(dados);})
        }
        else if(request.method == "getMarcacoesDia"){
            html5rocks.webdb.getMarcacoesDia(request.param[0], function(dados){if(sendResponse)sendResponse(dados);})
        }
        else if(request.method == "insertMarca"){
            html5rocks.webdb.insertMarca(request.param[0], function(dados){if(sendResponse)sendResponse(dados);})
        }
        else if(request.method == "deleteMarcacoes"){
            html5rocks.webdb.deleteMarcacoes(function(dados){if(sendResponse)sendResponse(dados);})
        }
        else if(request.method == "deleteMarcacoesUser"){
            html5rocks.webdb.deleteMarcacoesUser(function(dados){if(sendResponse)sendResponse(dados);})
        }
        else if(request.method == "deleteMarcacoesUserData"){
            html5rocks.webdb.deleteMarcacoesUserData(function(dados){if(sendResponse)sendResponse(dados);})
        }
        else if(request.method == "deleteMarca"){
            html5rocks.webdb.deleteMarca(request.param[0], function(dados){if(sendResponse)sendResponse(dados);})
        }
        */

    }
    /*
    if(typeof sendResponse == 'function' && retorno != null){
	}		sendResponse(retorno);
    */
}
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

function zeroEsquerda(str, length) {
	str +="";
	while(str.length < length)str="0"+str;
	return str;
}
