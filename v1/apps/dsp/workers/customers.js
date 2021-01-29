const m_patients = require('../../../db_models/m_patients');
const success = "Success!";
const nullibles = ["undefined", "null"];
module.exports = class settingWorker {
    async getCustomers(query, body, callback){
        const {companyId} = query;
        const{rows, skip, sort, max} = body;
        try{
            const result = await m_patients.getPatients(rows, skip, sort, max);
            callback({getCustomers : true, result, message: success});
        }catch(message){
            console.error(message);
            callback({getCustomers : false, message});
        }
    }
    async getCustomerMinMaxIds(query, callback){
        let {sort} = query;
        if(nullibles.indexOf(sort) !== -1) sort = null;
        try{
            const result = {
                maxId : await m_patients.getMaxId(sort),
                minId : await m_patients.getMinId(sort)
            }
            callback({getCustomerMinMaxIds : true, result, message: success});
        }catch(message){
            console.error(message);
            callback({getCustomerMinMaxIds : false, message});
        }
    }
    async searchCustomers(query, body, callback){
        const {companyId} = query;
        const{keyword, rows, skip, sort, max} = body;
        try{
            const result = await m_patients.searchPatient(keyword, rows, skip, sort, max);
            callback({searchCustomers : true, result, message: success});
        }catch(message){
            console.error(message);
            callback({searchCustomers : false, message});
        }
    }
    async getSearchCustomerMinMaxIds(query, callback){
        let {keyword, sort} = query;
        if(nullibles.indexOf(sort) !== -1) sort = null;
        try{
            const result = {
                maxId : await m_patients.getSearchMinMaxPatientId(keyword, "max", sort),
                minId : await m_patients.getSearchMinMaxPatientId(keyword, "min", sort)
            }
            callback({getSearchCustomerMinMaxIds : true, result, message: success});
        }catch(message){
            console.error(message);
            callback({getSearchCustomerMinMaxIds : false, message});
        }
    }
}