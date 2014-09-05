/**
 * Created by WILLIAN LOPES on 05/09/14.
 */
var Schedule = function () {
    this.pendingEvents = [];
    this.executedEvents = [];

    this.init = function () {
        var context = this;
        setInterval(function (){
            context.verifyPendingEvents();
        }, 1000);
    };

    this.verifyPendingEvents = function(){
        for(var eventFor in this.pendingEvents){
            if(this.pendingEvents[eventFor].validateExecute()){
               this.executedEvents.push(this.pendingEvents[eventFor])
               this.pendingEvents.splice(eventFor, 1)
            }
        }
    };

    this.addEvent = function(event){
        var found = false;
        for(var eventFor in this.pendingEvents){
            if(eventFor.id == event.id){
                this.pendingEvents[eventFor] = event;
                found = true;
            }
        }
        if(!found){
            this.pendingEvents.push(event);
        }
    }
}
function EventSchedule(id, options){
    this.id = id?id:new Date().getTime();
    this.executed = false;
    this.options = {notify:true,trigger:function(){return true},execute:function(){}, notificator:currentNotificator, message:{title:"Evento",description:"Descrição"}};
    $.extend(this.options,options);

    this.validateExecute = function(){
        var valid = false;
        if(!this.executed && this.options.trigger()){
            this.execute();
            valid = true;
        }
        return valid;
    }
    this.execute = function(){
        if(this.options.notify){
            if(typeof this.options.message == "string"){
                this.options.notificator.showDefaultNotification(this.options.message);
            }
            else{
                this.options.notificator.showNotification(this.options.message);
            }
        }
        this.options.execute();
        this.executed = true;
    }
    return this;
}

var currentSchedule = new Schedule();
currentSchedule.init();