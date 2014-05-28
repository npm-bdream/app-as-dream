var fs = require("fs-extra"),
    path = require("path"),
    download = require('download'),
    targz = require('tar.gz'),
    appconf = require(__dirname + '/' +'AppConf.js'),
    config = {};

config.dir = {
    "app"               : "./app",
    "libraries"         : "./libraries",
    "www"               : "./app/www",
    "build"             : "./_build",
    "release"           : "./_release",
    "server"            : "./_www",
    "watch"             : "./app",
    "targz_sources"     : "./_build/_sources",
    "targz_web"         : "./_www"
};

config.dir.appjs = config.dir.app+"/js";
config.dir.appcss = config.dir.app+"/css";

config.files = {
    "generated_app_js"              : config.dir.server + '/<%= grunt_config_name %>-app-<%= grunt_config_version %>.js',
    "generated_libraries_js"        : config.dir.server + '/<%= grunt_config_name %>-libraries-<%= grunt_config_version %>.js',
    "generated_app_css"             : config.dir.server + '/<%= grunt_config_name %>-app-<%= grunt_config_version %>.css',
    "generated_libraries_css"       : config.dir.server + '/<%= grunt_config_name %>-libraries-<%= grunt_config_version %>.css',
    "generated_min_app_js"          : config.dir.server + '/<%= grunt_config_name %>-app-<%= grunt_config_version %>.min.js',
    "generated_min_libraries_js"    : config.dir.server + '/<%= grunt_config_name %>-libraries-<%= grunt_config_version %>.min.js',
    "generated_min_app_css"         : config.dir.server + '/<%= grunt_config_name %>-app-<%= grunt_config_version %>.min.css',
    "generated_min_libraries_css"   : config.dir.server + '/<%= grunt_config_name %>-libraries-<%= grunt_config_version %>.min.css',
    "appasdream"                    : 'AppConf.js',
    "gruntfile"                     : 'Gruntfile.js',
    "package"                       : 'package.json',
    "server"                        : 'Server.js'
};

var appasdream = appconf,
    packageJSON = require(__dirname + '/' + config.files.package);

// If we don't have replacements
if (!appasdream.replacements) appasdream.replacements = [];

// Add reserved replacements
appasdream.replacements.push({ "from": "{app.name}", "to": packageJSON.name });
appasdream.replacements.push({ "from": "{app.version}", "to": packageJSON.version });
appasdream.replacements.push({ "from": "{app.author}", "to": packageJSON.author });
appasdream.replacements.push({ "from": "{app.date}", "to": "<%= grunt.template.today('dd/mm/yyyy') %>" });
appasdream.replacements.push({ "from": "{file.app.js}", "to": "<%= grunt_config_name %>-app-<%= grunt_config_version %>.js" });
appasdream.replacements.push({ "from": "{file.app.min.js}", "to": "<%= grunt_config_name %>-app-<%= grunt_config_version %>.min.js" });
appasdream.replacements.push({ "from": "{file.libraries.js}", "to": "<%= grunt_config_name %>-libraries-<%= grunt_config_version %>.js" });
appasdream.replacements.push({ "from": "{file.libraries.min.js}", "to": "<%= grunt_config_name %>-libraries-<%= grunt_config_version %>.min.js" });
appasdream.replacements.push({ "from": "{file.app.css}", "to": "<%= grunt_config_name %>-app-<%= grunt_config_version %>.css" });
appasdream.replacements.push({ "from": "{file.app.min.css}", "to": "<%= grunt_config_name %>-app-<%= grunt_config_version %>.min.css" });
appasdream.replacements.push({ "from": "{file.libraries.css}", "to": "<%= grunt_config_name %>-libraries-<%= grunt_config_version %>.css" });
appasdream.replacements.push({ "from": "{file.libraries.min.css}", "to": "<%= grunt_config_name %>-libraries-<%= grunt_config_version %>.min.css" });


