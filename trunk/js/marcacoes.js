var dbug = true;
var horasdiarias = "08:30:00";
var horasFaltantes = horasdiarias;
var horarioSaida = "18:00:00";
var horasTrabalhadas = "00:00:00";//somente para consulta
var tempoAlmoco = "01:30:00";
var horaMinutoSegundo = true;
var marcacoesDia = new Array();
var horaExtra = true;
var horaExtra2 = true;
var intervalAjaxReference = null;
var notificadoHoraSaida = [];


var marcacoes = {
    getInformacoesPonto : function(diaSelecionado, callback){
        console.log("DIA SELECIONADO");
        var returnDia = new PontoDia(diaSelecionado.dia);
        returnDia.horaExtra = horaExtra;
        returnDia.horasFaltantes = horasFaltantes;
        returnDia.horasTrabalhadas = horasTrabalhadas;
        returnDia.horarioSaida = horarioSaida;
        if(callback)
            callback(returnDia);
        return returnDia;
    }
}

$(function () {
	typeof initDB == "function"?initDB():null;

    setInterval(calculaHorarios,1000);
    
	currentSettings.load(function(){
        if(dbug){
            html5rocks.webdb.deleteMarcacoesUser({user:currentSettings.username});
        }
        loadPage();
    });

	window.getTime = function(){
		return horasFaltantes;
	}
	window.getTime2 = function(){
		return horarioSaida;
	}
	
	window.isHoraExtra = function(){
		return horaExtra;
	}
	window.isHoraExtra2 = function(){
		return horaExtra2;
	}
});


