const m_salelists = require('../../../db_models/dsp/sales/m_salelists');
const success = "Success!";
const nullibles = ["undefined", "null"];
module.exports = class saleWorker {
    async getSearchSalelistMinMaxIds(query, body, callback){
        const {companyId} = query;
        let {dispenseType, useAccount, sort, keyword, match} = body;
        try{
            if(match) match = {...match, companyId, useAccount};
            else match = {companyId, useAccount};
            const result = {
                minId : await m_salelists.getSearchSalelistMinMaxIds(
                    match,dispenseType, keyword, sort, null, match
                ),
                maxId : await m_salelists.getSearchSalelistMinMaxIds(
                    match, dispenseType, keyword, sort, true, match
                )
            }
            callback({getSearchSalelistMinMaxIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getSearchSalelistMinMaxIds : false, message});
        }
    }
    async searchSalelists(query, body, callback){
        const {companyId} = query;
        let {dispenseType, useAccount, keyword, rows, skip, sort, max, match} = body;
        try{
            if(match) match = {...match, companyId, useAccount};
            else match = {companyId, useAccount};
            const result = await m_salelists.searchSalelists
                (match, dispenseType, keyword, rows, skip, sort, max);
            callback({searchSalelists : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({searchSalelists : false, message});
        }
    }
    async getSalelistMinMaxIds(query, body, callback){
        const {companyId} = query;
        let {dispenseType, useAccount, sort, match} = body;
        try{
            if(match) match = {...match, companyId, useAccount};
            else match = {companyId, useAccount};
            const result = {
                minId : await m_salelists.getSalelistMinMaxIds(
                    match, dispenseType, sort),
                maxId : await m_salelists.getSalelistMinMaxIds(
                    match, dispenseType, sort, true),
            }
            callback({getSalelistMinMaxIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getSalelistMinMaxIds : false, message});
        }
    }
    async getSalelists(query, body, callback){
        const {companyId} = query;
        let {dispenseType, useAccount, rows, skip, sort, max, match} = body;
        try{
            if(match) match = {...match, companyId, useAccount};
            else match = {companyId, useAccount};
            const result = await m_salelists.getSalelists(
                match, dispenseType, rows, skip, sort, max
            );
            callback({getSalelists : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getSalelists : false, message});
        }
    }
}