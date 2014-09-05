var ViewDisplayPonto = function (id) {
    this.id = id;
    this.horaDisplay1 = "00:00:00";
    this.horaDisplay2 = "00:00:00";

    this.display1 = new SegmentDisplay("display");
    this.display1.pattern         = "##:##:##";
    this.display1.cornerType      = 2;
    this.display1.displayType     = 7;
    this.display1.displayAngle    = 9;
    this.display1.digitHeight     = 20;
    this.display1.digitWidth      = 12;
    this.display1.digitDistance   = 2;
    this.display1.segmentWidth    = 2;
    this.display1.segmentDistance = 0.5;
    this.display1.value = this.horaDisplay1;


    this.display2 = new SegmentDisplay('display2');
    this.display2.pattern         = '##:##:##';
    this.display2.segmentCount    = SegmentDisplay.SevenSegment;
    this.display2.cornerType      = SegmentDisplay.RoundedCorner;
    this.display2.digitHeight     = 20;
    this.display2.digitWidth      = 14;
    this.display2.digitDistance   = 2.5;
    this.display2.displayAngle    = 6;
    this.display2.segmentWidth    = 2;
    this.display2.segmentDistance = 0.3;
    this.display2.value = this.horaDisplay2;


    this.init = function () {
        this.display1.draw();
        this.display2.draw();
        return this;
    }
    this.setStyleHoraExtra = function(){
        this.display1.colorOn         = "rgba(50, 100, 50, 0.9)";//verde
        this.display1.colorOff        = "rgba(0, 0, 0, 0.1)";//cinza
        this.display2.colorOn         = 'rgb(233, 93, 15)';//laranja
        this.display2.colorOff        = 'rgb(75, 30, 5)';//marrom escuro
    }
    this.setStyleHoraNormal = function(){
        this.display1.colorOn         = "rgba(100, 100, 200, 0.9)";//azul-roxo
        this.display1.colorOff        = "rgba(0, 0, 0, 0.1)";//cinza
        this.display2.colorOn         = 'rgb(233, 150, 15)';//laranja
        this.display2.colorOff        = 'rgb(75, 30, 5)';//marrom escuro
    }
    this.setStyleNaoHoje = function(){
        this.display1.colorOn         = "rgba(100, 100, 200, 0.9)";//azul-roxo
        this.display1.colorOff        = "rgba(0, 0, 0, 0.1)";//cinza
        this.display2.colorOn         = 'rgb(233, 150, 15)';//laranja
        this.display2.colorOff        = 'rgb(75, 30, 5)';//marrom escuro
    }

    this.setHoraDisplays = function(horaDisplay1, horaDisplay2){
        this.horaDisplay1 = horaDisplay1?horaDisplay1:"00:00:00";
        this.horaDisplay2 = horaDisplay2?horaDisplay2:"00:00:00";
        this.display1.setValue(horaDisplay1);
        this.display2.setValue(horaDisplay2);
    }

    this.getHoraDisplay1 = function(){
        return this.horaDisplay1;
    }
    this.getHoraDisplay2 = function(){
        return this.horaDisplay2;
    }
    this.showMarcacoes = function(list){
        list.sort(function(a,b){
                return ((a.hora*60)+a.minuto)-((b.hora*60)+b.minuto)}
        );
        $("#"+this.id+" .marcacoes tbody").empty();
        for(var i =0;i<list.length;i++){
            $(".marcacoes tbody").append("<tr><td>"+list[i].dia+"/"+list[i].mes+"/"+list[i].ano+" - "+zeroEsquerda(list[i].hora,2)+":"+zeroEsquerda(list[i].minuto,2));
        }

    }
    return this;
}