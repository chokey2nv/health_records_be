const _pricelist = require('../worker/pricelist');
const priceWorker = new _pricelist();
module.exports = function(req, res){
    const {action} = req.params;
    console.log("PRICE ACTION", action);
    switch(action){
        case "editProductPrices" : 
            return priceWorker.editProductPrices(req.query, req.body, result=>res.send(result));
        case "createPricelist" : 
            return priceWorker.createPricelist(req.query, req.body, result=>res.send(result));
        case "getSearchPricelistMinMaxIds" : 
            return priceWorker.getSearchPricelistMinMaxIds(req.query, result=>res.send(result));
        case "searchPricelists" : 
            return priceWorker.searchPricelists(req.query, req.body, result=>res.send(result));
        case "getPricelistMinMaxIds" : 
            return priceWorker.getPricelistMinMaxIds(req.query, result=>res.send(result));
        case "getPricelists" : 
            return priceWorker.getPricelists(req.query, req.body, result=>res.send(result));
        case "getPricesByProductIds" : 
            return priceWorker.getPricesByProductIds(req.query, req.body, result=>res.send(result));
    }
}