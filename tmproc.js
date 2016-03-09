const tmlogs = require("./tmlogs");
const cp = require("child_process");
const fs = require("fs");
const process = require("process");

function Process(config){
    this.config = config;
    this.name = config.name;
    this.running = false;
    this.lastExitCode = 0;
    this.child = {};
    if (config.stdout != undefined){
        this.stdout = fs.createWriteStream(config.stdout, {flags: "a+"});
    }
    else {
        this.stdout = process.stdout;
    }
    if (config.stderr != undefined){
        this.stderr = fs.createWriteStream(config.stderr, {flags: "a+"});
    }
    else {
        this.stderr = process.stderr;
    }
    this.start = function() {
        if (config.cmd === undefined)
            return (undefined) //need to log error
        var child = cp.spawn(this.config.cmd[0], this.config.cmd.slice(1));
        tmlogs.logProcStart(this.name);
        this.running = true;
        this.child = child;
        
        child.stdout.on('data', (data) => {
            this.stdout.write(this.name + " stdout: " + data);
        });
        
        child.stderr.on('data', (data) => {
            this.stderr.write(this.name + " stderr: " + data);
        });
        child.on("close", (code) => {
            tmlogs.logProcStop(this.name, code);
            this.lastExitCode = code;
            this.running = false;
            if (this.config.autorestart == "always") {
                this.start();
            } else if (this.config.autorestart == "unexpected" && this.config.exitcodes != undefined && this.config.exitcodes.indexOf(code) == -1) {
                this.start();
            }
        });
        return (child);    
    }
    this.stop = function () {
        if (this.running == false || Object.keys(this.child).length == 0) {
            console.log(`Task ${this.name} is not running`);
            return;
        }
        if (this.config.stopsignal != undefined) {
            this.child.kill(this.config.stopsignal);
        } else {
            this.child.kill("SIGHUP");
        }
        this.running = false;
    }
    this.restart = function () {
        this.stop();
        this.start();
    }
    if (config.autostart == true)
        this.start();
}

module.exports.Process = Process;