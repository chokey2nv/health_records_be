const m_stocks = require('../../../db_models/m_inv_stocks');
const m_stocklists = require('../../../db_models/m_inv_stocklists');
const m_pricelists = require("../../../db_models/inv/pricelist/m_inv_pricelists");
const m_stores = require("../../../db_models/m_inv_stores");
const m_prices = require("../../../db_models/inv/pricelist/m_inv_prices");
const m_transfer = require("../../../db_models/m_inv_stock_transfer");
const m_transferlist = require("../../../db_models/m_inv_stock_transferlist");
const success = "Success!";

module.exports = class stocks {
    async getLastStockForCostPriceByProductIds(query, body, callback){
        const {productIds} = body;
        try{
            const result = await m_stocks.getLastStocksByUniqueProductIds(productIds);
            callback({getLastStockForCostPriceByProductIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getLastStockForCostPriceByProductIds :false, message});
        }
    }
    async getSearchTransferListMinMaxId(query, callback){
        const {companyId, keyword, storeId, sort} = query;
        if(["undefined", "null"].indexOf(sort) !== -1) sort = null;
        try{
            const result = {
                minId : await m_transferlist.getSearchTransferListMinMaxId(companyId, storeId, keyword, sort, null),
                maxId : await m_transferlist.getSearchTransferListMinMaxId(companyId, storeId, keyword, sort, true),
            }
            callback({getSearchTransferListMinMaxId : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getSearchTransferListMinMaxId : false, message});
        }
    }
    async searchTransferList(query, body, callback){
        const {companyId} = query;
        const {storeId, keyword, rows, skip, sort, max} = body;
        try{
            const result = await m_transferlist.searchTransferList(
                companyId, storeId, keyword, rows, skip, sort, max
            );
            callback({searchTransferList : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({searchTransferList : false, message});
        }
    }
    async getStockTransferListMinMaxId(query, callback){
        const {companyId, storeId, sort} = query;
        if(["undefined", "null"].indexOf(sort) !== -1) sort = null;
        try{
            const result = {
                minId : await m_transferlist.getStockTransferListMinMaxId(companyId, storeId, sort, null),
                maxId : await m_transferlist.getStockTransferListMinMaxId(companyId, storeId, sort, true)
            }
            callback({getStockTransferListMinMaxId : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getStockTransferListMinMaxId : false, message});
        }
    }
    async getStockTransferList(query, body, callback){
        const {companyId} = query;
        const {storeId, rows, skip, sort, max} = body;
        try{
            const result = await m_transferlist.getStockTransferList(
                companyId, storeId, rows, skip, sort, max
            );
            callback({getStockTransferList : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getStockTransferList : false, message});
        }
    }
    async transferStocks(query, body, callback){
        const {companyId} = query;
        try{
            const stocks = body.list.map(item=>({
                ...item, companyId, 
                actionDate : new Date(body.date)}));
            const addedStocks = await m_transfer.transferStocks(stocks);
            body.actionDate = new Date(body.date);
            delete body.list;
            delete body.date;
            if(addedStocks)
                body.stockIds = addedStocks.map(item=>item._id);
            const result = await m_transferlist.createTransferlist(companyId, body);
            callback({transferStocks : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({transferStocks : false, message});
        }
    }
    async editStore(query, body, callback){
        const {storeId, data} = body;
        try{
            const store = data.name ? await m_stores.getAStoreByName(data.name) : null;
            if(store && store._id != storeId)
                throw("Store name already exists");
            const result = await m_stores.editStore(storeId, data);
            callback({editStore : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({editStore : false, message});
        }
    }
    async deleteStore(query, callback) {
        const {storeId} = query;
        try{
            const result = await m_stores.deleteStore(storeId);
            callback({deleteStore : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deleteStore : false, message});
        }
    }
    async getStores(query, callback) {
        const {companyId} = query;
        try{
            const result = await m_stores.getStores(companyId);
            callback({getStores : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getStores : false, message});
        }
    }
    async createStore(query, body, callback) {
        const {companyId} = query;
        try{
            if(await m_stores.getAStoreByName(body.name))
                throw("Store name already exists");
            const result = await m_stores.createStore(companyId, body);
            callback({createStore : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createStore : false, message});
        }
    }


    async getStockHistories(query, body, callback){
        const {companyId} = query;
        const {rows, skip, sort, max} = body;
        try{
            const result = await m_stocklists.getStockLists(companyId, rows, skip, sort, max);
            callback({getStockHistories :true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getStockHistories : false, message});
        }
    }
    async getStockHistoryMinMaxId(query, callback){
        let {companyId, sort} = query;
        if(sort === "undefined" || sort === "null") sort = null
        try{
            const minId = await m_stocklists.getStockHistoryMinMaxId(companyId, null, sort);
            const maxId = await m_stocklists.getStockHistoryMinMaxId(companyId, true, sort);
            callback({getStockHistoryMinMaxId : true, result : {minId, maxId}, message : success});
        }catch(message){
            console.error(message);
            callback({getStockHistoryMinMaxId : false, message});
        }
    }
    async searchStockHistories(query, body, callback){
        const {rows, skip, sort, max} = body;
    }
    async getStockHistorySearchMinMaxId(query, callback){

    }
    async getStocksByProductIds(query, body, callback) {
        const {productIds, storeId} = body;
        try{
            let result = await m_stocks.getStocksByProductIds(productIds, storeId) || [];
            if(storeId !== "all"){
                const transfers = await m_transfer.getStocksByProductIds(productIds, storeId) || [];
                const stockOut = [];
                for (let i = 0; i < transfers.length; i++) {
                    const transfer = transfers[i];
                    const {fromStoreId} = transfer._id;
                    if(fromStoreId === storeId){
                        stockOut.push(transfers.splice(i, 1)[0]);
                    }
                }
                for (let i = 0; i < stockOut.length; i++) {
                    const stock = stockOut[i];
                    const {productId} = stock._id;
                    const index = transfers.findIndex(item=>item._id.productId === productId);
                    if(index !== -1){
                        transfers[index].stock -= stock.stock;
                        const remainder = transfers[index].stock;
                        if(remainder > -1) stockOut.splice(i, 1);
                        else {
                            transfers.splice(index, 1);
                            const index = result.findIndex(item=>item._id.productId === productId);
                            if(index !== -1){
                                result[index].stock += remainder;
                            }
                        }
                    }else{
                        const index = result.findIndex(item=>item._id.productId === productId);
                        if(index !== -1){
                            result[index].stock -= stock.stock;
                        }
                    }
                    
                }
                result = [...result, ...transfers];
            }
            callback({getStocksByProductIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getStocksByProductIds :false, message});
        }
    }
    async createStock(query, body, callback){
        const {stockPrices, stockList} = body;
        const {companyId} = query;
        try{
            const actionDate = new Date(stockList.date);
            delete stockList.date;
            stockList.actionDate = actionDate;
            stockList.list = stockList.list.map(item=>({...item, companyId, actionDate}));
            const addedStocks = await m_stocks.createStocks(stockList.list);
            delete stockList.list;
            stockList.stockIds = addedStocks.map(item=>item._id);
            const addedStocklist = await m_stocklists.createStocklist(companyId, stockList);
            const addedPrices = await m_prices.createPrices(companyId, stockPrices);
            const addedPricelist = await m_pricelists.createPricelist(
                companyId, {
                    actionDate, list : addedPrices && addedPrices.map(item=>item._id), 
                    stocklistId : addedStocklist._id,
                }
            );
            const result = {
                stockIds : stockList.stockIds, addedPricelist, addedStocklist
            };
            callback({createStock : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createStock : false, message});
        }
    }
}