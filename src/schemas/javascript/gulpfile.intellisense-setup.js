(function (global) {
    "use strict";

    // A collection of all supported modules.
    var modules = {};

    // The default return type for unknown modules.
    var defaultModule = function () { return function () { }; };

    /**
    * Require a node module.
    * @param {String} module The name/path of the module to require.
    */
    var require = function (module) {
        var fn = modules[module] || defaultModule;
        return fn.call();
    };

    // The Node.js EventEmitter class.
    var EventEmitter = function () {
        /**
         * Add an event listener.
         * @param {String} event The name of the event, such as "data", "error" etc.
         * @param {Function} listener The function to execute when the event fires.
         */
        this.addListener = function (event, listener) { return this; };

        /**
         * Adds a listener to the end of the listeners array for the specified event.
         * @param {String} event The name of the event, such as "data", "error" etc.
         * @param {Function} listener The function to execute when the event fires.
         */
        this.on = function () { return this; };

        /**
         * Adds a one time listener for the event. This listener is invoked only the next time the event is fired, after which it is removed.
         * @param {String} event The name of the event, such as "data", "error" etc.
         * @param {Function} listener The function to execute when the event fires.
         */
        this.once = function () { return this; };

        /**
         * Remove a listener from the listener array for the specified event. Caution: changes array indices in the listener array behind the listener.
         * @param {String} event The name of the event, such as "data", "error" etc.
         * @param {Function} listener The function to execute when the event fires.
         */
        this.removeListener = function () { return this; };

        /**
         * Removes all listeners, or those of the specified event. It's not a good idea to remove listeners that were added elsewhere in the code, especially when it's on an emitter that you didn't create (e.g. sockets or file streams). 
         * @param {String} [event] The name of the event, such as "data", "error" etc.
         */
        this.removeAllListeners = function () { return this; };

        /**
         * Returns an array of listeners for the specified event.
         * @param {String} event The name of the event, such as "data", "error" etc.
         */
        this.listeners = function () { return [this]; };

        /**
         * Returns an array of listeners for the specified event.
         * @param {String} event The name of the event, such as "data", "error" etc.
         */
        this.emit = function () { return true; };

        /**
         * By default EventEmitters will print a warning if more than 10 listeners are added for a particular event. This is a useful default which helps finding memory leaks. Obviously not all Emitters should be limited to 10. This function allows that to be increased.
         * @param {Number} max Set to zero for unlimited.
         */
        this.setMaxListeners = function () { };
    };

    // The Node.js Stream interface.
    var Stream = function () {
        var readable = {

            // This method will cause a stream in flowing-mode to stop emitting data events. Any data that becomes available will remain in the internal buffer.
            pause: function () { },

            /**
             * This method pulls all the data out of a readable stream, and writes it to the supplied destination, automatically managing the flow so that the destination is not overwhelmed by a fast readable stream.
             * @param {Stream} stream The destination for writing data.
             * @param {Object} [options]
             */
            pipe: function (stream) {

                if (!stream || !stream._$append) {
                    return this;
                }

                for (var prop in stream) {
                    if (prop.indexOf("_$") !== 0) {
                        this[prop] = stream[prop];
                    }
                }

                return this;
            },

            /**
            * The read() method pulls some data out of the internal buffer and returns it. If there is no data available, then it will return null.
            * @param {Number} [size] Optional argument to specify how much data to read.
            */
            read: function () { },

            // This method will cause the readable stream to resume emitting data events.
            resume: function () { },

            /**
            * Call this function to cause the stream to return strings of the specified encoding instead of Buffer objects.
            * @param {String} encoding The encoding to use.
            */
            setEncoding: function () { },

            /**
            * This method will remove the hooks set up for a previous pipe() call.
            * @param {Stream} [stream] The specific stream to unpipe.
            */
            unpipe: function () { },

            /**
            * This is useful in certain cases where a stream is being consumed by a parser, which needs to "un-consume" some data that it has optimistically pulled out of the source, so that the stream can be passed on to some other party.
            * @param {String or Buffer} chunk The specific stream to unpipe.
            */
            unshift: function () { },

            wrap: function () { }
        };

        var writable = {
            write: function (data, encoding, callback) { },
            end: function (chunk, encoding, callback) { }
        };

        var duplex = merge(readable, writable);

        EventEmitter.call(readable);
        EventEmitter.call(writable);

        return {
            Readable: function () { return readable; },
            Writable: function () { return writable; },
            Duplex: function () { return duplex; },
            Transform: function () { return duplex; }
        };
    };

    modules["events"] = function () {
        return {
            EventEmitter: new EventEmitter()
        };
    };

    modules["gulp"] = function () {
        var dependencies = {
            vfs: modules["vinyl-fs"]()
        };

        var gulp = {
            /**
             * Registers a Gulp task.
             * @param {String} name The name of the task. Tasks that you want to run from the command line should not have spaces in them.
             * @param {Array} [deps] An array of tasks to be executed and completed before your task will run.
             * @param {Function} [fn] The function that performs the task's operations. Generally this takes the form of gulp.src().pipe(someplugin()).
             */
            task: function () {
                return {
                    isRunning: false,
                    start: function () { },
                    stop: function () { },
                    doneCallback: function () { }
                };
            },

            tasks: {},

            /**
             * Checks if a task has been registered with Gulp.
             * @param {String} name The name of the task.
             */
            hasTask: function () { return true; },

            isRunning: true,
            domain: null,
            seq: [],
            doneCallback: undefined,

            dest: dependencies.vfs.dest,
            src: dependencies.vfs.src,
            watch: dependencies.vfs.watch
        };

        return gulp;
    };

    modules["gulp-coffee"] = function () {

        global.coffeeScriptConfig = function () {
            return {
                bare: true,
                shiftLine: true,
                header: "",
                sandbox: {}
            };
        };

        /**
         * Compiles CoffeeScript files to JavaScript.
         * @param {coffeeScriptConfig} [options] A configuration object for CoffeeScript.
         */
        return function () { };
    };

    modules["gulp-concat"] = function () {

        global.concatConfig = function () {
            return {
                path: "",
                newline: true,
                stat: {
                    mode: 0
                }
            };
        };

        /**
         * This will concat files by your operating systems newLine. It will take the base directory from the first file that passes through it.
         * @param {String} [filename]
         * @param {concatConfig} [options] A configuration object for concat.
         */
        return function () { };
    };

    modules["gulp-jshint"] = function () {

        global.jshintConfig = function () {
            return {
                maxerr: 500,

                bitwise: true,
                camelcase: false,
                curly: false,
                eqeqeq: true,
                forin: true,
                immed: false,
                indent: 4,

                latedef: false,
                newcap: false,
                noarg: true,
                noempty: true,
                nonew: false,
                plusplus: false,
                quotmark: false,

                undef: true,
                unused: true,
                strict: false,
                maxparams: false,
                maxdepth: false,
                maxstatements: false,
                maxcomplexity: false,
                maxlen: false,

                asi: false,
                boss: false,
                debug: true,
                eqnull: false,
                es5: false,
                esnext: false,
                moz: false,

                evil: false,
                expr: true,
                funcscope: false,
                globalstrict: false,
                iterator: false,
                lastsemic: false,
                laxbreak: true,
                laxcomma: true,
                loopfunc: false,
                multistr: false,
                proto: false,
                scripturl: false,
                shadow: false,
                sub: false,
                supernew: false,
                validthis: false,

                browser: true,
                couch: false,
                devel: true,
                dojo: false,
                jquery: true,
                mootools: false,
                node: false,
                nonstandard: false,
                prototypejs: false,
                rhino: false,
                worker: false,
                wsh: false,
                yui: false,

                globals: {}
            };
        };

        /**
         * JavaScript linting task.
         * @param {jshintConfig} [options] A configuration object for JSHint.
         */
        var jshint = function () { };

        jshint.reporter = function () { };

        /**
         * Tells JSHint to extract JavaScript from HTML files before linting (see JSHint CLI flags). Keep in mind that it doesn't override the file's content after extraction.
         * @param {String} flags The flag can be "auto", "always" or "never". The default is "auto".
         */
        jshint.extract = function () { };

        return jshint;
    };

    modules["gulp-less"] = function () {

        global.lessConfig = function () {
            return {
                /// <field name="paths" type="String, Array or Function">Specifies directories to scan for @import directives when parsing. Default value is the directory of the source, which is probably what you want.</field>
                paths: "",

                /// <field name="rootpath" type="Boolean">A path to add on to the start of every URL resource.</field>
                rootpath: "",

                /// <field name="compress" type="Boolean">Compress output by removing some whitespaces.</field>
                compress: false,

                /// <field name="yuicompress" type="Boolean" />
                yuicompress: false,

                /// <field name="plugins" type="Array">Allows passing plugins.</field>
                plugins: [],

                /// <field name="ieCompat" type="Boolean">Enforce the CSS output is compatible with Internet Explorer 8.</field>
                ieCompat: true,

                /// <field name="optimization" type="Integer">Set the parser's optimization level. The lower the number, the less nodes it will create in the tree. This could matter for debugging, or if you want to access the individual nodes in the tree.</field>
                optimization: false,

                /// <field name="strictImports" type="Boolean">Force evaluation of imports.</field>
                strictImports: false,

                /// <field name="strictMath" type="Boolean">When enabled, math is required to be in parenthesis.</field>
                strictMath: false,

                /// <field name="strictUnits" type="Boolean">When enabled, less will validate the units used (e.g. 4px/2px = 2, not 2px and 4em/2px throws an error).</field>
                strictUnits: false,

                /// <field name="syncImport" type="Boolean">Read @import'ed files synchronously from disk.</field>
                syncImport: false,

                /// <field name="dumpLineNumbers" type="Boolean">Configures -sass-debug-info support. Accepts following values: "comments", "mediaquery", "all".</field>
                dumpLineNumbers: false,

                /// <field name="relativeUrls" type="Boolean">Rewrite URLs to be relative. false: do not modify URLs.</field>
                relativeUrls: false,

                /// <field name="customFunctions" type="Object">Define custom functions to be available within your LESS stylesheets.</field>
                customFunctions: {},

                /// <field name="sourceMapBasepath" type="String">Sets the base path for the less file paths in the source map.</field>
                sourceMapBasepath: "",

                /// <field name="sourceMapRootpath" type="String">Adds this path onto the less file paths in the source map.</field>
                sourceMapRootpath: "",

                /// <field name="modifyVars" type="Object">Overrides global variables. Equivalent to  --modify-vars='VAR=VALUE'  option in less.</field>
                modifyVars: {},

                /// <field name="banner" type="String">A banner text to inject at the top of the compiled CSS file.</field>
                banner: ""
            };
        };

        /**
         * Compiles LESS files into CSS.
         * @param {lessConfig} [options] A configuration object for LESS.
         */
        return function () { };
    };

    modules["gulp-sourcemaps"] = function () {

        global.sourcemapsInitConfig = function () {
            return {
                /// <field name="loadMaps" type="Boolean">Set to true to load existing maps for source files.</field>
                loadMaps: true,
                /// <field name="debug" type="Boolean">Set this to  true  to output debug messages (e.g. about missing source content).</field>
                debug: false
            };
        };

        global.sourcemapsWriteConfig = function () {
            return {
                /// <field name="addComment" type="Boolean">By default a comment containing / referencing the source map is added. Set this to  false  to disable the comment (e.g. if you want to load the source maps by header).</field>
                addComment: true,
                /// <field name=" includeContent" type="Boolean">By default the source maps include the source code. Pass  false  to use the original files.</field>
                includeContent: false,
                /// <field name="sourceRoot" type="String">Set the path where the source files are hosted.</field>
                sourceRoot: "",
                /// <field name="sourceMappingURLPrefix" type="String">Specify a prefix to be prepended onto the source map URL when writing external source maps. Relative paths will have their leading dots stripped.</field>
                sourceMappingURLPrefix: false,
                /// <field name="debug" type="Boolean">Set this to  true  to output debug messages (e.g. about missing source content).</field>
                debug: false
            };
        };

        return {
            /**
             * Initializes the source mapping.
             * @param {sourcemapsInitConfig} [options] A configuration object for sourcemaps.
             */
            init: function () { },

            /**
             * Writes the sourcemap.
             * @param {sourcemapsWriteConfig} [options] A configuration object for sourcemaps.
             * @param {string} [path] To write external source map files, pass a path relative to the destination to  sourcemaps.write() 
             */
            write: function () { }
        };
    };

    modules["gulp-tslint"] = function () {

        global.tslintConfig = function () {
            return {
                configuration: {
                    rules: {
                        "ban": "",
                        "class-name": true,
                        "comment-format": "",
                        "curly": true,
                        "eofline": false,
                        "forin": true,
                        "indent": true,
                        "interface-name": true,
                        "jsdoc-format": true,
                        "label-position": true,
                        "label-undefined": true,
                        "max-line-length": true,
                        "no-arg": true,
                        "no-bitwise": true,
                        "no-console": true,
                        "no-construct": true,
                        "no-debugger": true,
                        "no-duplicate-key": true,
                        "no-duplicate-variable": true,
                        "no-empty": true,
                        "no-eval": true,
                        "no-string-literal": true,
                        "no-trailing-comma": true,
                        "no-trailing-whitespace": true,
                        "no-unused-expression": true,
                        "no-unused-variable": true,
                        "no-unreachable": true,
                        "no-use-before-declare": true,
                        "one-line": true,
                        "quotemark": true,
                        "radix": true,
                        "semicolon": true,
                        "triple-equals": true,
                        "typedef": true,
                        "typedef-whitespace": true,
                        "use-strict": true,
                        "variable-name": false,
                        "whitespace": true
                    }
                },
                rulesDirectory: null,
                emitError: true
            };
        };

        /**
         * Runs static code analysis on TypeScript files.
         * @param {tslintConfig} [options] A configuration object for TSLint.
         */
        var fn = function () { };

        /**
         * Specify a TSLint reporter.
         * @param {String or Function} reporter
         * @param {Object} [options] A configuration object for TSLint reporting.
         */
        fn.report = function () { };

        return fn;
    };

    modules["gulp-typescript"] = function () {

        global.typescriptConfig = function () {
            return {
                /// <field name="removeComments" type="Boolean" />
                removeComments: true,
                /// <field name="noImplicitAny" type="Boolean" />
                noImplicitAny: true,
                /// <field name="noLib" type="Boolean" />
                noLib: true,
                /// <field name="target" type="String" />
                target: "",
                /// <field name="module" type="String" />
                module: "",
                /// <field name="sourceRoot" type="String" />
                sourceRoot: "",
                /// <field name="declarationFiles" type="Boolean" />
                declarationFiles: true,
                /// <field name="noExternalResolve" type="Boolean" />
                noExternalResolve: true,
                /// <field name="sortOutput" type="Boolean" />
                sortOutput: true
            };
        };

        /**
         * Creates a TypeScript project.
         * @param {typescriptConfig} [options] A configuration object for TypeScript.
         * @param {object} [filterSettings] A filter object for TypeScript.
         * @param {function} [reporter] Specify a reporter for TypeScript.
         */
        var fn = function () {
            return {
                _$append: true,
                dts: new Stream().Readable(),
                js: new Stream().Readable()
            };
        };

        /**
         * Creates a TypeScript project.
         * @param {typescriptConfig} [options] A configuration object for TypeScript.
         */
        fn.createProject = function () { };

        /**
         * Adds a filter to the TypeScript compiler.
         * @param {Object} [options] A filter object for TypeScript.
         */
        fn.filter = function () {

        };

        fn.reporter = {
            voidReporter: function () { },
            defaultReporter: function () { },
            fullReporter: function () { }
        };

        return fn;
    };

    modules["gulp-uglify"] = function () {

        global.uglifyConfig = function () {
            return {
                /// <field name="mangle" type="Boolean" />
                mangle: true,
                /// <field name="output" type="Boolean or Object" />
                output: {},
                /// <field name="compress" type="Boolean or Object" />
                compress: true,
                /// <field name=" preserveComments" type="String" />
                preserveComments: "",
                /// <field name=" outSourceMap" type="Boolean" />
                outSourceMap: ""
            };
        };

        /**
         * Uglifies JavaScript files
         * @param {uglifyConfig} [options] A configuration object for uglify.
         */
        return function () { };
    };

    modules["glob-watcher"] = function () {
        /**
         * Watch files and do something when a file changes. This always returns an EventEmitter that emits change events.
         * @param {String} glob A single glob or array of globs that indicate which files to watch for changes.
         * @param {Object} [options] Optional configuration object, that are passed to "gaze".
         * @param {Array} tasks Names of task(s) to run when a file changes, added with "gulp.task()".
         */
        function fn() {
            return {
                end: function () { },
                add: function () { },
                remove: function () { },

                /**
                 * Hook into events.
                 * @param {String} event The name of the event, such as "data", "error" etc.
                 * @param {Function} callback The callback function to execute when the event fires.
                 */
                on: function () { }
            };
        }

        return fn;
    };

    modules["vinyl-fs"] = function () {
        var dependencies = {
            watcher: modules["glob-watcher"]()
        };

        return {
            /**
            * Emits files matching provided glob or an array of globs. Returns a stream of Vinyl files that can be piped to plugins.
            * @param {String} glob Glob or array of globs to read.
            * @param {Object} [options] Options to pass to node-glob through glob-stream.
            */
            src: function () { return new Stream().Readable(); },

            /**
             * @param {String} outFolder The path (output folder) to write files to.
             * @param {Object} [options] A configuration object.
             */
            dest: function () { return new Stream().Readable(); },

            watch: dependencies.watcher
        };
    };

    modules["stream"] = function () {
        return new Stream();
    };

    // Helper function that merges two objects
    function merge(obj1, obj2) {
        for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
        return obj1;
    }

    intellisense.addEventListener('statementcompletion', function (event) {
        event.items = event.items.filter(function (item) {
            return item.name.indexOf("Config") === -1 || (item.name.length - item.name.indexOf("Config")) !== "Config".length;
        });
    });

    // Set global properties to make them visible in Intellisense inside gulpfile.js.
    global.require = require;

})(this);