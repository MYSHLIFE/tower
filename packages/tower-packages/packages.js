var glob = require("glob-whatev"),
    path = require("path"),
    fs = require("fs"),
    _ = require("underscore");

/**
 * Packages Class:
 * @param {Function} cb Callback Function
 */
function Packages(cb) {
    /**
     * Storing all the packages in-memory:
     * @type {Object}
     */
    this._packages = {};
    /**
     * All the components that are marked as ready:
     * @type {Object}
     */
    this._readyStates = {};
    /**
     * All the callbacks that are waiting on a particular
     * component to be ready:
     * @type {Array}
     */
    this._waitingStates = [];
    /**
     * All the paths where we can find packages:
     * @type {Array}
     */
    this._paths = [
        path.join(__dirname, '..'), 
        path.join(_root, 'node_modules')
    ];
    /**
     * If were running in an app, then add it's possible package folders in the
     * path array:
     */
    if(__isApp) {
        this._paths.push(path.join(process.cwd(), 'vendor', 'packages'));
        this._paths.push(path.join(process.cwd(), 'node_modules'));
    }
    /**
     * Find all the packages.
     * @async
     */
    this.find();
}
/**
 * Retrieve a package by name.
 * @param  {String} name Name of the package.
 * @return {Object|String} Package Object.
 */
Packages.prototype.get = function(name) {
    return(this._packages[name] || "Package not found");
};
/**
 * Ready Function.
 *
 * This method provides functionality to bind on particular
 * ready event(s) and the callback will be fired when all dependent components
 * are set as "ready".
 * 
 * @param  {String|Array}   comp Component Names
 * @param  {Function} cb   Callback to be fired
 * @return {Null}
 */
Packages.prototype.ready = function(comp, cb) {
    /**
     * Save the current context.
     * @type {Object}
     */
    var self = this;
    /**
     * Check if `comp` is there, and if the callback
     * is indeed a function.
     */
    if(comp && typeof cb == "function") {
        // Set this to false automatically:
        var ready = false;
        // Check if the `comp` is an Array or not:
        if(comp instanceof Array) {
            // If it's an array
            // loop through it and call the normal method Process:
            for(var c in comp) {
                // Process the singular component:
                Process(comp[c]);
            }
        } else {
            // It's a string; 
            Process(comp);
        }

        /**
         * Process a component. This determines if it's ready or not.
         * If it's not, it'll be added to the waiting list.
         * @param {String} component Name
         */
        function Process(component) {
            /**
             * Check the "readyStates" object for the particular component.
             */
            if(self._readyStates[component]) {
                /**
                 * The currently requested state is ready:
                 */
                ready = true;
            } else {
                /**
                 * The currently requested state isn't ready yet.
                 * Let's add it to the waiting list and set "ready" to false:
                 */
                self._waitingStates.push({
                    component: component, // (String)
                    cb: cb // Callback (Function)
                });
                // Were not ready yet.
                ready = false;
            }

        }
        // Check if we were ready:
        if(ready) {
            // Run the callback:
            cb.apply({});
        }
    } // End of if;
}
/**
 * Set's a component as ready.
 * @param  {String}  component Name    
 */
Packages.prototype.isReady = function(component) {
    // Save the current context:
    var self = this;
    // Check if it's an array
    if(component instanceof Array) {
        for(var c in component) {
            Process(component[c]);
        }
    } else {
        Process(component);
    }

    function Process(comp) {
        self._readyStates[comp] = true;
        Back();
    }

    function Back() {

        /**
         * Loop through the waiting list and check for any
         * waiting for this particular state/component:
         */
        for(var comp in self._waitingStates) {
            var c = self._waitingStates[comp];
            if(c.component === component) {
                c.cb.apply({});
                delete self._waitingStates[comp];
            }
        }

    }
}

Packages.prototype.add = function(name, package) {
    this._packages[name] = package;
}

Packages.prototype.load = function(file) {
    // Load the package:
    require(file);
};

Packages.prototype.find = function(cb) {
    var self = this;

    this._paths.forEach(function(p, i) {

        fs.readdir(p, function(error, dir) {
            if(error) throw Error(error);
            dir.forEach(function(_dir) {
                if(_dir.match("tower-packages")) return;
                // Check if `package.js` exists:
                fs.exists(path.join(p, _dir, 'package.js'), function(exists) {

                    if(exists) {
                        // Package is valid:
                        self.load(path.join(p, _dir, 'package.js'));
                    }

                    if(i == (self._paths.length - 1)) {
                        process.nextTick(function() {
                            self.isReady('__packages_loaded__');
                        });
                    }

                });

            });

        });

    });

};


/**var Packages = {

        _packages: {},
        _paths: [],
        _corePaths: [
            path.join(__dirname, '..')
        ],
        found: {},
        lock: {},
        lookup: [],
        _packagesFound: [],
        _extensions: {},

        initialize: function(config) {
            this.findAll();
        },


        load: function(name) {

        },

        get: function(name) {
            return this._packages[name] || "Package not found";
        },

        add: function(name, obj) {
            this._packages[name] = obj;
        },

        create: function(name, package) {
            var self = this;
            if (self._packages[name] != null) return;
            this._paths.push(package);
            require(path.join(package, "package.js"));
            console.log("NAME: " + name);
            self._packages.forEach(function(a){
                console.log(a.path);
            });
            self._packages[name].path = package;
        },

        registerExtension: function(type, callback) {
            this._extensions[type] = callback;
        },

        findAll: function() {
            // Find all the packages.
            var basePath     = path.join(_root, "packages") + path.sep; 
            var globString   = basePath + "*";

            var self = this;

            this._corePaths.forEach(function(_path){
                var globString = path.join(_path, "*");
                _.select(glob.glob(globString), function(i){return true;//return !i.match('tower-packages')}).forEach(function(filepath){
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
                    } else {
                        console.log(filepath);
                    }
                });
            });

            this.lookup.forEach(function(_path){
                var fullPath = path.join(_root, _path);
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

    };**/

global.Packages = Packages;