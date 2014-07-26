var Settings = function(db,view) {
    this.server= "localhost";
    this.port="8080";
    this.username="willian";
    this.password="willian";
    this.db = db;
    this.view = view;

    this.load = function(callback) {
        this.db.getConfiguracoes(function(configuracao){
            if (configuracao) {
                this.server = configuracao.SERVIDOR;
                this.port = configuracao.PORTA;
                this.username = configuracao.USUARIO;
                this.password = configuracao.SENHA;
            }
            if(callback){
                callback(configuracao);
            }
        })
    };
    this.save = function(callback) {
        viewValues = this.view.getValues();

        this.server 	= viewValues.server;
        this.port 		= viewValues.port;
        this.username 	= viewValues.username;
        this.password 	= viewValues.password;

        this.db.setConfiguracoes({SERVIDOR:currentSettings.server,PORTA:currentSettings.port,USUARIO:currentSettings.username,SENHA:currentSettings.password},callback);
    };
    this.loadSettings = function(callback) {
        this.load(function(){

            this.view.setValues({
                server : this.server,
                port : this.port,
                username : this.username,
                password : this.password
            });
            if(callback){
                callback();
            }
        });
    }
    this.settingsClosing = function(event) {
        if (event.closeAction == event.Action.commit)
        {
            this.save();
        }
        event.cancel = false;
    };
};

function View(){
    this.getValues = function(){
        return {
            server : txtServer.value,
            port : txtPort.value,
            username : txtUusername.value,
            password : txtPassword.value
        }
    };

    this.setValues = function(dados) {
        txtServer.value = dados.server;
        txtPort.value = dados.port;
        txtUusername.value = dados.username;
        txtPassword.value = dados.password;
    };
};
var currentSettings = new Settings(html5rocks.webdb,new View());