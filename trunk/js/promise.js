/**
 * Created by WILLIAN LOPES on 27/08/14.
 */

var lastRequestId;
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

