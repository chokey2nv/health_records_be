const _settingWorker = require('../workers/settings');
const settingWorker = new _settingWorker();
module.exports = function(req, res){
    const {action} = req.params;
    console.log("ACTION === ", action);
    switch(action){
        case "saveSettings" : 
            return settingWorker.saveSettings(req.query, req.body, result=>res.send(result));
        case "getSettingsByNames" :
            return settingWorker.getSettingsByNames(req.query, req.body, result=>res.send(result));
        case "getSettings" :
            return settingWorker.getSettings(req.query, result=>res.send(result));
    }
}