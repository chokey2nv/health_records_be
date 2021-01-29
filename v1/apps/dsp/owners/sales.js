const _saleWorker = require('../workers/sales');
const saleWorker = new _saleWorker();
module.exports = function(req, res){
    const {action} = req.params;
    console.log("ACTION === ", action);
    switch(action){
        case "getSearchSalelistMinMaxIds" : 
            return saleWorker.getSearchSalelistMinMaxIds(req.query, req.body, result=>res.send(result));
        case "searchSalelists" : 
            return saleWorker.searchSalelists(req.query, req.body, result=>res.send(result));
        case "getSalelistMinMaxIds" : 
            return saleWorker.getSalelistMinMaxIds(req.query, req.body, result=>res.send(result));
        case "getSalelists" : 
            return saleWorker.getSalelists(req.query, req.body, result=>res.send(result));
    }
}