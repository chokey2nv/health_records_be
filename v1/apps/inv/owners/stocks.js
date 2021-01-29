const _stockWorker = require('../worker/stocks');

const stockWorker = new _stockWorker();
module.exports = function(req, res){
    const {action} = req.params;
    console.log("ACTION", action);
    switch(action){
        case "getLastStockForCostPriceByProductIds" : 
            return stockWorker.getLastStockForCostPriceByProductIds(req.query, req.body, result=>res.send(result));

            
        case "getSearchTransferListMinMaxId" : 
            return stockWorker.getSearchTransferListMinMaxId(req.query, result=>res.send(result));
        case "searchTransferList" : 
            return stockWorker.searchTransferList(req.query, req.body, result=>res.send(result));
        case "getStockTransferListMinMaxId" : 
            return stockWorker.getStockTransferListMinMaxId(req.query, result=>res.send(result));
        case "getStockTransferList" : 
            return stockWorker.getStockTransferList(req.query, req.body, result=>res.send(result));
        case "transferStocks" : 
            return stockWorker.transferStocks(req.query, req.body, result=>res.send(result));
        case "editStore" : 
            return stockWorker.editStore(req.query, req.body, result=>res.send(result));
        case "deleteStore" :
            return stockWorker.deleteStore(req.query, result=>res.send(result));
        case "getStores" : 
            return stockWorker.getStores(req.query, result=>res.send(result));
        case "createStore" : 
            return stockWorker.createStore(req.query, req.body, result=>res.send(result));

        case "getStockHistories" : 
            return stockWorker.getStockHistories(req.query, req.body, result=>res.send(result));
        case "getStockHistoryMinMaxId" : 
            return stockWorker.getStockHistoryMinMaxId(req.query, result=>res.send(result));
        case "searchStockHistories" : 
            return stockWorker.searchStockHistories(req.query, req.body, result=>res.send(result));
        case "getStockHistorySearchMinMaxId" : 
            return stockWorker.getStockHistorySearchMinMaxId(req.query, result=>res.send(result));
        case "getStocksByProductIds" : 
            return stockWorker.getStocksByProductIds(req.query, req.body, result=>res.send(result));
        case "createStock" : 
            return stockWorker.createStock(req.query, req.body, result=>res.send(result));
    }
}