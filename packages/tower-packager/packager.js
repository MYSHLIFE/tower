var glob = require("glob-whatev"),
    path = require("path"),
    fs = require("fs"),
    _ = require("underscore");

function Package(packageName) {
    this.name = packageName;
    this.version = '';
    this.dependencies = [];
    this.serverFiles = [];
    this.clientFiles = [];
    this.path        = Packager._currentPath;
    this.currentLayer = null;
    Packager.add(this.name, this);
}

Package.prototype.server = function() {
    this.currentLayer = 'server';
    return this;
};

Package.prototype.shared = function() {
    this.currentLayer = 'shared';
    return this;
};

Package.prototype.deps = function(arr) {
    var self = this;
    if(!(arr instanceof Array)) return false;

    arr.forEach(function(dep) {
        self.dependencies.push(dep);
    });

    return this;
};

Package.prototype.dep = function(dep) {
    this.dependencies.push(dep);
    return this;
};

Package.prototype.client = function() {
    this.currentLayer = 'client';
    return this;
};

Package.prototype.add = function(file) {
    switch(this.currentLayer) {
    case "server":
        this.serverFiles.push(file);
        break;
    case "client":
        this.clientFiles.push(file);
        break;
    }
    return this;
};

Packager = {
    _autoload: ['server.js', 'index.js'],
    _packages: {},
    _paths: [
    path.join(__dirname, '..'), path.join(Tower.cwd, 'node_modules'), path.join(process.cwd(), 'packages')],
    _cache: {},
    _currentPath: null,
    get: function(name) {
        if(this._packages[name]) return this._packages[name]
        else throw Error("Package '" + name + "' was not found.");
    }
};

Packager.add = function(name, instance) {
    this._packages[name] = instance;
};

Packager.create = function(packageName) {
    return new Package(packageName);
};

Packager.run = function(callback) {
    var self = this;
    this.find(function() {
        callback(Object.keys(self._packages).length);
    });
};

Packager.load = function(file) {
    // Load the package:
    this._currentPath = file.replace(/package.js/i, '');
    require(file);
};

Packager.find = function(callback) {
    var self = this;
    var done = false;
    this._paths.forEach(function(p, i) {
        var dir = fs.readdirSync(p);

        dir.forEach(function(_dir) {
            if(_dir.match("tower-packages")) return;

            if(fs.existsSync(path.join(p, _dir, 'package.js'))) {
                self.load(path.join(p, _dir, 'package.js'));
            }

        });

        if(i == (self._paths.length - 1)) {
            if(!done) {
                process.nextTick(
                callback);
                done = true;
            }
        }
    });


};

Packager.require = function(package, explicitfile) {
    var self = this,
        pack = this.get(package),
        file;

    function tryFile(i) {

        if(!explicitfile) {
            if(!i) {
                i = 0;
            }
            file = self._autoload[i];
            if(!file) {
                throw new Error('Cannot autoload any files within the "' + package + '" package. Tried: ' + this._autoload.join(' '));
            }
        } else {
            file = explicitfile;
        }
        var fullPath = path.join(pack.path, file);
        var exists = fs.existsSync(fullPath);
        if(exists) {
            // Check if the package has dependencies:
            pack.dependencies.forEach(function (dep) {
                Packager.require(dep);
            });
            self._cache[package] = {
                loaded: true,
                path: fullPath,
                dependencies: pack.dependencies
            };
            return require(fullPath);
        } else {
            if(self._autoload.length === i) {
                throw new Error('Could not load "' + file + '" from the "' + package + '" package.');
            } else {
                return tryFile(i+1);
            }
        }
    }

    return tryFile(0);
};

Tower.Packager = Packager;