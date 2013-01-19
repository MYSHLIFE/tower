var fs = require('fs'),
    path = require('path'),
    watchr = require('watchr'),
    wrench = require('wrench');


function Bundler() {
    /**
     * Holds all the extensions registered and the callback that will run
     * when we find it's extension:
     *
     * e.g ['js'] = {cb: function(){}}
     *
     * @type {Object}
     */
    this.extensions = {};
}

Bundler.prototype.compile = function(options) {
    options.path = options.path + '.' + options.extension;
    fs.writeFileSync(options.path, options.data.toString('utf-8'));
    this._resources.push(options);
};

Bundler.prototype.addResource = function(options) {
    this.compile(options);
};

Bundler.prototype.registerExtension = function(type, callback) {
    this.extensions[type] = callback;
};

Bundler.prototype.build = function(package) {
    var self = this;
    // Fetch the package's data.
    var pkg = Packages.get(package);

    this.checkOutputValidity();

    if(!fs.existsSync(path.join(_root, this.output.js, package))) {
        fs.mkdirSync(path.join(_root, this.output.js, package));
    }

    pkg._files.forEach(function(file) {
        if(file.type === 'client' || file.type === '*') {
            if(file.file.match(/\.js$/)) {
                if(fs.existsSync(path.join(pkg.path, file))) {
                    // Copy!
                    //console.log(path.join(_root, self.output.js, package));
                    var contents = fs.readFileSync(path.join(pkg.path, file.file), 'utf-8');

                    /**finalPath.forEach(function(p, index){
                                var newP = path.join(buildPath.join(path.sep), p);
                                console.log(index, newP);
                                if (!fs.existsSync(newP)) {
                                    //fs.mkdirSync(newP);
                                    buildPath += newP;
                                }
                            });**/
                    /**

                            var finalPath = [_root, self.output.js, package, file.file];
                            var previous = "";

                            /** 
                            *   Goes through each `finalPath` index one at a time.
                            *   We also assemble the current path to the next path so we build on top.
                            *
                            *   ['_root', 'a', 'b', 'c']
                            *   0 => _root
                            *   1 => _root/a
                            *   2 => _root/a/b
                            *   3 => _root/a/b/c
                            **/
                    
                            function recursive(p) {

                                if (!fs.existsSync(p)) {
                                    console.log("New Dir: " + p);
                                    //fs.mkdirSync(p);
                                }

                            }

                            fs.writeFileSync(path.join(_root, self.output.js, package, file.file), contents, 'utf-8');
                            self.addFileLock(package, path.join(_root, self.output.js, package, file.file), path.join(self.output.js, package, file.file), 'js'); 
               
                        }
                    }
                }

            });
};

