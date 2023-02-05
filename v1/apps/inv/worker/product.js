const m_productDescription = require("../../../db_models/m_inv_productDescription");
const m_productPackages = require("../../../db_models/m_inv_productPackages");
const m_productPackagings = require("../../../db_models/m_inv_productPackagings");
const m_productTags = require("../../../db_models/m_inv_productTags");
const m_productCats = require("../../../db_models/m_inv_productCats");
const m_productForms = require("../../../db_models/m_inv_productForms");
const m_drugNames = require("../../../db_models/m_inv_drugNames");
const m_products = require("../../../db_models/m_inv_products");  
const m_brands = require("../../../db_models/m_inv_product_brands");
const m_drugs = require("../../../db_models/inv/pharm/m_inv_drugs");
const structure = require('../../../../Infrastructure/structure');
const success = "Success!";

module.exports = class product {
    async deleteMultipleBrand(query, body, callback){
        const {brandIds} = body;
        try{
            const result = await m_brands.deleteMultipleBrand(brandIds);
            callback({deleteMultipleBrand : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deleteMultipleBrand :false, message});
        }
    }
    async deleteBrand(query, callback){
        const {brandId} = query;
        try{
            const result = await m_brands.deleteBrand(brandId);
            callback({deleteBrand : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deleteBrand : false, message});
        }
    }
    async editBrand(query, body, callback){
        const {brandId} = query;
        try{
            await m_brands.editBrand(brandId, body);
            const result = await m_brands.getABrand(brandId);
            callback({editBrand : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({editBrand :false, message});
        }
    }
    async getABrand(query, callback){
        const {brandId} = query;
        try{
            const result = await m_brands.getABrand(brandId);
            if(result && result.drugId){
                const drugs = await m_drugs.getDrugsByIds([structure.db.ObjectId(result.drugId)]);
                if(drugs){
                    const drug = drugs.find(item=>item._id == result.drugId);
                    if(drug) result.drug = drug;
                }
            }
            callback({getABrand : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getABrand : false, message});
        }
    }
    async getBrandSearchMinMaxId(query, callback){
        let {companyId, type, keyword, sort} = query;
        if(sort === "undefined" || sort === "null") sort = null;
        try{
            const minId = await m_brands.getBrandSearchMinMaxId(companyId, type, keyword, null, sort);
            const maxId = await m_brands.getBrandSearchMinMaxId(companyId, type, keyword, true, sort);
            callback({getBrandSearchMinMaxId : true, result : {minId, maxId}, message : success});
        }catch(message){
            console.error(message);
            callback({getBrandSearchMinMaxId : false, message});
        }
    }
    async getBrandMinMaxId(query, callback){
        let {companyId, type, sort} = query;
        if(sort === "undefined" || sort === "null") sort = null;
        try{
            const minId = await m_brands.getBrandMinMaxId(companyId, type, null, sort);
            const maxId = await m_brands.getBrandMinMaxId(companyId, type, true, sort);
            callback({getBrandMinMaxId : true, result : {minId, maxId}, message : success});
        }catch(message){
            console.error(message);
            callback({getBrandMinMaxId : false, message});
        }
    }
    async searchBrand(query, body, callback){ console.log(body);
        const {companyId} = query;
        const {
            keyword, type, rows, skip, sort, max
        } = body;
        try{
            const result = await m_brands.searchBrand(
                companyId, type, keyword, rows, skip, sort, max
            );
            if(result && type !== "nonPharm"){
                const drugIds = result.map(item=>structure.db.ObjectId(item.drugId));
                const drugs = await m_drugs.getDrugsByIds(drugIds);
                for (let i = 0; i < result.length; i++) {
                    const brand = result[i];
                    if(brand.drugId){
                        const drug = drugs.find(item=>item._id == brand.drugId);
                        if(drug)result[i].drug = drug;
                    }
                }
            }
            callback({searchBrand : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({searchBrand : false, message});
        }
    }
    async getBrands(query, body, callback){
        let {companyId} = query;
        const {type, rows, skip, sort, max} = body;
        try{
            const result = await m_brands.getBrands(companyId, type, rows, skip, sort, max);
            if(result && type !== "nonPharm"){
                const drugIds = result.map(item=>structure.db.ObjectId(item.drugId));
                const drugs = await m_drugs.getDrugsByIds(drugIds);
                for (let i = 0; i < result.length; i++) {
                    const brand = result[i];
                    if(brand.drugId){
                        const drug = drugs.find(item=>item._id == brand.drugId);
                        if(drug)result[i].drug = drug;
                    }
                }
            }
            callback({getBrands : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getBrands : false, message});
        }
    }
    async createBrand(query, body, callback){
        const {companyId} = query;
        try{
            const result = await m_brands.createBrand(companyId, body);
            callback({createBrand : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createBrand : false, message});
        }
    }




    
    async getProductPackagingByIds(query, body, callback){
        const {packagingIds} = body;
        try{
            const result = await m_productPackagings.getProductPackagingByIds(packagingIds);
            callback({getProductPackagingByIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getProductPackagingByIds : false, message});
        }
    }
    async getAProductPackaging(query, callback) {
        const {packagingId} = query;
        try{
            const result = await m_productPackagings.getAProductPackaging(packagingId);
            callback({getAProductPackaging : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getAProductPackaging :false, message});
        }
    }
    async getProductsByIds(query, body, callback){
        const {productIds} = body;
        try{
            const result = await m_products.getProductsByIds(productIds);
            callback({getProductsByIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getProductsByIds : false, message});
        }
    }
    async getAProduct(query, callback){
        const{productId} = query;
        try{
            const result = await m_products.getAProduct(productId);
            const brandArray = await m_brands.getABrand(result.brandId);
            if(brandArray) result.brand = brandArray;
            callback({getAProduct : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getAProduct : false, message });
        }
    }
    async editProduct(query, body, callback){
        const {productId, data} = body;
        try{
            const result = await m_products.editProduct(productId, data);
            callback({editProduct : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({editProduct : false, message});
        }
    }
    async updateMutipleProductsInventory(query, body, callback) {
        const {productIds, value} = body;
        try{
            const result = await m_products.updateMutipleProductsInventory(productIds, value);
            callback({updateMutipleProductsInventory : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({updateMutipleProductsInventory : false, message});
        }
    }
    async deleteMultipleProducts(query, body, callback){
        const {productIds} = body;
        try{
            const result = await m_products.deleteMultipleProducts(productIds);
            callback({deleteMultipleProducts : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deleteMultipleProducts : false, message});
        }
    }
    async deleteProduct(query, callback){
        const {productId} = query;
        try{
            const result = await m_products.deleteProduct(productId);
            callback({deleteProduct : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deleteProduct : false, message});
        }
    }
    async getStockProductByCategoryIdSearchMinMaxId(query, callback){
        const {categoryId, sort, keyword} = query;
        if(sort === "undefined" || sort === "null") sort = null;
        try{
            const minId = await m_products.getStockProductByCategoryIdSearchMinMaxId(categoryId, keyword, null, sort);
            const maxId = await m_products.getStockProductByCategoryIdSearchMinMaxId(categoryId, keyword, true, sort);
            callback({getStockProductByCategoryIdSearchMinMaxId : true, result: {minId, maxId}, message : success});
        }catch(message){
            console.error(message);
            callback({getStockProductByCategoryIdSearchMinMaxId : false, message});
        }
    }
    async searchStockProductsByCategoryId(query, body, callback){
        const {categoryId, keyword, rows, skip, sort, max} = body;
        try{
            const result = await m_products.searchStockProductsByCategoryId(categoryId, keyword, rows, skip, sort, max);
            callback({searchStockProductsByCategoryId : true, result, message : success})
        }catch(message){
            console.error(message);
            callback({searchStockProductsByCategoryId : false, message});
        }
    }
    async getStockProductByCategoryIdMinMaxId(query, callback){
        let {categoryId, sort} = query;
        if(sort === "undefined" || sort === "null") sort = null;
        try{
            const minId = await m_products.getStockProductByCategoryIdMinMaxId(categoryId, null, sort);
            const maxId = await m_products.getStockProductByCategoryIdMinMaxId(categoryId, true, sort);
            callback({getStockProductByCategoryIdMinMaxId : true, result : {minId, maxId}, message : success});
        }catch(message){
            console.error(message);
            callback({getStockProductByCategoryIdMinMaxId : false, message});
        }
    }
    async getStockProductsByCategory(query, body, callback){
        const {categoryId, rows, skip, sort, max} = body;
        try{
            const result = await m_products.getStockProductsByCategory(
                categoryId, rows, skip, sort, max);
            callback({getStockProductsByCategory : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getStockProductsByCategory :false, message});
        }
    }
    async getStockProductCategories(query, callback){
        const {companyId} = query;
        try{
            const result = await m_products.getStockProductCategories(companyId);
            callback({getStockProductCategories : true, result ,message : success});
        }catch(message){
            console.error(message);
            callback({getStockProductCategories : false, message});
        }
    }
    async getStockProductMinMaxId(query, callback){
        let {companyId, sort} = query;
        if(sort === "undefined" || sort === "null") sort = null;
        try{
            const minId = await m_products.getStockProductMinMaxId(companyId, null, sort);
            const maxId = await m_products.getStockProductMinMaxId(companyId, true, sort);
            callback({getStockProductMinMaxId : true, result : {minId, maxId}, message : success});
        }catch(message){
            console.error(message);
            callback({getStockProductMinMaxId : false, message});
        }
    }
    async getProductMinMaxIds(query, callback){
        let {companyId, sort} = query;
        if(sort === "undefined" || sort === "null") sort = null;
        try{
            const minId = await m_products.getProductMinMaxId(companyId, null, sort);
            const maxId = await m_products.getProductMinMaxId(companyId, true, sort);
            callback({getProductMinMaxIds : true, result : {minId, maxId}, message : success});
        }catch(message){
            console.error(message);
            callback({getProductMinMaxIds : false, message})
        }
    }
    async getStockProductSearchMinMaxId(query, callback){
        const {companyId, sort, keyword} = query;
        if(sort === "undefined" || sort === "null") sort = null;
        try{
            const minId = await m_products.getStockProductSearchMinMaxId(companyId, keyword, null, sort);
            const maxId = await m_products.getStockProductSearchMinMaxId(companyId, keyword, true, sort);
            callback({getStockProductSearchMinMaxId : true, result: {minId, maxId}, message : success});
        }catch(message){
            console.error(message);
            callback({getStockProductSearchMinMaxId : false, message});
        }
    }
    async getProductSearchMinMaxId(query, callback){
        const {companyId, sort, keyword} = query;
        if(sort === "undefined" || sort === "null") sort = null;
        try{
            const minId = await m_products.getProductSearchMinMaxId(companyId, keyword, null, sort);
            const maxId = await m_products.getProductSearchMinMaxId(companyId, keyword, true, sort);
            callback({getProductSearchMinMaxId : true, result : {minId, maxId}, message : success});
        }catch(message){
            console.error(message);
            callback({getProductSearchMinMaxId : false, message});
        }
    }
    async searchStockProducts(query, body, callback){
        const {companyId} = query;
        const {keyword, rows, skip, sort, max} = body;
        try{
            const result = await m_products.searchStockProducts(companyId, keyword, rows, skip, sort, max);
            callback({searchStockProducts : true, result, message : success})
        }catch(message){
            console.error(message);
            callback({searchStockProducts : false, message});
        }
    }
    async searchProduct(query, body, callback){
        const {companyId} = query;
        const {keyword, rows, skip, sort, max} = body;
        try{
            const result = await m_products.searchProduct(companyId, keyword, rows, skip, sort, max);
            callback({searchProduct : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({searchProduct : false, message});
        }
    }
    async getStockProducts(query, body, callback){
        const {rows, skip, sort, max} = body;
        const {companyId} = query;
        try{
            const result = await m_products.getStockProducts(companyId, rows, skip, sort, max);
            callback({getStockProducts : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getStockProducts : false, message});
        }
    }
    async getProducts(query, callback){
        let {companyId, sort, max} = query;
        if(sort === "undefined" || sort === "null") sort = null;
        if(max === "undefined" || max === "null") max = null;
        else max = true;
        try{
            const rows = parseInt(query.rows);
            const skip = parseInt(query.skip);
            const result = await m_products.getProducts(companyId, rows, skip, sort, max);
            callback({getProducts : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getProducts : false, message});
        }
    }
    async createProduct(query, body, callback){
        const {companyId} = query;
        try{
            const result = await m_products.createProduct(companyId, body)
            callback({createProduct : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createProduct : false, message});
        }
    }



    async updateDrugName(query, body, callback){
        const {drugNameId, data} = body;
        try{
            const result = await m_drugNames.updateDrugName(drugNameId, data);
            callback({updateDrugName : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({updateDrugName : false, message});
        }
    }
    async deleteDrugName(query, callback){
        const {drugNameId} = query;
        try{
            const result = await m_drugNames.deleteDrugName(drugNameId);
            callback({deleteDrugName : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deleteDrugName : false, message});
        }
    }
    async createDrugName(query, body, callback){
        const {companyId} = query; 
        try{
            if(await m_drugNames.drugNameExists(body.name))
                throw("Product tag name exists");
            const result = await m_drugNames.createDrugName(companyId, body);
            callback({createDrugName :true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createDrugName : false, message});
        }
    }
    async getDrugNames(query, callback){
        const {companyId} = query;
        try{
            const result = await m_drugNames.getDrugNames(companyId);
            callback({getDrugNames : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getDrugNames : false, message});
        }
    }
    async updateProductForm(query, body, callback){
        const {productFormId, data} = body;
        try{
            const result = await m_productForms.updateProductForm(productFormId, data);
            callback({updateProductForm : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({updateProductForm : false, message});
        }
    }
    async deleteProductForm(query, callback){
        const {productFormId} = query;
        try{
            const result = await m_productForms.deleteProductForm(productFormId);
            callback({deleteProductForm : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deleteProductForm : false, message});
        }
    }
    async createProductForm(query, body, callback){
        const {companyId} = query;
        try{
            if(await m_productForms.productFormExists(body.name))
                throw("Product tag name exists");
            const result = await m_productForms.createProductForm(companyId, body);
            callback({createProductForm :true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createProductForm : false, message});
        }
    }
    async getProductForms(query, callback){
        const {companyId} = query;
        try{
            const result = await m_productForms.getProductForms(companyId);
            callback({getProductForms : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getProductForms : false, message});
        }
    }
    async updateProductCat(query, body, callback){
        const {productCatId, data} = body;
        try{
            const result = await m_productCats.updateProductCat(productCatId, data);
            callback({updateProductCat : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({updateProductCat : false, message});
        }
    }
    async deleteProductCat(query, callback){
        const {productCatId} = query;
        try{
            const result = await m_productCats.deleteProductCat(productCatId);
            callback({deleteProductCat : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deleteProductCat : false, message});
        }
    }
    async createProductCat(query, body, callback){
        const {companyId} = query;
        try{
            if(await m_productCats.productCatExists(body.name))
                throw("Product tag name exists");
            const result = await m_productCats.createProductCat(companyId, body);
            callback({createProductCat :true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createProductCat : false, message});
        }
    }
    async getProductCats(query, callback){
        const {companyId} = query;
        try{
            const result = await m_productCats.getProductCats(companyId);
            callback({getProductCats : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getProductCats : false, message});
        }
    }
    async updateProductTag(query, body, callback){
        const {productTagId, data} = body;
        try{
            const result = await m_productTags.updateProductTag(productTagId, data);
            callback({updateProductTag : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({updateProductTag : false, message});
        }
    }
    async deleteProductTag(query, callback){
        const {productTagId} = query;
        try{
            const result = await m_productTags.deleteProductTag(productTagId);
            callback({deleteProductTag : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deleteProductTag : false, message});
        }
    }
    async createProductTag(query, body, callback){
        const {companyId} = query; 
        try{
            if(await m_productTags.productTagExists(body.name))
                throw("Product tag name exists");
            const result = await m_productTags.createProductTag(companyId, body);
            callback({createProductTag :true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createProductTag : false, message});
        }
    }
    async getProductTags(query, callback){
        const {companyId} = query;
        try{
            const result = await m_productTags.getProductTags(companyId);
            callback({getProductTags : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getProductTags : false, message});
        }
    }
    async deleteProductPackaging(query, callback){
        const {packagingId} = query;
        try{
            const result = await m_productPackagings.deleteProductPackaging(packagingId);
            callback({deleteProductPackaging : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deleteProductPackaging : false, message});
        }
    }
    async editPackaging(query, body, callback){
        const {packagingId, packageIds} = body;
        try{
            if(await m_productPackagings.packagingExists(packageIds))
                throw("Packaging already exists!");
            const result = await m_productPackagings.editPackaging(packagingId, packageIds);
            callback({editPackaging : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({editPackaging : false, message});
        }
    }
    async getProductPackagings(query, callback){
        const {companyId} = query;
        try{
            const result = await m_productPackagings.getProductPackagings(companyId);
            callback({getProductPackagings : true, result, message: success});
        }catch(message){
            console.error(message);
            callback({getProductPackagings : false, message});
        }
    }
    async createProductPackaging(query, body, callback){
        const {companyId} = query;
        try{
            if(await m_productPackagings.packagingExists(body.packageIds))
                throw("Packaging already exists");
            const result = await  m_productPackagings.createProductPackaging(companyId, body);
            callback({createProductPackaging : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createProductPackaging : false, message});
        }
    }
    /**packages */
    async getProductPackagesByIds(query, body, callback){
        const {packageIds} = body;
        try{
            const result = await m_productPackages.getProductPackagesByIds(packageIds);
            callback({getProductPackagesByIds : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getProductPackagesByIds : false, message});
        }
    }
    async editProductPackage(query, body, callback){
        const {companyId, packageId} = query;
        try{
            await m_productPackages.editProductPackage(companyId, packageId, body);
            const result = await m_productPackages.getProductPackages(companyId);
            callback({editProductPackage : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({editProductPackage : false, message});
        }
    }
    async addProductPackage(query, body, callback){
        const {companyId} = query;
        try{
            await m_productPackages.addProductPackage(companyId, body);
            const result = await m_productPackages.getProductPackages(companyId);
            callback({addProductPackage : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({addProductPackage : false, message});
        }
    }
    async getProductPackages(query, callback){
        const {companyId } = query;
        try{
            const result = await m_productPackages.getProductPackages(companyId);
            callback({getProductPackages : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getProductPackages :false, message});
        }
    }
    async deleteProductPackage(query, callback){
        const {companyId, packageId} = query;
        try{
            await m_productPackages.deleteProductPackage(companyId, packageId);
            const result = await m_productPackages.getProductPackages(companyId);
            callback({deleteProductPackage : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({deleteProductPackage : false, message});
        }
    }

    async createProductDescription(query, body, callback){
        try{
            const companyId = parseInt(query.companyId);
            await m_productDescription.createProductDescription(companyId, body);
            const result = await m_productDescription.getProductDescriptions(companyId);
            callback({createProductDescription : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({createProductDescription : false, message});
        }
    }
    async getProductDescriptions(query, callback){
        const {companyId} = query;
        try{
            const result = await m_productDescription.getProductDescriptions(companyId);
            callback({getProductDescriptions : true, result, message : success});
        }catch(message){
            console.error(message);
            callback({getProductDescriptions : false, message});
        }
    }
}