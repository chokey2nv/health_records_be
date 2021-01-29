const _pharm = require('../worker/pharm');
const pharmWorker = new _pharm();
module.exports = function(req, res){
    const {action} = req.params;
    console.log("ACTION === ", action);
    switch(action){
        case "deleteDrugBrand" :
            return pharmWorker.deleteDrugBrand(req.query, result=>res.send(result));
        case "updateDrugBrand" : 
            return pharmWorker.updateDrugBrand(req.query, req.body, result=>res.send(result));
        case "getDrugBrandById" : 
            return pharmWorker.getDrugBrandById(req.query, result=>res.send(result));
        case "getDrugBrandMinMaxId" : 
            return pharmWorker.getDrugBrandMinMaxId(req.query, result=>res.send(result));
        case "getDrugBrands" : 
            return pharmWorker.getDrugBrands(req.query, req.body, result=>res.send(result));
        case "createDrugBrand" :
            return pharmWorker.createDrugBrand(req.query, req.body, result=>res.send(result));
        case "getDrugMinMaxIds" : 
            return pharmWorker.getDrugMinMaxIds(req.query, result=>res.send(result));
        case "getDrugs" : 
            return pharmWorker.getDrugs(req.query, req.body, result=>res.send(result));
        case "createDrug" : 
            return pharmWorker.createDrug(req.query, req.body, result=>res.send(result));
        case "searchDrugNameProperty" : 
            return pharmWorker.searchDrugNameProperty(req.query, result=>res.send(result));
    }
}