Bundler.prototype.watch = function() {
    var self = this;
    watchr.watch({
        paths: Packages._paths,
        listener: function(event, filepath) {
            // When something changes, re-bundle the package.
            //self.build();
            var lookup = null;
            var packageName = filepath.replace(_root, "").replace(/^\\/, "");
            Packages.lookup.forEach(function(p) {
                packageName = packageName.replace(/\\/g, "/");
                if(packageName.match(p)) {
                    lookup = p;
                    packageName = packageName.replace(p, "");
                }
            });
            packageName = packageName.replace(/\/\//g, "/").replace(lookup, "").replace(/^\//, "").match(/^[^\/]+/)[0];
            self.fileChanged(packageName, filepath);
            self.build(packageName);
        },
        next: function(err, watcher) {
            if(err) throw err;
            console.log('\033[36m' + '   info  - ' + '\033[0m' + 'watching packages for changes' + '\033[0m');
        }
    });
};

Bundler.prototype.fileChanged = function(package, filepath) {
    var self = this;
    var pkg = Packages.get(package);
    for(var i in Packages._extensions) {
        var val = Packages._extensions[i];
        /**
         * If the extension matches the registered ones.
         */
                    if(filepath.match(new RegExp("\." + i + "$"))) {
                        // Call the callback;
                        pkg._files.forEach(function(file) {
                            //console.log(pkg.path.replace(/\\/g, "/"), filepath.replace(/\\/g, "/"));
                            var shortPath = filepath.replace(/\\/g, "/").replace(pkg.path.replace(/\\/g, "/"), "");
                            //console.log(filepath.replace(pkg.path.replace(/\\/g, "/"), "").replace(/\\/g, "/"));
                            if(file.file === shortPath) {
                                var serve_path = path.join(_root, self.output.js, package, shortPath.replace(/\..+$/, ""));
                                if(typeof val === "function") val.call(self, filepath, serve_path, file.type);
                            }
                        });
                    }
                }
            };

            /**var Bundler = {
        
        output: {
            js: 'public/packages/',
            css: 'public/packages/',
            images: 'public/packages/'
        },

        _resources: [],

        addResource: function(options) {
            this._compile(options);
        },

        _compile: function(options) {
            options.path = options.path + '.' + options.extension;
            fs.writeFileSync(options.path, options.data.toString('utf-8'));
            this._resources.push(options);
        },
   
        buildAll: function() {

        },
   
        error: function(message) {
            throw Error(message);
        },
    
        build: function(package) {
            var self = this;
            // Fetch the package's data.
            var pkg = Packages.get(package);
            
            this.checkOutputValidity();

            if ( ! fs.existsSync(path.join(_root, this.output.js, package))) {
                fs.mkdirSync(path.join(_root, this.output.js, package));
            }

            pkg._files.forEach(function(file){
                if (file.type === 'client' || file.type === '*') {
                    if (file.file.match(/\.js$/)) {
                        if (fs.existsSync(path.join(pkg.path, file))) {
                            // Copy!
                            //console.log(path.join(_root, self.output.js, package));
                            var contents = fs.readFileSync(path.join(pkg.path, file.file), 'utf-8');
                            
                            /**finalPath.forEach(function(p, index){
                                var newP = path.join(buildPath.join(path.sep), p);
                                console.log(index, newP);
                                if (!fs.existsSync(newP)) {
                                    //fs.mkdirSync(newP);
                                    buildPath += newP;
                                }
                            });**/
            /**

                            var finalPath = [_root, self.output.js, package, file.file];
                            var previous = "";

                            /** 
                            *   Goes through each `finalPath` index one at a time.
                            *   We also assemble the current path to the next path so we build on top.
                            *
                            *   ['_root', 'a', 'b', 'c']
                            *   0 => _root
                            *   1 => _root/a
                            *   2 => _root/a/b
                            *   3 => _root/a/b/c
                            **/
            /** 
                            function recursive(p) {

                                if (!fs.existsSync(p)) {
                                    console.log("New Dir: " + p);
                                    //fs.mkdirSync(p);
                                }

                            }

                            fs.writeFileSync(path.join(_root, self.output.js, package, file.file), contents, 'utf-8');
                            self.addFileLock(package, path.join(_root, self.output.js, package, file.file), path.join(self.output.js, package, file.file), 'js'); 
               
                        }
                    }
                }

            });

        },

        addFileLock: function(name, filename, relative, type) {

            var json = require(path.join(_root, 'packages.json'));

            if (!json.packages[name]) {
                json.packages[name] = {
                    files: []
                };
            }
            var found = false;
            json.packages[name].files.forEach(function(file){
                if (file.file === filename) {
                    found = true;
                }
            });
            if (!found) {
                json.packages[name].files.push({file: filename, type: type, relative: relative});
                fs.writeFileSync(path.join(_root, 'packages.json'), JSON.stringify(json), 'utf-8');
            }
        },

        checkOutputValidity: function() {

            if ( ! fs.existsSync(path.join(_root, this.output.js))) {
                fs.mkdirSync(path.join(_root, this.output.js));
            }

            if ( ! fs.existsSync(path.join(_root, this.output.css))) {
                fs.mkdirSync(path.join(_root, this.output.css));
            }

            if ( ! fs.existsSync(path.join(_root, this.output.images))) {
                fs.mkdirSync(path.join(_root, this.output.images));
            }

        }

    };**/

global.Bundler = Bundler;