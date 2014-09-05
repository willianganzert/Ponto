var Settings = function(db,view) {
    this.server= "";
    this.port="";
    this.username="";
    this.password="";
    this.db = db;
    this.view = view;

    this.load = function(callback) {
        var context = this;
        this.db.getConfiguracoes(function(configuracao){
            context.setLoadedValues(configuracao);
            if(typeof callback == "function")
                callback.apply(context);
        });
    };
    this.setLoadedValues = function(configuracao){
        if (configuracao) {
            this.server = configuracao.SERVIDOR;
            this.port = configuracao.PORTA;
            this.username = configuracao.USUARIO;
            this.password = configuracao.SENHA;
        }
    }
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

            view.setValues({
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
    return this;
};

function View(id){
    this.id = id;
    this.getValues = function(){
        return {
            server : $("#"+this.id+" #txtServer").val(),
            port : $("#"+this.id+" #txtPort").val(),
            username : $("#"+this.id+" #txtUsername").val(),
            password : $("#"+this.id+" #txtPassword").val()
        }
    };

    this.setValues = function(dados) {
        $("#"+this.id+" #txtServer").val(dados.server);
        $("#"+this.id+" #txtPort").val(dados.port);
        $("#"+this.id+" #txtUsername").val(dados.username);
        $("#"+this.id+" #txtPassword").val(dados.password);
    };
    this.requestSettings = function(){
        $("#"+this.id).removeClass("esconde");
    }
    return this;
};
var currentSettings = new Settings(html5rocks.webdb,new View("configuracoes"));