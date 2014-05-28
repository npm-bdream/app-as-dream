var fs = require('fs-extra'),
    path = require('path'),
    exec = require('child_process').exec,
    util = require('util');

function convertApp() {
    var appExecCnt = 0;
    var appExec = function (commandLineArr) {
        appExecCnt = 0;

        for (var cmdElem in commandLineArr){
            var commandLine = commandLineArr[cmdElem];
            exec(commandLine,
                function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    //console.log('stderr: ' + stderr);
                    appExecCnt++;
                    if(appExecCnt == commandLineArr.length) {

                        console.log("*** Success, global and devDependencie instaled");

                    }
                    if (error !== null) {

                        console.log('exec error: ' + error);

                    }

                });
        }
    };

    if(process.argv.length > 3) {

        var module_dir = path.join(path.dirname(fs.realpathSync(__filename)), '..');
        var project_dir = process.cwd();
        console.log("*** Module dir in : " + module_dir);

        var command_type = process.argv[2];


        if (command_type == "install") {

            var app_type = process.argv[3];

            if (app_type == "webapp") {

                fs.copy(module_dir + '/struct/js', '', function (err) {

                    if (err) {

                        console.error(err);

                    } else {

                        console.log("*** Success, new js tree created in : " + project_dir);

                        console.log("*** Start npm install from created package.json file in '.' this step can take few minutes");

                        var commandLineArr = [
                            'npm install'
                        ];

                        appExec(commandLineArr);

                    }
                });

            } else {
                console.error("!!! Error : Bad instalation type");
            }

        } else if ( command_type == "update" ) {
            var app_type = process.argv[3];

            if (app_type == "webapp") {
                appJsonUpdate();
            } else {
                console.error("!!! Error : Bad update type");
            }

        } else {

            console.error("!!! Error : bad command");

        }

    } else {

        console.error("Error : bad use of arguments");

    }
}
exports.convert = convertApp;