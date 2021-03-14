const crontab = require('./crontab');
const nodeCron = require("node-cron");
const shell = require("shelljs");
module.exports = function(){
    if(crontab) for (let i = 0; i < crontab.length; i++) {
        const {schedule, command} = crontab[i];
        nodeCron.schedule(schedule, ()=>{
            shell.exec(command)
        })
    }
}