// Create concat array for /app/js elements and /app/css elements
var appJsConcatArray = [];
if (appasdream.app.js) {
    for (var nbElem in appasdream.app.js) {
        var file = config.dir.appjs+appasdream.app.js[nbElem];
        appJsConcatArray.push(file);
    }
}
var appCssConcatArray = [];
if (appasdream.app.js) {
    for (var nbElem in appasdream.app.css) {
        var file = config.dir.appcss+appasdream.app.css[nbElem];
        appCssConcatArray.push(file);
    }
}



module.exports = function (grunt) {
    grunt.initConfig({
        generated_min_app_js: config.files.generated_min_app_js,
        generated_min_libraries_js: config.files.generated_min_libraries_js,
        generated_min_app_css: config.files.generated_min_app_css,
        generated_min_libraries_css: config.files.generated_min_libraries_css,
        clean: {
            clean_server: [config.dir.server],
            clean_build: [config.dir.build],
            clean_libraries: [config.dir.libraries]
        },
        concat: {
            js: {
                src: [appJsConcatArray],
                dest: config.files.generated_app_js
            },
            jsmodule: {
                src: [config.dir.libraries + '/**/*.js'],
                dest: config.files.generated_libraries_js
            },
            css: {
                src: [appCssConcatArray],
                dest: config.files.generated_app_css
            },
            cssmodule: {
                src: [config.dir.libraries + '/**/*.css'],
                dest: config.files.generated_libraries_css
            }
        },
        uglify: {
            app_js_min: {
                files: {
                    '<%= generated_min_app_js %>': [config.files.generated_app_js]
                }
            },
            app_module_min: {
                files: {
                    '<%= generated_min_libraries_js %>': [config.files.generated_libraries_js]
                }
            }
        },
        cssmin: {
            app_css_min: {
                files: {
                    '<%= generated_min_app_css %>': [config.files.generated_app_css]
                }
            },
            module_css_min: {
                files: {
                    '<%= generated_min_libraries_css %>': [config.files.generated_libraries_css]
                }
            }
        },
        copy: {
            copy_www_without_concat: {
                files: [
                    {expand: true, cwd: config.dir.www, src: ['**/**'], dest: config.dir.server}
                ]
            },
            release_copy_sources: {
                files: [
                    {expand: true, cwd: '.', src: [config.dir.app + '/**'], dest: config.dir.targz_sources},
                    {expand: true, cwd: '.', src: [config.files.appasdream], dest: config.dir.targz_sources},
                    {expand: true, cwd: '.', src: [config.files.gruntfile], dest: config.dir.targz_sources},
                    {expand: true, cwd: '.', src: [config.files.package], dest: config.dir.targz_sources},
                    {expand: true, cwd: '.', src: [config.files.server], dest: config.dir.targz_sources}
                ]
            }
        },
        htmlmin: {
            min_www_html: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                expand: true,
                cwd: config.dir.server,
                src: ['**/*.html'],
                dest: config.dir.server
            }
        },
        replace: {
            replace_in_release: {
                src: [config.dir.server + '/**/*.*'],
                overwrite: true,
                replacements: appasdream.replacements
            }
        },
        watch: {
            options: { spawn: false },
            files: [config.dir.watch + '/**/*',config.files.appasdream],
            tasks: ['default']
        }
    });

    grunt.config.set('grunt_config_version', packageJSON.version);
    grunt.config.set('grunt_config_name', packageJSON.name);

    /********************************************************************
     * Tasks
     ********************************************************************/

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['clean:clean_server', 'concat', 'uglify', 'cssmin', 'copy:copy_www_without_concat', 'htmlmin', 'replace', 'clean:clean_build']);
    grunt.registerTask('watch_task', ['watch']);


    grunt.registerTask('version', 'Update version.', function (arg1, arg2) {
        var done = this.async(); // tell Grunt this is an async task
        var target = arg1;
        var targetData = arg2;
        SyncVersion.start(target, targetData, done);
    });

    grunt.registerTask('release', 'Release code.', function () {

        var done = this.async(); // tell Grunt this is an async task
        SyncRelease.start(done);

    });

    grunt.registerTask('release_patch', ['version:patch:+', 'default', 'copy:release_copy_sources', 'release', 'clean:clean_build']);
    grunt.registerTask('release_minor', ['version:minor:+', 'default', 'copy:release_copy_sources', 'release', 'clean:clean_build']);
    grunt.registerTask('release_major', ['version:major:+', 'default', 'copy:release_copy_sources', 'release', 'clean:clean_build']);
    grunt.registerTask('release_overwrite', ['version:overwrite:+', 'default', 'copy:release_copy_sources', 'release', 'clean:clean_build']);

    grunt.registerTask('update_libraries', ['clean:clean_libraries','dlib']);

    grunt.registerTask('dlib', 'Download libraries', function () {

        var done = this.async(); // tell Grunt this is an async task

        function FormatNumberLength(num, length) {
            var r = "" + num;
            while (r.length < length) {
                r = "0" + r;
            }
            return r;
        }

        var countDl = 0;

        fs.mkdirs(config.dir.libraries, function(err){

            if (err) return console.error(err);

            grunt.log.ok("*** Success, create '"+config.dir.libraries+"'");
            if (appasdream.libraries && appasdream.libraries.length > 0) {
                downloadFiles();
            } else {
                grunt.log.error("No libraries configured in your "+config.files.appasdream+" file");
                done();
            }

        });

        var downloadFiles = function () {
            if (appasdream.libraries[countDl]) {

                var libDirName = FormatNumberLength(countDl, 5);
                var dl = download(appasdream.libraries[countDl], config.dir.libraries+'/'+libDirName);

                dl.on('close', function () {
                    grunt.log.ok("---- " + libDirName + ' --> ' + appasdream.libraries[countDl]);
                    countDl++;
                    if (appasdream.libraries[countDl]) {
                        downloadFiles();
                    } else {

                        done();
                        grunt.log.ok("*** Success, All libraries instaled from "+config.files.appasdream+" file");
                    }

                });

                dl.on('error', function (err) {
                    grunt.log.error("Error " + libDirName + ' --> ' + appasdream.libraries[countDl]);
                    grunt.log.error(err);
                    done(false);
                });

            }


        }

    });




    /********************************************************************
     * Version management
     ********************************************************************/

    function SyncVersion() {
    }

    SyncVersion.context = this;
    SyncVersion.file = config.files.package;
    SyncVersion.target;
    SyncVersion.targetData;
    SyncVersion.doneFunc;
    SyncVersion.version_current;
    SyncVersion.name_current;
    SyncVersion.version_new;
    SyncVersion.version_major;
    SyncVersion.version_minor;
    SyncVersion.version_patch;
    SyncVersion.new_package_json_obj;

    SyncVersion.start = function (target, targetData, doneFunc) {

        SyncVersion.target = target;
        SyncVersion.targetData = targetData;
        SyncVersion.doneFunc = doneFunc;


        var file = 'package.json';

        if ((target == 'patch' || target == 'minor' || target == 'major' || target == 'overwrite') &&
            ( targetData == '-' || targetData == '+' || SyncVersion.toolIsInt(targetData) || targetData == '')) {

            grunt.log.ok('TARGET[' + target + ']');
            grunt.log.ok('DATA[' + targetData + ']');

            SyncVersion.version_current = packageJSON.version;
            SyncVersion.name_current = packageJSON.name;
            grunt.log.ok("Current version : " + SyncVersion.version_current);
            SyncVersion.version_new = SyncVersion.toolNewVersion();
            grunt.config.set('grunt_config_version', SyncVersion.version_new);
            grunt.log.ok("New version : " + SyncVersion.version_new);
            packageJSON.version = SyncVersion.version_new;
            SyncVersion.new_package_json_obj = packageJSON;
            SyncVersion.writeJson();

        } else {

            grunt.log.error('TARGET[' + target + ']');
            grunt.log.error('DATA[' + targetData + ']');

            grunt.log.error('Error : Use TARGET[ minor | major | patch | overwrite ] and DATA[ "-" | "+" | "" | "{int}" ]');
            if (doneFunc) doneFunc(false);
        }
    };

    SyncVersion.writeJson = function () {
        fs.writeJson(SyncVersion.file, SyncVersion.new_package_json_obj, function (err) {

            if (err == null) {
                grunt.log.ok("package.json modified with new version.");
                if (SyncVersion.doneFunc) SyncVersion.doneFunc();
            } else {
                grunt.log.error("Error when modify package.json");
                grunt.log.error(err);
                if (SyncVersion.doneFunc) SyncVersion.doneFunc(false)
            }

        });
    };

    SyncVersion.toolUpdateInt = function (version_part_int) {
        var new_part_version;
        if (SyncVersion.targetData == '-') {
            if (version_part_int > 0) new_part_version = parseInt(version_part_int) - 1;
            else new_part_version = 0;
        } else if (SyncVersion.toolIsInt(SyncVersion.targetData) && SyncVersion.targetData != "") {
            new_part_version = targetData;
        } else {
            new_part_version = parseInt(version_part_int) + 1;
        }
        return new_part_version;
    };

    SyncVersion.toolNewVersion = function () {
        var splitedVersion = SyncVersion.version_current.split(".");
        SyncVersion.version_major = splitedVersion[0];
        SyncVersion.version_minor = splitedVersion[1];
        SyncVersion.version_patch = splitedVersion[2];
        var new_version;
        switch (SyncVersion.target) {
            case 'patch':
                new_version = SyncVersion.version_major + '.' + SyncVersion.version_minor + '.' + SyncVersion.toolUpdateInt(SyncVersion.version_patch, SyncVersion.targetData);
                break;
            case 'minor':
                new_version = SyncVersion.version_major + '.' + SyncVersion.toolUpdateInt(SyncVersion.version_minor, SyncVersion.targetData) + '.0';
                break;
            case 'major':
                new_version = SyncVersion.toolUpdateInt(SyncVersion.version_major, SyncVersion.targetData) + '.0.0';
                break;
            case 'overwrite':
                new_version = SyncVersion.version_current;
        }
        return new_version;
    };

    SyncVersion.toolIsInt = function (n) {
        return n % 1 === 0;
    };

    /********************************************************************
     * Release management
     ********************************************************************/

    function SyncRelease() {
    }

    SyncRelease.doneFunc;
    SyncRelease.start = function (doneFunc) {
        SyncRelease.doneFunc = doneFunc;
        SyncRelease.compressSources();
    };

    SyncRelease.compressSources = function () {
        var v = SyncVersion.version_new;
        var n = SyncVersion.name_current;
        var archiveDir = config.dir.release + '/' + v + '/';
        var archiveName = n + '-' + v + '-sources.tar.gz';
        var archiveFinal = archiveDir + archiveName;
        var compress = new targz().compress(config.dir.targz_sources, archiveFinal, function (err) {
            if (err) {
                grunt.log.error(err);
                if (SyncRelease.doneFunc) SyncRelease.doneFunc(false);
            } else {
                grunt.log.ok('Success create archive :' + archiveFinal);
                SyncRelease.compressWeb();
            }

        });
    };

    SyncRelease.compressWeb = function () {
        var v = SyncVersion.version_new;
        var n = SyncVersion.name_current;
        var archiveDir = config.dir.release + '/' + v + '/';
        var archiveName = n + '-' + v + '-web.tar.gz';
        var archiveFinal = archiveDir + archiveName;
        var compress = new targz().compress(config.dir.targz_web, archiveFinal, function (err) {
            if (err) {
                grunt.log.error(err);
                if (SyncRelease.doneFunc) SyncRelease.doneFunc(false);
            } else {
                grunt.log.ok('Success create archive :' + archiveFinal);
                if (SyncRelease.doneFunc) SyncRelease.doneFunc();
            }
        });
    };

};