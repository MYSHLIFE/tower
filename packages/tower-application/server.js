function Application() {
    this.run();
}

Application._instance = null;

Application.prototype.route = function() {
    return new Tower.Router();
};

Application.prototype.model = function(model) {
    return new Tower.Model(model);
};

Application.prototype.bundler = function() {
    return Tower.Bundler.create();
}();

Application.create = function() {
    return (this._instance = new Application());
}

Application.prototype.use = function() {
    if (this.app) {
        this.app.use.apply({}, arguments);
    }
    return this;
};

Application.prototype.initialize = function() {
    this.listen();
};

Application.prototype.run = function() {
    this.app = require('express')();
    this.server = (require('http')).createServer(this.app);
    this.app.use(Tower.Router.Middleware);
};

Application.prototype.listen = function() {

    this.server.listen(Tower.port, function() {
        log("HTTP Server is listening.".bold + "\n\t\t\t " + "Port:".underline + " [".green + Tower.port + "]".green);
    });
};

Tower.export(Application);