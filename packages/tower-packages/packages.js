var glob = require("glob-whatev"),
    path = require("path"),
    fs   = require("fs"),
    _    = require("underscore");

    
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

_.regexpEscape = function(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

if (Tower.root === "/" || Tower.root == null) Tower.root = process.cwd();

var Packages = {

    _packages: {},
    _paths: [],
    found: {},
    lock: {},
    lookup: [],
    _packagesFound: [],
    _extensions: {},

    initialize: function() {
        this.findLookups();
        this.findAll();
    },

    get: function(name) {
        return this._packages[name] || "Package not found";
    },

    add: function(name, obj) {
        this._packages[name] = obj;
    },

    create: function(name, package) {
        var self = this;
        this._paths.push(package);
        require(path.join(package, "package.js"));
        self._packages[name].path = package;
    },

    registerExtension: function(type, callback) {
        this._extensions[type] = callback;
    },

    findLookups: function() {
        var self = this;
        if (fs.existsSync(path.join(Tower.AppRoot, 'package.json'))) {
            var file = fs.readFileSync(path.join(Tower.AppRoot, 'package.json'), 'utf-8');
            var json = JSON.parse(file);
            self.lookup = json.tower.packages.lookup; 
        }
    },

    findAll: function() {
        // Find all the packages.
        var basePath     = path.join(Tower.root, "packages") + path.sep; 
        var globString   = basePath + "*";

        var self = this;
        this.lookup.forEach(function(_path){
            var fullPath = path.join(Tower.root, _path);
            var globString = path.join(fullPath, "*");
            glob.glob(globString).forEach(function(filepath){
                // Load the package.js file.
                var packageFile = path.join(filepath, "package.js");
                if (fs.existsSync(packageFile)) {
                    var name;
                    name = filepath.replace(/\//g, "\\").replace(/\/$/, "").split('\\');
                    
                    function getLastElement(n, length) {
                        if (n[length] != null && n[length] != "") {
                            return n[length];
                        } else {
                            return getLastElement(n, length - 1);
                        }
                    }

                    name = getLastElement(name, name.length - 1);
                    self._packagesFound.push({name: name, path: filepath});
                    self.create(name, filepath); // Create the package.
                }
            });
        });
    }

};



Tower.Packages = Packages;