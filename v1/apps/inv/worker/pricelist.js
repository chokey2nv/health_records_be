const m_prices = require('../../../db_models/inv/pricelist/m_inv_prices');
const m_pricelist = require("../../../db_models/inv/pricelist/m_inv_pricelists");
const success = "Success!";
const nullibles = ["undefined", "null"];
module.exports = class pricelist{
    async editProductPrices(query, body, callback){
        const {companyId} = query;
        const {prices, newPrices} = body;
        try{
            const result ={
                newPrices : newPrices && await m_prices.createPrices(companyId, newPrices),
                modifiedPrices : 0
            }
            if(prices){
                for (let i = 0; i < prices.length; i++) {
                    const price = prices[i];
                    await m_prices.editProductPrices(price.priceId, price.price);
                    result.modifiedPrices++;
                }
            }
            callback({editProductPrices : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({editProductPrices : false, message});
        }
    }
    async createPricelist(query, body, callback){
        const {companyId} = query;
        try{
            if(body.startDate) body.startDate = new Date(body.startDate);
            if(body.endDate) body.endDate = new Date(body.endDate);
            const addedPrices = await m_prices.createPrices(companyId, body.list, body.startDate);
            if(addedPrices) body.list = addedPrices.map(item=>item._id);
            body.actionDate = new Date();
            const result = await m_pricelist.createPricelist(companyId, body);
            callback({createPricelist : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createPricelist : false, message});
        }
    }
    async getSearchPricelistMinMaxIds(query, callback){
        let {companyId, sort, keyword, event} = query;
        if(nullibles.indexOf(sort) !== -1) sort = null;
        if(nullibles.indexOf(event) !== -1) event = null;
        try{
            const result = {
                minId : await m_pricelist.getSearchPricelistMinMaxIds(companyId, keyword, sort),
                maxId : await m_pricelist.getSearchPricelistMinMaxIds(companyId, keyword, sort, true)
            }
            callback({getSearchPricelistMinMaxIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getSearchPricelistMinMaxIds : false, message});
        }
    }
    async searchPricelists(query, body, callback){
        const {companyId} = query;
        const {keyword, rows, skip, sort, max, event} = body;
        try{
            const result = await m_pricelist.searchPricelists(companyId, keyword, rows, skip, sort, max, event);
            callback({searchPricelists : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({searchPricelists : false, message});
        }
    }
    async getPricelistMinMaxIds(query, callback){
        let {companyId, sort, event} = query;
        if(nullibles.indexOf(sort) !== -1) sort = null;
        if(nullibles.indexOf(event) !== -1) event = null;
        try{
            const result = {
                minId : await m_pricelist.getPricelistMinMaxIds(companyId, sort, null, event),
                maxId : await m_pricelist.getPricelistMinMaxIds(companyId, sort, true, event)
            }
            callback({getPricelistMinMaxIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPricelistMinMaxIds : false, message});
        }
    }
    async getPricelists(query, body, callback){
        const {companyId} = query;
        const {rows, skip, sort, max, event} = body;
        try{
            const result = await m_pricelist.getPricelists(companyId, rows, skip, sort, max, event);
            callback({getPricelists : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPricelists : false, message});
        }
    }
    async getPricesByProductIds(query, body, callback){
        const {productIds} = body;
        try{
            const result = await m_prices.getPricesByProductIds(productIds);
            callback({getPricesByProductIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getPricesByProductIds : false, message});
        }
    }
}