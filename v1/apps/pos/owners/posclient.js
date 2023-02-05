const _posWorker = require('../workers/posclient');
const _dspSettingWorker = require("../../dsp/workers/settings");
const dspSettingWorker = new _dspSettingWorker();
const posWorker = new _posWorker();
module.exports = function(req, res){
    const {action} = req.params;
    console.log("ACTION === ", action);
    switch(action){

        case "getProductsByIds" : 
            return posWorker.getProductsByIds(req.query, req.body, result=>res.send(result));

        case "dispensePaidSell" : 
            return posWorker.dispensePaidSell(req.query, req.body, result=>res.send(result));
        case "createSale" : 
            return posWorker.createSale(req.query, req.body, result=>res.send(result));
        case "getSettings" : 
            return dspSettingWorker.getSettings(req.query, result=>res.send(result));
        case "getPricesByProductIds" : 
            return posWorker.getPricesByProductIds(req.query, req.body, result=>res.send(result));
        case "getProductPackages" : 
            return posWorker.getProductPackages(req.query, result=>res.send(result));
        case "getStockProductMinMaxId" :
            return posWorker.getStockProductMinMaxId(req.query, result =>res.send(result));
        case "getStockProductSearchMinMaxId" :
            return posWorker.getStockProductSearchMinMaxId(req.query, result =>res.send(result));
        case "searchStockProducts" :
            return posWorker.searchStockProducts(req.query, req.body, result =>res.send(result));
        case "getStockProducts" :
            return posWorker.getStockProducts(req.query, req.body, result =>res.send(result));
    }
}