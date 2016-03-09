const fs = require("fs");
const process = require("process");
const path = require("path");
const tmlogs = require("./tmlogs");

function readConfigFile(filename, callback){
    fs.readFile("conf.json", (err, data) => {
        if (err) throw err;
        var conf = JSON.parse(data);
        for (var i = 0; i < conf.length; i++){
            if (conf[i].umask != undefined)
                conf[i].umask = parseInt(conf[i].umask, 8);
        }
        parseCmd(conf);
        callback(conf);
    });
}
module.exports.readConfigFile = readConfigFile;

function parseCmd(conf){
    for (var i = 0; i < conf.length; i++){
        conf[i].cmd = conf[i].cmd.split(" ");
        if (conf[i].cmd[0].charAt(0) != "/" && conf[i].cmd[0].charAt(0) != ".")
            conf[i].cmd[0] = findPath(conf[i].cmd[0]);
    }
}

function findPath(cmd) {
    var pathF = process.env.PATH.split(":");
    for (var i = 0; i < pathF.length; i++) {
        if (fs.readdirSync(pathF[i]).indexOf(cmd) > -1)
            return (path.join(pathF[i], cmd));
    }
    return (cmd);
}