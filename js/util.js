/**
 * Created by WILLIAN LOPES on 09/08/14.
 */
function convertDateToString(date){
    var dateString = (date.getDate()+"").length < 2 ? "0" + date.getDate() : date.getDate();
    dateString += "-"+(((date.getMonth()+1)+"").length < 2 ? "0" + date.getMonth() : date.getMonth());
    dateString += "-"+date.getFullYear() ;
    return dateString;
}

function convertSecondsToHours(seconds){
    var negativo = seconds < 0;
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
    var negativo = minutes < 0;
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

