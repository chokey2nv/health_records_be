const _productWorker = require('../worker/product');

const productWorker = new _productWorker();
module.exports = function(req, res){
    const {action} = req.params;
    console.log("ACTION", action);
    switch(action){
        case "deleteMultipleBrand" : 
            return productWorker.deleteMultipleBrand(req.query, req.body, result=>res.send(result));
        case "deleteBrand" : 
            return productWorker.deleteBrand(req.query, result=>res.send(result));
        case "getABrand" :
            return productWorker.getABrand(req.query, result=>res.send(result));
        case "getBrandMinMaxId" : 
            return productWorker.getBrandMinMaxId(req.query, result=>res.send(result));
        case "getBrandSearchMinMaxId" :
            return productWorker.getBrandSearchMinMaxId(req.query, result=>res.send(result));
        case "editBrand" :
            return productWorker.editBrand(req.query, req.body, result=>res.send(result));
        case "searchBrand" : 
            return productWorker.searchBrand(req.query, req.body, result=>res.send(result));
        case "getBrands" : 
            return productWorker.getBrands(req.query, req.body, result=>res.send(result));
        case "createBrand" : 
            return productWorker.createBrand(req.query, req.body, result=>res.send(result));
        




        case "getProductPackagingByIds" :
            return productWorker.getProductPackagingByIds(req.query, req.body, result=>res.send(result));
        case "getAProductPackaging" : 
            return productWorker.getAProductPackaging(req.query, result=>res.send(result));

        case "getProductsByIds" : 
            return productWorker.getProductsByIds(req.query, req.body, result=>res.send(result));
        case "getAProduct" : 
            return productWorker.getAProduct(req.query, result=>res.send(result));
        case "editProduct" : 
            return productWorker.editProduct(req.query, req.body, result=>res.send(result));
        case "updateMutipleProductsInventory" : 
            return productWorker.updateMutipleProductsInventory(req.query, req.body, result=>res.send(result));
        case "deleteMultipleProducts" : 
            return productWorker.deleteMultipleProducts(req.query, req.body, result=>res.send(result));
        case "deleteProduct" : 
            return productWorker.deleteProduct(req.query, result=>res.send(result));

        case "getStockProductByCategoryIdSearchMinMaxId" :
            return productWorker.getStockProductByCategoryIdSearchMinMaxId(req.query, result=>res.send(result));
        case "searchStockProductsByCategoryId" : 
            return productWorker.searchStockProductsByCategoryId(req.query, res.body, result=>res.send(result));
        case "getStockProductByCategoryIdMinMaxId" :
            return productWorker.getStockProductByCategoryIdMinMaxId(req.query, result=>res.send(result));
        case "getStockProductsByCategory" : 
            return productWorker.getStockProductsByCategory(req.query, req.body, result=>res.send(result));
        case "getStockProductCategories" : 
            return productWorker.getStockProductCategories(req.query, result=>res.send(result));
        case "getStockProductSearchMinMaxId" :
            return productWorker.getStockProductSearchMinMaxId(req.query, result=>res.send(result));
        case "searchStockProducts" : 
            return productWorker.searchStockProducts(req.query, res.body, result=>res.send(result));
        case "getStockProductMinMaxId" :
            return productWorker.getStockProductMinMaxId(req.query, result=>res.send(result));
        case "getStockProducts" : 
            return productWorker.getStockProducts(req.query, req.body, result=>res.send(result));
        case "getProductSearchMinMaxId" : 
            return productWorker.getProductSearchMinMaxId(req.query, result=>res.send(result));
        case "getProductMinMaxIds" : 
            return productWorker.getProductMinMaxIds(req.query, result=>res.send(result));
        case "searchProduct" : 
            return productWorker.searchProduct(req.query, req.body, result=>res.send(result));
        case "getProducts" : 
            return productWorker.getProducts(req.query, result=>res.send(result));
        case "createProduct" :
            return productWorker.createProduct(req.query, req.body, result=>res.send(result));


        case "updateDrugName" : 
            return productWorker.updateDrugName(req.query, req.body, result => res.send(result));
        case "deleteDrugName" : 
            return productWorker.deleteDrugName(req.query, result=>res.send(result));
        case "createDrugName" : 
            return productWorker.createDrugName(req.query, req.body, result=>res.send(result));
        case "getDrugNames" : 
            return productWorker.getDrugNames(req.query, result=>res.send(result));
        case "updateProductForm" : 
            return productWorker.updateProductForm(req.query, req.body, result => res.send(result));
        case "deleteProductForm" : 
            return productWorker.deleteProductForm(req.query, result=>res.send(result));
        case "createProductForm" : 
            return productWorker.createProductForm(req.query, req.body, result=>res.send(result));
        case "getProductForms" : 
            return productWorker.getProductForms(req.query, result=>res.send(result));
        case "updateProductCat" : 
            return productWorker.updateProductCat(req.query, req.body, result => res.send(result));
        case "deleteProductCat" : 
            return productWorker.deleteProductCat(req.query, result=>res.send(result));
        case "createProductCat" : 
            return productWorker.createProductCat(req.query, req.body, result=>res.send(result));
        case "getProductCats" : 
            return productWorker.getProductCats(req.query, result=>res.send(result));
        case "updateProductTag" : 
            return productWorker.updateProductTag(req.query, req.body, result => res.send(result));
        case "deleteProductTag" : 
            return productWorker.deleteProductTag(req.query, result=>res.send(result));
        case "createProductTag" : 
            return productWorker.createProductTag(req.query, req.body, result=>res.send(result));
        case "getProductTags" : 
            return productWorker.getProductTags(req.query, result=>res.send(result));
        case "deleteProductPackaging" : 
            return productWorker.deleteProductPackaging(req.query, result=>res.send(result));
        case "editPackaging":
            return productWorker.editPackaging(req.query, req.body, result=>res.send(result));
        case "getProductPackagings" : 
            return productWorker.getProductPackagings(req.query, result=>res.send(result));
        case "createProductPackaging" : 
            return productWorker.createProductPackaging(req.query, req.body, result=>res.send(result));
        
        case "getProductPackagesByIds" :
            return productWorker.getProductPackagesByIds(req.query, req.body, result => res.send(result));
        case "editProductPackage" :
            return productWorker.editProductPackage(req.query, req.body, result=>res.send(result));
        case "addProductPackage" : 
            return productWorker.addProductPackage(req.query, req.body, result=>res.send(result));
        case "getProductPackages" : 
            return productWorker.getProductPackages(req.query, result => res.send(result));
        case "deleteProductPackage" :
            return productWorker.deleteProductPackage(req.query, result=>res.send(result));

        case "createProductDescription" : 
            return productWorker.createProductDescription(req.query, req.body, result=>res.send(result));
        case "getProductDescriptions" : 
            return productWorker.getProductDescriptions(req.query, result=>res.send(result));
    }
}