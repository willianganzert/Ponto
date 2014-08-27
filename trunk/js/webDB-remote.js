var html5rocks = {};
html5rocks.webdb = {};
html5rocks.webdb.db = null;

html5rocks.webdb.open = function() {
}

html5rocks.webdb.createTable = function() {
}
html5rocks.webdb.dropTables = function() {
}
/**
 *
 * @param configuracoes
 * @param callback
 */
html5rocks.webdb.setConfiguracoes = function(configuracoes,callback) {
    sendMessage({type:"db", method:"setConfiguracoes",param:[configuracoes] },function(promise){
        setTimeout(function(){
            sendMessage({type:"db", method:"getPromise",param:[promise]},callback);
        },500)
    });
}
html5rocks.webdb.getConfiguracoes = function(callback) {
    sendMessage({type:"db", method:"getConfiguracoes",param:[] },function(promise){
        callLater({type:"db", method:"getPromise",param:[promise],callback:callback});
        /*setTimeout(function(){
            sendMessage({type:"db", method:"getPromise",param:[promise]},callback);
        },500)*/
    });
}
html5rocks.webdb.getMarca = function(marca, callback) {
    //sendMessage({type:"db", method:"getMarca",param:[marca] },callback);
    sendMessage({type:"db", method:"getMarca",param:[marca] },function(promise){
        setTimeout(function(){
            sendMessage({type:"db", method:"getPromise",param:[promise]},callback);
        },500)
    });
}
html5rocks.webdb.getMarcacoesDia = function(marcacoesDia,callback) {
    //sendMessage({type:"db", method:"getMarcacoesDia",param:[marcacoesDia] },callback);
    sendMessage({type:"db", method:"getMarcacoesDia",param:[marcacoesDia] },function(promise){
        setTimeout(function(){
            sendMessage({type:"db", method:"getPromise",param:[promise]},callback);
        },500)
    });
}

html5rocks.webdb.insertMarca = function(marca) {
	sendMessage({type:"db", method:"insertMarca",param:[marca] });
}

html5rocks.webdb.deleteMarcacoes = function() {
    sendMessage({type:"db", method:"deleteMarcacoes",param:[] });
}

html5rocks.webdb.deleteMarcacoesUser = function(marcaUser) {
    sendMessage({type:"db", method:"deleteMarcacoesUser",param:[marcaUser] });
}
html5rocks.webdb.deleteMarcacoesUserData = function(marca) {
    sendMessage({type:"db", method:"deleteMarcacoesUserData",param:[marca] });
}

html5rocks.webdb.deleteMarca = function(marca) {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM MARCACOES WHERE user= ?, ano = ? AND mes = ? AND dia = ? AND hora = ? AND minuto = ?", [marca.user,marca.ano,marca.mes,marca.dia,marca.hora,marca.minuto],
        html5rocks.webdb.onSuccess,
        html5rocks.webdb.onError);
    });
}


html5rocks.webdb.onError = function(tx, e) {
  alert("There has been an error: " + e.message);
}

html5rocks.webdb.onSuccess = function(tx, r) {
  // re-render the data.
  //html5rocks.webdb.getAllTodoItems(loadTodoItems);
}
sql = function(sqlE,params){
	var db = html5rocks.webdb.db;
	db.transaction(function(tx){
	tx.executeSql(sqlE,params,
		html5rocks.webdb.onSuccess,
		html5rocks.webdb.onError);
	});
}

function initDB() {
  html5rocks.webdb.open();
  html5rocks.webdb.createTable();
}

function callLater(message){
    setTimeout(function(){
        sendMessage(message,message.callback);
    },500);
}