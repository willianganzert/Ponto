var display = new SegmentDisplay("display");
display.pattern         = "##:##:##";
display.cornerType      = 2;
display.displayType     = 7;
display.displayAngle    = 9;
display.digitHeight     = 20;
display.digitWidth      = 12;
display.digitDistance   = 2;
display.segmentWidth    = 2;
display.segmentDistance = 0.5;


var display2 = new SegmentDisplay('display2');
display2.pattern         = '##:##:##';
display2.segmentCount    = SegmentDisplay.SevenSegment
display2.cornerType      = SegmentDisplay.RoundedCorner;
display2.digitHeight     = 20;
display2.digitWidth      = 14;
display2.digitDistance   = 2.5;
display2.displayAngle    = 6;
display2.segmentWidth    = 2;
display2.segmentDistance = 0.3;


var sketch  = new SegmentDisplay('sketch');
sketch.pattern         = '#';
sketch.value           = '#';
sketch.segmentCount    = display2.segmentCount;
sketch.cornerType      = display2.cornerType;
sketch.digitHeight     = display2.digitHeight;
sketch.digitWidth      = display2.digitWidth;
sketch.digitDistance   = display2.digitDistance;
sketch.displayAngle    = display2.displayAngle;
sketch.segmentWidth    = display2.segmentWidth;
sketch.segmentDistance = display2.segmentDistance;
sketch.colorOn         = '#333';

function displayColor1(){
	display.colorOn         = "rgba(50, 100, 50, 0.9)";//verde
	display.colorOff        = "rgba(0, 0, 0, 0.1)";//cinza
}
function displayColor2(){
	display.colorOn         = "rgba(100, 100, 200, 0.9)";//azul-roxo
	display.colorOff        = "rgba(0, 0, 0, 0.1)";//cinza
}
function display2Color1(){
	display2.colorOn         = 'rgb(233, 93, 15)';//laranja
	display2.colorOff        = 'rgb(75, 30, 5)';//marrom escuro
}
function display2Color2(){
	display2.colorOn         = 'rgb(233, 150, 15)';//laranja
	display2.colorOff        = 'rgb(75, 30, 5)';//marrom escuro
}
displayColor1();
display2Color1();


function getTime() {
	return '00:00:00';
}
function isHoraExtra() {
	return true;
}
function isHoraExtra2() {
	return true;
}
function getTime2() {
	var time    = new Date();
	var hours   = time.getHours();
	var minutes = time.getMinutes();
	var seconds = time.getSeconds();
	var value   = ((hours < 10) ? ' ' : '') + hours
			+ ':' + ((minutes < 10) ? '0' : '') + minutes
			+ ':' + ((seconds < 10) ? '0' : '') + seconds;
	return value;
}
function animate() {
	setColors()
	display.setValue(getTime());        
	display2.setValue(getTime2());
	
	//window.setTimeout(animate, 1000);       
}
function setColors(display1Ativo, display2Ativo){
	if(isHoraExtra()){
		displayColor1();
	}
	else{
		displayColor2();
	}
	if(isHoraExtra2()){
		display2Color1();
	}
	else{
		display2Color2();
	}
}

$(document).ready(function() {  
	display.draw();
	display2.draw();
	sketch.draw();
//	window.setInterval('animate()', 100);       
	animate();
});
//chrome.browserAction.getBadgeBackgroundColor({}, function (sss){alert(sss);});