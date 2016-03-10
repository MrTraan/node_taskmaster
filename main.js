const process = require("process");
const readline = require('readline');
const tmparser = require("./parsing");
const tmproc = require("./tmproc");
const rl = readline.createInterface(process.stdin, process.stdout, completer);

function completer(line) {
  var completions = 'status start exit stop restart'.split(' ')
  var hits = completions.filter((c) => { return c.indexOf(line) == 0 })
  // show all completions if none found
  return [hits , line]
}

var holder = [];

tmparser.readConfigFile("conf.json", (config) => {
    config.forEach((entry) =>{
        holder.push(new tmproc.Process(entry));
    });
    rl.prompt();
});

//rl.setPrompt('tm> ');

rl.on("line", (line) => {
    var av = line.trim().split(" ");
    switch(av[0]) {
        case "exit":
            console.log("Have a great day!");
            process.exit(0);
            break;
        case "status":
            if (av.length == 1) {
                holder.forEach((job) => {
                    console.log(job.status());
                });
            } else {
                job = getJobByName(av[1]);
                if (job === undefined) {
                    console.log("there is no task called " + av[1]);
                } else {
                    console.log(job.status());
                }
            }
            break;
        case "stop":
            if (av.length == 1) {
                holder.forEach((job) => {
                    job.stop();
                });
            } else {
                job = getJobByName(av[1]);
                if (job === undefined) {
                    console.log("there is no task called " + av[1]);
                } else {
                    job.stop();
                }
            }
            break;
        case "start":
            if (av.length == 1) {
                holder.forEach((job) => {
                    job.start();
                });
            } else {
                job = getJobByName(av[1]);
                if (job === undefined) {
                    console.log("there is no task called " + av[1]);
                } else {
                    job.start();
                }
            }
            break;
        case "restart":
            if (av.length == 1) {
                holder.forEach((job) => {
                    job.restart();
                });
            } else {
                job = getJobByName(av[1]);
                if (job === undefined) {
                    console.log("there is no task called " + av[1]);
                } else {
                    job.restart();
                }
            }
            break;
        default:
            console.log('Say what? I might have heard `' + line.trim() + '`');
            break;
    }
    rl.prompt();
}).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
});

function getJobByName(name) {
    for (var i = 0; i < holder.length; i++) {
        if (holder[i].name == name) {
            return (holder[i]);
        }
    }
    return (undefined);
}