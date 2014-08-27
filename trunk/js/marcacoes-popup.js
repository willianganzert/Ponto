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

var currentPonto = new Ponto("ponto",new SegmentDisplayPonto());

$(function(){
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
	
	currentSettings.load(function(aaa){
        if(aaa){
            atualizaInformacoes();
            setInterval(atualizaInformacoes,1000);
            setInterval(function(){typeof animate == 'function'?animate():null;},1000);
        }
        else{
            console.log("SEM CONFIGURACOES");
            currentSettings.view.requestSettings();
        }
    });

	window.getTime = function(){
		return currentPonto.horasFaltantes;
	}
	window.getTime2 = function(){
		return currentPonto.horarioSaida;
	}
	
	window.isHoraExtra = function(){
		return currentPonto.horaExtra;
	}
	window.isHoraExtra2 = function(){
		return currentPonto.horaExtra2;
	}
	
	$("#horario_nova_marca").keydown(function(event) {
        if (event.keyCode == 13 ){
			insereMarca();
        }
    });
	$("body").keydown(function(event) {
		if ((event.which == 107 || event.which == 187 ) && !currentSettings.configurando && !currentSettings.inserindoMarca) {
			abreNovaMarca();
		}			
	});

    currentPonto.init();
});

function abreConfiguracao(){
    currentSettings.configurando = true;
	$(".configuracoes").removeClass("esconde");
    currentSettings.loadSettings(function(){$("#txtUsername").select();});
}
function fechaConfiguracao(ok){
    currentSettings.configurando = false;
	if(ok)
		currentSettings.save(function(){window.location.reload();});
	$(".configuracoes").addClass("esconde");
}
function abreNovaMarca(){
    currentSettings.inserindoMarca = true;
	now = /(..)(:..)(:..)/.exec(new Date());
	$("#horario_nova_marca").attr("value",now[0]);
	$(".nova-marcacao").removeClass("esconde");		
	$('#horario_nova_marca').focus();
}
function fechaNovaMarca(ok){
    currentSettings.inserindoMarca = false;
	if(ok)
		insereMarca();
	$(".nova-marcacao").addClass("esconde");
}

function insereMarca(){
	console.log($("#horario_nova_marca").val());
	now = new Date();
	html5rocks.webdb.insertMarca({user:currentSettings.username,dataHora:new Date((now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " +$("#horario_nova_marca").val()).getTime()});
}

function carregaMarcacoes(list){
    list.sort(function(a,b){
        return ((a.hora*60)+a.minuto)-((b.hora*60)+b.minuto)}
    );
    marcacoesDia = list;
    $(".marcacoes tbody").empty();
    for(var i =0;i<list.length;i++){
        $(".marcacoes tbody").append("<tr><td>"+list[i].dia+"/"+list[i].mes+"/"+list[i].ano+" - "+zeroEsquerda(list[i].hora,2)+":"+zeroEsquerda(list[i].minuto,2));
    }

}
function atualizaInformacoes(){
    sendMessage({type:"co", method:"getInformacoesPonto",param:[currentPonto.selecionado] },function(promise){
        setTimeout(function(){
            sendMessage({type:"co", method:"getPromise",param:[promise]},function(a){
                console.log(a);
                currentPonto.showDia(a);
            },500)
    });
    });
    /*sendMessage({type:"db", method:"getPromise",param:[promise]},function(ponto){
        currentPonto.info = ponto;
        carregaMarcacoes(currentPonto.info.marcacoesDia);
    });

	horasFaltantes = convertSecondsToHours(segundosFaltantes);
	var segundosSaida = convertHoursToSeconds(now) + segundosFaltantes + (marcacoesDia.length<3?convertHoursToSeconds(tempoAlmoco):0);
	horarioSaida = convertSecondsToHours(segundosSaida > 86400?segundosSaida-86400:segundosSaida);
	horasTrabalhadas = convertSecondsToHours(segundosTrabalhados);
	horaExtra = segundosFaltantes > 0;
	horaExtra2 = (convertHoursToSeconds(now) + segundosFaltantes) > 0;*/
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
