var Ponto = function(id, visualinterface) {
    this.id= id;
    this.visualinterface = visualinterface;
    this.horasdiarias = "08:30:00";
    this.horarioSaida = "18:00:00";
    this.tempoPadraoAlmoco = "01:30:00";
    this.configurando 	= false;
    this.diasMarcacoes = [];
    this.selecionado = null;

    this.selecionaDia = function(dia){
        pontoDiaSelecionar = null;
        for(var diaFor in this.diasMarcacoes){
            if(dia == diaFor)
                pontoDiaSelecionar = this.diasMarcacoes[diaFor]
        }
        if(pontoDiaSelecionar){
            this.selecionado = pontoDiaSelecionar;
            this.showDia(this.selecionado)
        }
        else{
            this.diasMarcacoes[dia] = new PontoDia(dia);
            this.selecionaDia(dia);
        }
    }

    this.convertDateToString = convertDateToString;

    this.init = function(dia){
        if(!dia) dia = this.convertDateToString(new Date());
        this.selecionaDia(dia);
    }

    this.showDia = function(pontoDia){
        if(!pontoDia) pontoDia = this.selecionado;
        if(pontoDia.dia == convertDateToString(new Date())){
            if(pontoDia.horaExtra){
                this.visualinterface.setHoraDisplays(pontoDia.horasFaltantes,pontoDia.horarioSaida);
                this.visualinterface.setStyleHoraExtra();
            }
            else{
                this.visualinterface.setHoraDisplays(pontoDia.horasFaltantes,pontoDia.horarioSaida);
                this.visualinterface.setStyleHoraNormal();
            }
        }
        else{
            this.visualinterface.setHoraDisplays(pontoDia.horasFaltantes,pontoDia.horarioSaida);
            this.visualinterface.setStyleNaoHoje();
        }
    }
}
var PontoDia = function(dia) {
    this.dia = dia;
    var calculHorarioSaida = function (pontoDia) {
        return convertSecondsToHours(convertHoursToSeconds(new Date(new Date().setSeconds(0))) + convertHoursToSeconds(pontoDia.horasFaltantes))
    };

//    this.horasdiarias = this.ponto.horasdiarias;
    this.horasFaltantes = "00:21:00";
    this.horasTrabalhadas = "08:09:00";//somente para consulta
//    this.horarioSaida = {pontoDia: this, toString : function () {return convertSecondsToHours(convertHoursToSeconds(new Date(new Date().setSeconds(0))) + convertHoursToSeconds(this.pontoDia.horasFaltantes))}};
    this.horarioSaida = this.horasFaltantes;

    this.horaSegundo = true;
    this.marcacoesDia = new Array();
    this.inserindoMarca	= false;
    this.horaExtra = true;


    /*this.getPontoDia = function (){
        this.horarioSaida = calculHorarioSaida(this);
        return this;
    }*/
    return this;
}