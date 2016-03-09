const process = require("process");
const readline = require('readline');
const tmparser = require("./parsing");
const tmproc = require("./tmproc");
const rl = readline.createInterface(process.stdin, process.stdout);

var holder = [];

tmparser.readConfigFile("conf.json", (config) => {
    config.forEach((entry) =>{
        holder.push(new tmproc.Process(entry));
    });
    rl.prompt();
})

//rl.setPrompt('tm> ');

rl.on("line", (line) => {
  switch(line.trim()) {
    case "status":
      showProcStatus();
      break;
    case "exit":
        console.log("Have a great day!");
        process.exit(0);
        break;
    case "stop":
        holder.forEach((job) => {
            job.stop();
        });
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

function showProcStatus() {
    holder.forEach((job) => {
        if (job.running)
            console.log("Task " + job.name + " is running");
        else
            console.log("Task " + job.name + " is stopped");
    })
}