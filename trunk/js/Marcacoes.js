var timeOffset = 0;
var _6h = 21600;
var horasdiarias = "08:30:00";
var horasFaltantes = horasdiarias;
var horarioSaida = "18:00:00";
var horasTrabalhadas = "00:00:00";//somente para consulta
var tempoAlmoco = "01:30:00";
var horaSegundo = true;
var marcacoesDia = new Array();
var configurando 	= false;
var inserindoMarca	= false;
var horaExtra = true;
var horaExtra2 = true;
var intervalAjaxReference = null;
$(function(){
	typeof initDB == "function"?initDB():null;		

	$("#ok_config").click(function(){
		fechaConfiguracao(true);
	});
	$("#cancelar_config").click(function(){
		fechaConfiguracao(false);
	});
	
	$("#ok_marca").click(function(){
		fechaNovaMarca(true);		
	});
	$("#cancelar_marca").click(function(){		
		fechaNovaMarca(false);
	});
	
	$(".button-config").click(abreConfiguracao);
	
	$(".button-lista-marcacoes").click(function(){
		$(".div-marcacoes").removeClass("esconde");
		$(".button-lista-marcacoes").addClass("esconde");
	});
	
	
	$(".button-nova-marcacao").click(abreNovaMarca);
	
	currentSettings.load(loadPage);
	setInterval(function(){calculaHorarios();typeof animate == 'function'?animate():null;},1000);
	
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
	
	$("#horario_nova_marca").keydown(function(event) {
        if (event.keyCode == 13 ){
			insereMarca();
        }
    });
	$("body").keydown(function(event) {
		if ((event.which == 107 || event.which == 187 ) && !configurando && !inserindoMarca) {
			abreNovaMarca();
		}			
	});
});

function abreConfiguracao(){
	configurando = true;
	$(".configuracoes").removeClass("esconde");
	loadSettings(function(){$("#txtUsername").select();});
}
function fechaConfiguracao(ok){
	configurando = false;
	if(ok)
		currentSettings.save(function(){window.location.reload();});
	$(".configuracoes").addClass("esconde");
}
function abreNovaMarca(){
	inserindoMarca = true;
	now = /(..)(:..)(:..)/.exec(new Date());
	$("#horario_nova_marca").attr("value",now[0]);
	$(".nova-marcacao").removeClass("esconde");		
	$('#horario_nova_marca').focus();
}
function fechaNovaMarca(ok){
	inserindoMarca = false;
	if(ok)
		insereMarca();
	$(".nova-marcacao").addClass("esconde");
}

function insereMarca(){
	console.log($("#horario_nova_marca").val());
	now = new Date();
	html5rocks.webdb.insertMarca({user:currentSettings.username,dataHora:new Date((now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " +$("#horario_nova_marca").val()).getTime()});
	setTimeout(carregaMarcacoes,1000);
}
function loadPage() {
	if(currentSettings.username == "") {
		$(".configuracoes").removeClass("esconde");
	} else {
		carregaMarcacoes();
		if(intervalAjaxReference != null){
			clearInterval(intervalAjaxReference);
			intervalAjaxReference = null
		}
		consultaPonto();
		intervalAjaxReference = setInterval(consultaPonto,600000);//600000
	}
}

function consultaPonto() {
	//processSuccess(null, "success", {responseText:"<batidas><clock><hour>08</hour><minute>30</minute></clock><clock><hour>11</hour><minute>45</minute></clock><clock><hour>12</hour><minute>50</minute></clock></batidas>"})
	processSuccess(null, "success", {responseText:"<batidas><clock><hour>08</hour><minute>30</minute></clock><clock><hour>11</hour><minute>45</minute></clock><clock><hour>12</hour><minute>50</minute></clock><clock><hour>18</hour><minute>30</minute></clock><clock><hour>18</hour><minute>40</minute></clock><clock><hour>18</hour><minute>50</minute></clock></batidas>"})
}
function consultaPonto2() {
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
	setTimeout(carregaMarcacoes,1000);
}
function carregaMarcacoes(){
	html5rocks.webdb.getMarcacoesDia({user:currentSettings.username,data:new Date().getTime()},
        function(list){
            list.sort(function(a,b){
                return ((a.hora*60)+a.minuto)-((b.hora*60)+b.minuto)}
            );
            marcacoesDia = list;
            $(".marcacoes tbody").empty();
            for(var i =0;i<list.length;i++){
                $(".marcacoes tbody").append("<tr><td>"+list[i].dia+"/"+list[i].mes+"/"+list[i].ano+" - "+zeroEsquerda(list[i].hora,2)+":"+zeroEsquerda(list[i].minuto,2));
            }
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
function convertSecondsToHours(seconds){
	negativo = seconds < 0;
	if(negativo) seconds = seconds*-1;
	retHours 	= parseInt((seconds/60)/60);
	retMinutes 	= parseInt((seconds/60)%60);
	retSeconds 	= parseInt(seconds%60);
	if(horaSegundo)
		return (negativo?"":"") + zeroEsquerda(retHours, 2) + ":" + zeroEsquerda(retMinutes, 2) + ":" + zeroEsquerda(retSeconds, 2);
	else
		return (negativo?"":"") + zeroEsquerda(retHours, 2) + ":" + zeroEsquerda(retMinutes, 2);
}
function convertMinuteToHours(minutes){
	negativo = minutes < 0;
	if(negativo) minutes = minutes*-1;
	retHours 	= minutes%60;
	retMinutes 	= parseInt(minutes%60);
	if(horaSegundo)
		return (negativo?"":"") + zeroEsquerda(retHours, 2) + ":" + zeroEsquerda(retMinutes, 2) + ":" + zeroEsquerda(0, 2);
	else
		return (negativo?"":"") + zeroEsquerda(retHours, 2) + ":" + zeroEsquerda(retMinutes, 2);
}
function convertHoursToSeconds(hour){
	if(typeof hour == "string"){
		var hourMinuteSeg = hour.split(":")
		return ((hourMinuteSeg[0]*60)+hourMinuteSeg[1]*1)*60+(hourMinuteSeg.length>2?hourMinuteSeg[2]*1:0);
	}
	else if(hour instanceof Date){
		return ((hour.getHours()*60)+hour.getMinutes())*60+(hour.getSeconds());
	}
	else{
		return ((hour.hora*60)+hour.minuto)*60;
	}
}
function zeroEsquerda(str, length) {
	str +="";
	while(str.length < length)str="0"+str;
	return str;
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
function showNotificationEx(){
	showNotification({type:"notification", title: "NOTIFICATION", message: "Exemplo"}, function(response) {
	  console.log(response);
	});
}
function showNotificationMarcacoes(){
	showNotification({type:"message",messageType:"showMarcacoes",user: currentSettings.username, data: (new Date()).getTime()}, function(response) {
	  console.log(response);
	});
}

function showNotification(request, callback){
	sendMessage(request, callback);
}
function sendMessage(request, callback){
    chrome.runtime.sendMessage(chrome.app.getDetails().id,request, callback);
}