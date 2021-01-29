const m_settings = require('../../../db_models/m_settings');
const success = "Success!";
const nullibles = ["undefined", "null"];
module.exports = class settingWorker {
    async saveSettings(query, body, callback){
        const {companyId} = query;
        try{
            if(body) for (let i = 0; i < body.length; i++) {
                const setting = body[i];
                if(setting._id) await m_settings.editSettingValue(setting._id, null, setting.value);
                else {
                    setting.companyId = companyId
                    await m_settings.createSettings([setting]);
                }
            }
            const result = await m_settings._getSettings(companyId);
            callback({saveSettings :true, result, message : success});
        }catch(message){
            console.error(message);
            callback({saveSettings : false, message});
        }
    }
    async getSettingsByNames(query, body, callback){
        const {names} = body;
        console.log(names);
        try{
            const result = await m_settings.getSettingsByNames(names);
            callback({getSettingsByNames : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getSettingsByNames : true, message});
        }
    }
    async getSettings(query, callback){
        const {companyId} = query;
        try{
            let result = await m_settings._getSettings(companyId);
            if(!result || result.length === 0){
                result = await m_settings._createSettings(companyId, [
                    {
                        name : "useAccount", header : "Payment in account unit",
                        value : false
                    },{
                        name : "creditPayment", header : "Allow Credit Payment",
                        value : false,
                    },{
                        name : "paymentDescription", header : "Revenue description for payment",
                        value : "",
                    },{
                        name : "linkCustomer", header : "Link a Customer", 
                        value : false,
                    }
                ]);
            }
            callback({getSettings : true, result, message : success });
        }catch(message){
            console.error(message);
            callback({getSettings : false, message});
        }
    }
}