function insereMarca(){
	console.log($("#horario_nova_marca").val());
	now = new Date();
	html5rocks.webdb.insertMarca({user:currentSettings.username,dataHora:new Date((now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " +$("#horario_nova_marca").val()).getTime()});

}
function loadPage() {
    if(currentSettings.username) {
        setInterval(carregaMarcacoes,1000);

		if(intervalAjaxReference != null){
			clearInterval(intervalAjaxReference);
			intervalAjaxReference = null
		}
		consultaPonto();
		intervalAjaxReference = setInterval(consultaPonto,60000);//600000
	}
    else{
        setTimeout(loadPage,5000);
    }
}

function fakeRequestPonto(){
	//processSuccess(null, "success", {responseText:"<batidas><clock><hour>08</hour><minute>30</minute></clock><clock><hour>11</hour><minute>45</minute></clock><clock><hour>12</hour><minute>50</minute></clock></batidas>"})
//	processSuccess(null, "success", {responseText:"<batidas><clock><hour>08</hour><minute>30</minute></clock><clock><hour>11</hour><minute>45</minute></clock><clock><hour>12</hour><minute>50</minute></clock><clock><hour>18</hour><minute>30</minute></clock><clock><hour>18</hour><minute>40</minute></clock><clock><hour>18</hour><minute>50</minute></clock></batidas>"})
//    08:00 - 12:00 - 13:30
    processSuccess(null, "success", {responseText:"<batidas><clock><hour>08</hour><minute>00</minute></clock><clock><hour>12</hour><minute>00</minute></clock><clock><hour>13</hour><minute>30</minute></clock></batidas>"})

}
function consultaPonto() {
    if(dbug){
        fakeRequestPonto();
    }
    else{
        requestPontoWS();
    }
}
function requestPontoWS() {
	//showNotification({type:"notification", title:"Consultando Ponto", message:""}, function(response) {console.log(response.result);});
	var wsUrl = "https://" + currentSettings.server + ":" + currentSettings.port + "/ConsultaPontoWS/ConsultaPonto";

	var xmlDate = makeXmlDate(new Date());
	var soapRequest =
'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.consultaponto.senior.com/"> \
<soapenv:Header/> \
<soapenv:Body> \
  <ws:consultaPonto>' + makeXmlLogin() +
'       <startDate>' + xmlDate + '</startDate>' +
'       <endDate>' + xmlDate + '</endDate>' +
'  </ws:consultaPonto> \
</soapenv:Body> \
</soapenv:Envelope>';
	console.log("Ajax - "+wsUrl);
	$.ajax({
		type: "POST",
		url: wsUrl,
		contentType: "text/xml",
		dataType: "xml",
		data: soapRequest,
		success: processSuccess,
		error: processError
	});
}
		
function processSuccess(data, status, req) {
	if (status == "success") {
		var result = req.responseText;
		result.replace(/(<\/[^>]*>)/g, "$1<br>");
		var xmlHorarios = $($.parseXML(req.responseText));
		var horarios = new Array();
		xmlHorarios.find("clock").each(function(index) {
			var hora = $(this).find("hour").text();
			var minuto = $(this).find("minute").text();
			hoje = new Date();
			hoje.setHours(hora);
			hoje.setMinutes(minuto);
			horarios.push(hoje);
		});
		gravaMarcacoes(horarios);
	}
}
function gravaMarcacoes(horarios){
	for(var i = 0;i<horarios.length;i++){
		html5rocks.webdb.insertMarca({user:currentSettings.username,dataHora:horarios[i].getTime(),obs:""});
	}
}
function carregaMarcacoes(){
	html5rocks.webdb.getMarcacoesDia({user:currentSettings.username,data:new Date().getTime()},
        function(list){
            list.sort(function(a,b){
                return ((a.hora*60)+a.minuto)-((b.hora*60)+b.minuto)}
            );
            marcacoesDia = list;
        }
    );
}
function calculaHorarios(){
	var now = new Date();
	var segundosTrabalhados = 0;
	var segundosDiarios = convertHoursToSeconds(horasdiarias);
	for (var i=0 ; i < marcacoesDia.length; i = i+2) {
		if(i+1 < marcacoesDia.length){
			segundosTrabalhados += convertHoursToSeconds(marcacoesDia[i+1]) - convertHoursToSeconds(marcacoesDia[i]);
		}
		else{
			segundosTrabalhados += convertHoursToSeconds(now) - convertHoursToSeconds(marcacoesDia[i]);
		}
	}
	
	var segundosFaltantes = segundosDiarios - segundosTrabalhados;
    if(segundosFaltantes < 300 && segundosFaltantes > 5){
        var dia = now.getDate()+"-"+now.getMonth()+"-"+now.getFullYear();
        if(!notificadoHoraSaida[dia] || !notificadoHoraSaida[dia].notificado){
            currentSchedule.addEvent(new EventSchedule("notificaHoraSaida",{trigger:function(){return true},message:{title:"HORARIO DE SAÍDA", message: "Faltam menos de 5 minutos para registrar seu ponto, organize-se!"}}))
            notificadoHoraSaida[dia] = {notificado:true};
        }
    }
	horasFaltantes = convertSecondsToHours(segundosFaltantes);
	var segundosSaida = convertHoursToSeconds(now) + segundosFaltantes + (marcacoesDia.length<3?convertHoursToSeconds(tempoAlmoco):0);
	horarioSaida = convertSecondsToHours(segundosSaida > 86400?segundosSaida-86400:segundosSaida);
	horasTrabalhadas = convertSecondsToHours(segundosTrabalhados);
	horaExtra = segundosFaltantes > 0;
	horaExtra2 = (convertHoursToSeconds(now) + segundosFaltantes) > 0;

    try {
        chrome.browserAction.setBadgeText({text: horarioSaida.replace(":", "").substring(0, 4)})
    } catch (e) {
    }
	/*
	if(horaExtra2){
		chrome.browserAction.setBadgeText({text: horasFaltantes.replace(":","").substring(0,4)})
		if(!(marcacoesDia.length % 2))
			chrome.browserAction.setBadgeBackgroundColor({color:[0, 0, 50, 50]})
		else
			chrome.browserAction.setBadgeBackgroundColor({color:[100, 100, 200, 255]})
	}
	else{
		chrome.browserAction.setBadgeText({text: horarioSaida.replace(":","").substring(0,4)})
		if(!(marcacoesDia.length % 2))
			chrome.browserAction.setBadgeBackgroundColor({color:[0, 0, 50, 50]})
		else
			chrome.browserAction.setBadgeBackgroundColor({color:[50, 150, 50, 255]})
	}
	*/
	
}


function processError(data, status, req) {
		$("#results").text(status + ": " + req);
}
function makeXmlLogin() {
	var xml = "<login><username>" + currentSettings.username + "</username><password>" + currentSettings.password + "</password></login>";
	return xml;
}
function makeXmlDate(date) {
	return "<day>" + date.getDate() + "</day><month>" + (date.getMonth()+1) + "</month><year>" + date.getFullYear() + "</year>";
}


function sendMessage(request, callback){
    chrome.runtime.sendMessage(chrome.app.getDetails().id,request, callback);
}
