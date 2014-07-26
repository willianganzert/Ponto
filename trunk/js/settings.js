var Settings = function() {
    this.server= "localhost";
    this.port="8080";
    this.username="willian";
    this.password="willian";

    this.load = function(callback) {
         html5rocks.webdb.getConfiguracoes(function(configuracao){
            if (configuracao)
            {
                this.server = configuracao.SERVIDOR;
                this.port = configuracao.PORTA;
                this.username = configuracao.USUARIO;
                this.password = configuracao.SENHA;
            }
            if(callback)
                callback(configuracao);
        })
    };
    this.save = function(callback) {
        //System.Gadget.Settings.write("SettingsExist", true);

        this.server 	= txtServer.value;
        this.port 		= txtPort.value;
        this.username 	= txtUsername.value;
        this.password 	= txtPassword.value;

        html5rocks.webdb.setConfiguracoes({SERVIDOR:currentSettings.server,PORTA:currentSettings.port,USUARIO:currentSettings.username,SENHA:currentSettings.password},callback);
    }
    this.loadSettings = function(callback) {
        this.load(function(){

            txtServer.value = this.server;
            txtPort.value = this.port;
            txtUsername.value = this.username;
            txtPassword.value = this.password;
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
    }
    this.showCurrent = function() {
        txtServer.value = this.server;
        txtPort.value = this.port;
        txtUusername.value = this.username;
        txtPassword.value = this.password;
    }
}
var currentSettings = new Settings();