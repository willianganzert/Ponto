var html5rocks = {};
html5rocks.webdb = {};
html5rocks.webdb.db = null;

html5rocks.webdb.open = function() {
  var dbSize = 5 * 1024 * 1024; // 5MB
  html5rocks.webdb.db = openDatabase("PONTO", "1.0", "Gerenciamento Ponto", dbSize);
}

html5rocks.webdb.createTable = function() {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS CONFIGURACOES(ID DATETIME PRIMARY KEY ASC, SERVIDOR TEXT,PORTA TEXT,USUARIO TEXT,SENHA TEXT)", []);
	tx.executeSql("CREATE TABLE IF NOT EXISTS MARCACOES(user TEXT, ano INTEGER, mes INTEGER, dia INTEGER, hora INTEGER, minuto INTEGER, obs TEXT)", []);
  });
}
html5rocks.webdb.dropTables = function() {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("DROP TABLE CONFIGURACOES;", []);
	tx.executeSql("DROP TABLE MARCACOES;", []);
  });
}

html5rocks.webdb.setConfiguracoes = function(configuracoes,callback) {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx){
    var id = new Date();
    tx.executeSql("INSERT INTO CONFIGURACOES(ID, SERVIDOR,PORTA ,USUARIO ,SENHA) VALUES (?,?,?,?,?)",
        [id, configuracoes.SERVIDOR,configuracoes.PORTA,configuracoes.USUARIO,configuracoes.SENHA],
        function(tx, r){
			html5rocks.webdb.onSuccess(tx, r);
			callback(tx, r);
		},
        html5rocks.webdb.onError);
   });
}
html5rocks.webdb.getConfiguracoes = function(callback) {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("SELECT ID, SERVIDOR,PORTA ,USUARIO ,SENHA FROM CONFIGURACOES", [], function(tx, rs){
			if(rs.rows.length > 0) {
				callback(rs.rows.item(rs.rows.length -1));
			}
			else{
				callback(null);
			}
		},
        html5rocks.webdb.onError);
  });
}
html5rocks.webdb.getMarca = function(marca, callback) {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx) {
	result = function(tx,rs){		
		var rowOutput = new Array();
		for (var i=0; i < rs.rows.length; i++) {
			rowOutput.push(rs.rows.item(i));
		}
		callback(rowOutput);
    }
	tx.executeSql("SELECT * FROM MARCACOES WHERE user = ? AND ano = ? AND mes = ? AND dia = ? AND hora = ? AND minuto = ?", [marca.user,marca.ano,marca.mes,marca.dia,marca.hora,marca.minuto],result,html5rocks.webdb.onError);
  });
}
html5rocks.webdb.getMarcacoesDia = function(marcacoesDia,callback) {
    var db = html5rocks.webdb.db;
    var dia = mes = ano = 0;

    if(typeof marcacoesDia.data == "number")
        marcacoesDia.data = new Date(marcacoesDia.data);

	dia = marcacoesDia.data.getDate();
	mes = marcacoesDia.data.getMonth()+1;
	ano = marcacoesDia.data.getFullYear();
  
	
  db.transaction(function(tx) {
	result = function(tx,rs){
		
		var rowOutput = new Array();
		for (var i=0; i < rs.rows.length; i++) {
			rowOutput.push(rs.rows.item(i));
		}
		callback(rowOutput);
	}
	tx.executeSql("SELECT * FROM MARCACOES WHERE user = ? AND ano = ? AND mes = ? AND dia = ?", [marcacoesDia.user, ano,mes,dia],result,html5rocks.webdb.onError);
  });
}

html5rocks.webdb.insertMarca = function(marca) {
    if(typeof marca.dataHora == "number")
        marca.dataHora = new Date(marca.dataHora);
	marca.dataHora.setSeconds(0);
	console.log("INSERINDO");
	html5rocks.webdb.getMarca({user:marca.user,ano:marca.dataHora.getFullYear(), mes:marca.dataHora.getMonth()+1, dia:marca.dataHora.getDate(), hora:marca.dataHora.getHours(), minuto:marca.dataHora.getMinutes()}, function(list){
		if(!list || !list.length){
		  console.log("INSERIR");
		  var db = html5rocks.webdb.db;
		  db.transaction(function(tx){
            tx.executeSql("INSERT INTO MARCACOES(user,ano, mes, dia, hora, minuto, obs) VALUES (?,?,?,?,?,?,?)",
            [marca.user,marca.dataHora.getFullYear(), marca.dataHora.getMonth() +1,marca.dataHora.getDate(),marca.dataHora.getHours(),marca.dataHora.getMinutes(),marca.obs],
            html5rocks.webdb.onSuccess,
            html5rocks.webdb.onError);
		   });
		}
		else{
			console.log("JÁ INSERIDO");
		}
   })
}

html5rocks.webdb.deleteMarcacoes = function() {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM MARCACOES", [],
        html5rocks.webdb.onSuccess,
        html5rocks.webdb.onError);
    });
}
html5rocks.webdb.deleteMarcacoesUser = function(marcaUser) {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM MARCACOES WHERE user = ?", [marcaUser.user],
        html5rocks.webdb.onSuccess,
        html5rocks.webdb.onError);
    });
}
html5rocks.webdb.deleteMarcacoesUserData = function(marca) {
  var dia = mes = ano = 0;
	dia = marca.data.getDate();
	mes = marca.data.getMonth()+1;
	ano = marca.data.getFullYear();
  var db = html5rocks.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM MARCACOES WHERE user = ? AND ano = ? AND mes = ? AND dia = ?", [marca.user,ano,mes,dia],
        html5rocks.webdb.onSuccess,
        html5rocks.webdb.onError);
    });
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
