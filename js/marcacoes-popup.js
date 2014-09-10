var horasdiarias = "08:30:00";
var horasFaltantes = horasdiarias;
var horarioSaida = "18:00:00";
var horasTrabalhadas = "00:00:00";//somente para consulta
var tempoAlmoco = "01:30:00";
var horaMinutoSegundo = true;
var marcacoesDia = new Array();
var configurando 	= false;
var inserindoMarca	= false;
var horaExtra = true;
var horaExtra2 = true;

var currentPonto = new Ponto("ponto", new ViewDisplayPonto("view_display_ponto"));

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
	
	$(".button-lista-marcacoes").click(getMarcacoes);
	
	
	$(".button-nova-marcacao").click(abreNovaMarca);

	currentSettings.load(function(){
        if(this.username){
            atualizaInformacoes();
            setInterval(atualizaInformacoes,1000);
//            setInterval(function(){typeof animate == 'function'?animate():null;},1000);
        }
        else{
//            console.log("SEM CONFIGURACOES");
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

function getMarcacoes(){
    currentSettings.db.getMarcacoesDia({user:currentSettings.username,data:new Date().getTime()},function(list){
        currentPonto.visualinterface.showMarcacoes(list);
        $(".div-marcacoes").removeClass("esconde");
        $(".button-lista-marcacoes").addClass("esconde");

    })
}
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
	if(ok){
        insereMarca(getMarcacoes);
    }
	$(".nova-marcacao").addClass("esconde");
}

function insereMarca(callback){
//	console.log($("#horario_nova_marca").val());
	now = new Date();
	html5rocks.webdb.insertMarca({user:currentSettings.username,dataHora:new Date((now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " +$("#horario_nova_marca").val()).getTime()},callback);
}


function atualizaInformacoes(){
    sendMessage({type:"co", method:"getInformacoesPonto",param:[currentPonto.selecionado] },function(promise){
        setTimeout(function(){
            sendMessage({type:"co", method:"getPromise",param:[promise]},function(a){
//                console.log(a);
                currentPonto.showDia(a);
            },500)
    });
    });
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