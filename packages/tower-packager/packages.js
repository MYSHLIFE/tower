(function() {
    var glob = require("glob-whatev"),
        path = require("path"),
        fs = require("fs"),
        _ = require("underscore");
    /**
     * Packages Class:
     * @param {Function} cb Callback Function
     */

    function Packages(cb) {
        var self = this;
        /**
         * Storing all the packages in-memory:
         * @type {Object}
         */
        this._packages = {};
        /**
         * The current path of the currently loading package. This string
         * is only temp and will be overwritten by the next loading package.
         * @type {String}
         */
        this._currentPath = null;
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
        path.join(__dirname, '..'), path.join(Tower.cwd, 'node_modules')];

        this._paths.push(path.join(process.cwd(), 'packages'));
        // XXX
        // Wayy too slow for the watcher. We'll need to find another way,
        //this._paths.push(path.join(process.cwd(), 'node_modules'));
        this._autoload = ['server.js', 'index.js'];
    }
    /**
     * Retrieve a package by name.
     * @param  {String} name Name of the package.
     * @return {Object|String} Package Object.
     */
    Packages.prototype.get = function(name) {
        if(this._packages[name]) return this._packages[name]
        else throw Error("Package '" + name + "' was not found.");
    };
    /**
     * Run/Require a particular package. This will load it's init file, if it's specified. This method will return a chainable object
     * that you can use to load specific files within the package.
     * @param  {String} name Package Name
     * @return {Object}      Chainable Object
     */
    Packages.prototype.require = function(package, explicitfile) {
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
                    throw new Error('Cannot autoload any files within the "' + name + '" package. Tried: ' + this._autoload.join(' '));
                }
            } else {
                file = explicitfile;
            }
            var fullPath = path.join(pack._path, file);
            var exists = fs.existsSync(fullPath);
            if(exists) {
                return require(fullPath);
            } else {
                if(file) {
                    throw new Error('Could not load "' + file + '" from the "' + package + '" package.');
                } else {
                    return tryFile(i++);
                }
            }
        }

        return tryFile(0);
    };

    Packages.prototype.run = function(callback) {
        var self = this;
        this.find(function() {
            callback(Object.keys(self._packages).length);
        });
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
                //for(var c in comp) {
                // Process the singular component:
                //    Process(comp[c]);
                //}
                /**
                 * If an array is passed, that means all of the indices are required to be
                 * ready before the callback is called.
                 */
                var c, _c;
                for(c in comp) {
                    _c = comp[c];
                    if(self._readyStates[_c]) {
                        // It's ready!
                        delete comp[c];
                    }
                }

                if(comp.length >= 1) {
                    self._waitingStates.push({
                        components: comp,
                        cb: cb
                    })
                } else {
                    ready = true;
                }
            } else {
                /**
                 * Check the "readyStates" object for the particular component.
                 */
                if(self._readyStates[comp]) {
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
                        component: comp,
                        // (String)
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
                if(c.components) {
                    var _ready = true;
                    for(var i in c.components) {
                        if(!_ready) break;
                        // Look into the ready stated components:
                        if(self._readyStates[c.components[i]]) {
                            _ready = true;
                        } else {
                            _ready = false;

                        }
                    }
                }

                if(c.component) {
                    if(c.component === component) {
                        _ready = true;
                    } else {
                        continue;
                    }
                }

                if(_ready) {
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
        this._currentPath = file.replace(/package.js/i, '');
        require(file);
    };

    Packages.prototype.find = function(callback) {
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

    Tower.Packages = new Packages();

})();