const structure = require("../../Infrastructure/structure");
const m_product_cats = require("./m_inv_productCats");
const m_supplier_brands = require('./m_inv_product_brands');
const errMsg = "DB Error - ";
module.exports = class product_products {
    static getProductsByIds(productIds, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                productIds = productIds.map(item=>structure.db.ObjectId(item));
                client.collection(this.name).aggregate([
                    {
                        $addFields : {
                            _brandId : {$toObjectId : "$brandId"},
                            _categoryId : {$toObjectId : "$categoryId"}
                        }
                    },  
                    {
                        $lookup : {
                            from : m_product_cats.name,
                            localField : "_categoryId",
                            foreignField : "_id",
                            as : "category"
                        }
                    },{
                        $lookup : {
                            from : m_supplier_brands.name,
                            localField : "_brandId",
                            foreignField : "_id",
                            as : "brand"
                        }
                    },{
                        $match : {_id : {$in : productIds}}
                    }
                ]).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "getProductsByIds";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result && result);
                        if(callback) callback(err, result && result);
                    }
                })
            })
        })
    }
    static editProduct(productId, data, callback) {
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).updateOne(
                    {_id : structure.db.ObjectId(productId)},
                    {$set : data},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "editProduct";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.result);
                            if(callback) callback(err, result.result);
                        }
                    }
                )
            })
        })
    }
    static updateMutipleProductsInventory(productIds, value, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                productIds = productIds.map(item=>structure.db.ObjectId(item));
                client.collection(this.name).updateMany(
                    {_id : {$in : productIds}},
                    {$set : {inventory : value}},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "updateMutipleProductsInventory";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.result);
                            if(callback) callback(err, result.result);
                        }
                    }
                )
            })
        })
    }
    static deleteMultipleProducts(productIds, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                productIds = productIds && productIds.map(item=>structure.db.ObjectId(item));
                client.collection(this.name).deleteMany(
                    {_id : {$in : productIds}},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "deleteMultipleProducts";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.result);
                            if(callback) callback(err, result.result);
                        }
                    }
                )
            })
        })
    }
    static deleteProduct(productId, callback) {
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).deleteOne(
                    {_id : structure.db.ObjectId(productId)},
                    (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "deleteProduct";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.result);
                            if(callback) callback(err, result.result);
                        }
                    }
                )
            })
        })
    }
    static getStockProductByCategoryIdSearchMinMaxId(categoryId, keyword, max, sort, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{ 
                client.collection(this.name).aggregate([
                    {
                        $addFields : {
                            _brandId : {$toObjectId : "$brandId"}
                        }
                    },{
                        $match : {
                            categoryId, inventory : true,
                            name : new RegExp(".*"+keyword+".*", "i")
                        }
                    },{
                        $lookup : {
                            from : m_supplier_brands.name,
                            localField : "_brandId",
                            foreignField : "_id",
                            as : "brand"
                        }
                    }
                ]).sort(sort ? {[sort] : max ? -1 : 1 } : {_id: -1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "getStockProductByCategoryIdSearchMinMaxId";
                        reject(error);
                        if(callback) callback(error)
                    }
                    else{
                        res();
                        if(result.length !== 0 ) {
                            if (callback) callback(result[0]._id);
                            resolve(result[0]._id);
                        }
                        else {
                            if(callback) callback(0);     //converted back to int
                            resolve(0);
                        }
                    }
                });
            });
        });
    }
    static searchStockProductsByCategoryId(categoryId, keyword, rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate([
                    {
                        $addFields : {
                            _brandId : {$toObjectId : "$brandId"},
                        }
                    },{
                        $lookup : {
                            from : m_supplier_brands.name,
                            localField : "_brandId",
                            foreignField : "_id",
                            as : "brand"
                        }
                    },{
                        $match : {
                            categoryId, inventory : true, 
                            name : new RegExp(".*"+keyword+".*", "i")
                        }
                    }
                ]).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "searchStockProductsByCategoryId";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            })
        })
    }
    static getStockProductByCategoryIdMinMaxId(categoryId, max, sort, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{ 
                client.collection(this.name).aggregate([
                    {
                        $addFields : {
                            _brandId : {$toObjectId : "$brandId"}
                        }
                    },{
                        $match : {categoryId, inventory : true}
                    },{
                        $lookup : {
                            from : m_supplier_brands.name,
                            localField : "_brandId",
                            foreignField : "_id",
                            as : "brand"
                        }
                    }
                ]).sort(sort ? {[sort] : max ? -1 : 1} : {_id: -1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "getStockProductByCategoryIdMinMaxId";
                        reject(error);
                        if(callback) callback(error)
                    }
                    else{
                        res();
                        if(result.length !== 0 ) {
                            if (callback) callback(result[0]._id);
                            resolve(result[0]._id);
                        }
                        else {
                            if(callback) callback(0);     //converted back to int
                            resolve(0);
                        }
                    }
                });
            });
        });
    }
    static getStockProductsByCategory(categoryId, rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate([
                    {
                        $addFields : {
                            _brandId : {$toObjectId : "$brandId"}
                        }
                    },{
                        $match : {categoryId, inventory : true}
                    },{
                        $lookup : {
                            from : m_supplier_brands.name,
                            localField : "_brandId",
                            foreignField : "_id",
                            as : "brand"
                        }
                    }
                ]).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray((err, result)=>{
                    if(err){
                        rej(err);
                        const error = errMsg + "getStockProductsByCategory";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            })
        })
    }
    static searchProduct(companyId, keyword, rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getProductAggregateArray({companyId, name : new RegExp(".*"+keyword+".*", "i")})
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "searchProduct";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            })
        })
    }
    static getAProduct(productId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate([
                    {
                        $addFields : {
                            _categoryId : {$toObjectId : "$categoryId"}
                        }
                    },  
                    {
                        $lookup : {
                            from : m_product_cats.name,
                            localField : "_categoryId",
                            foreignField : "_id",
                            as : "category"
                        }
                    },{
                        $unwind : {
                            path : "$category",
                            preserveNullAndEmptyArrays : true,
                        }
                    },{
                        $match : {_id : structure.db.ObjectId(productId)}
                    }
                ]).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "getAProduct";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result && result[0]);
                        if(callback) callback(err, result && result[0]);
                    }
                })
            })
        })
    }
    static getStockProductSearchMinMaxId(companyId, keyword, max, sort, pos, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{ 
                client.collection(this.name).aggregate(
                    this.getProductAggregateArray({
                        companyId, inventory : true, 
                        name : new RegExp(".*"+keyword+".*", "i")
                    }, pos)
                ).sort(sort ? {[sort] : max ? -1 : 1 } : {_id: max ? -1 : 1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "searchSupplierMinMaxId";
                        reject(error);
                        if(callback) callback(error)
                    }
                    else{
                        res();
                        if(result.length !== 0 ) {
                            if (callback) callback(result[0]._id);
                            resolve(result[0]._id);
                        }
                        else {
                            if(callback) callback(0);     //converted back to int
                            resolve(0);
                        }
                    }
                });
            });
        });
    }
    static searchStockProducts(companyId, keyword, rows, skip, sort, max, pos, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getProductAggregateArray({
                        companyId, inventory : true, 
                        name : new RegExp(".*"+keyword+".*", "i")
                    }, pos)
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "searchStockProducts";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            })
        })
    }
    static getStockProductMinMaxId(companyId, max, sort, pos, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{ 
                client.collection(this.name).aggregate(
                    this.getProductAggregateArray({companyId, inventory : true}, true)
                ).sort(sort ? {[sort] : max ? -1 : 1 } : {_id: max ? -1 : 1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "getStockProductMinMaxId";
                        reject(error);
                        if(callback) callback(error)
                    }
                    else{
                        res();
                        if(result.length !== 0 ) {
                            if (callback) callback(result[0]._id);
                            resolve(result[0]._id);
                        }
                        else {
                            if(callback) callback(0);     //converted back to int
                            resolve(0);
                        }
                    }
                });
            });
        });
    }
    static getStockProducts(companyId, rows, skip, sort, max, pos, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getProductAggregateArray({companyId, inventory : true}, pos)
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "getStockProducts";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                });
            })
        })
    }
    static getProducts(companyId, rows, skip, sort, max, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate(
                    this.getProductAggregateArray({companyId})
                ).sort(sort ? {[sort] : max ? -1 : 1} : {_id : -1}).
                skip(skip).limit(rows).toArray((err, result)=>{ 
                    if(err){
                        rej(err);
                        const error = errMsg + "getProducts";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(err, result);
                    }
                })
            })
        })
    }
    static getProductAggregateArray(match, pos){
        let returnArray = [
            {
                $addFields : {
                    _brandId : {$toObjectId : "$brandId"},
                    _categoryId : {$toObjectId : "$categoryId"}
                }
            },  
            {
                $lookup : {
                    from : m_product_cats.name,
                    localField : "_categoryId",
                    foreignField : "_id",
                    as : "category"
                }
            },{
                $unwind : {
                    path : "$category",
                    preserveNullAndEmptyArrays : true
                }
            },{
                $lookup : {
                    from : m_supplier_brands.name,
                    localField : "_brandId",
                    foreignField : "_id",
                    as : "brand"
                }
            },{
                $unwind : {
                    path : "$brand",
                    preserveNullAndEmptyArrays : true,
                }
            }
        ]
        if(pos){
            returnArray.push(
                {
                    $addFields : {
                        "brand._supplierId" : {$toObjectId : "$brand.supplierId"},
                        "brand._drugId" : {$toObjectId : "$brand.drugId"},
                        "brand.packagingInfo._packagingId" : {$toObjectId : "$brand.packagingInfo.packagingId"},
                    }
                },{
                    $lookup : {
                        from : "product_suppliers",
                        localField : "brand._supplierId",
                        foreignField : "_id",
                        as : "brand.supplier"
                    }
                },{
                    $unwind : {
                        path : "$brand.supplier",
                        preserveNullAndEmptyArrays : true
                    }
                },{
                    $lookup : {
                        from : "product_drugs",
                        localField : "brand._drugId",
                        foreignField : "_id",
                        as : "brand.drug"
                    }
                },{
                    $unwind : {
                        path : "$brand.drug",
                        preserveNullAndEmptyArrays : true
                    }
                },{
                    $addFields : {
                        "brand.drug._nameIds" : {
                            $map : {
                                input : "$brand.drug.nameStrengths",
                                in : {$toObjectId : "$$this.nameId"}
                            }
                        },
                        "brand.drug._strengthIds" : {
                            $map : {
                                input : "$brand.drug.nameStrengths",
                                in : {$toObjectId : "$$this.strengthId"},
                            }
                        }
                    }
                },{
                    $lookup : {
                        from : "product_drugnames",
                        localField : "brand.drug._nameIds",
                        foreignField : "_id",
                        as : "brand.drug.names"
                    }
                },{
                    $lookup : {
                        from : "product_drugstrength",
                        localField : "brand.drug._strengthIds",
                        foreignField : "_id",
                        as : "brand.drug.strengths"
                    }
                },{
                    $lookup : {
                        from : "product_packagings",
                        localField : "brand.packagingInfo._packagingId",
                        foreignField : "_id",
                        as : "brand.packagingInfo.packaging",
                    }
                },{
                    $unwind : {
                        path : "$brand.packagingInfo.packaging",
                        preserveNullAndEmptyArrays : true
                    }
                },{
                    $addFields : {
                        "brand.drug._dosageFormId" : {$toObjectId : "$brand.drug.dosageFormId"},
                        "brand.drug._packId" : {$toObjectId : "$brand.drug.packId"},
                        "brand.packagingInfo.packaging._packageIds" : {
                            $map : {
                                input : "$brand.packagingInfo.packaging.packageIds",
                                in : {$toObjectId : "$$this"}
                            }
                        }
                    }
                },{
                    $lookup : {
                        from : "product_drugdosageform",
                        localField : "brand.drug._dosageFormId",
                        foreignField : "_id",
                        as : "brand.drug.dosageForm"
                    }
                },{
                    $lookup : {
                        from : "product_drugpacks",
                        localField : "brand.drug._packId",
                        foreignField : "_id",
                        as : "brand.drug.pack"
                    }
                },{
                    $unwind : {
                        path : "$brand.drug.pack",
                        preserveNullAndEmptyArrays : true
                    }
                },{
                    $unwind : {
                        path : "$brand.drug.dosageForm",
                        preserveNullAndEmptyArrays : true,
                    }
                },{
                    $lookup : {
                        from : "product_packages",
                        localField : "brand.packagingInfo.packaging._packageIds",
                        foreignField : "_id",
                        as : "brand.packagingInfo.packaging.packages"
                    }
                }
            )
        }
        returnArray.push({
            $match : match
        });
        return returnArray;
    }
    static createProduct(companyId, data, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                data = {...data, companyId}
                client.collection(this.name).insertOne(
                    data, (err, result)=>{
                        if(err){
                            rej(err);
                            const error = errMsg + "createProduct";
                            reject(error);
                            if(callback) callback(error);
                        }else{
                            res();
                            resolve(result.ops[0]);
                            if(callback) callback(err, result.ops[0]);
                        }
                    }
                )
            })
        })
    }
    static getStockProductCategories(companyId, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{
                client.collection(this.name).aggregate([
                    {
                        $match : {companyId, inventory : true}
                    },{
                        $addFields : {
                            _categoryId : {$toObjectId : "$categoryId"}
                        }
                    },{
                        $lookup : {
                            from : m_product_cats.name,
                            localField : "_categoryId",
                            foreignField : "_id",
                            as : "category"
                        }
                    },{
                        $group : {
                            _id : {
                                categoryId : "$categoryId", 
                                category : "$category"
                            },
                            count : {$sum : 1}
                        }
                    }
                ]).toArray((err, result)=>{ console.log(result);
                    if(err){
                        rej(err);
                        const error = errMsg + "getStockProductCategories";
                        reject(error);
                        if(callback) callback(error);
                    }else{
                        res();
                        resolve(result);
                        if(callback) callback(result);
                    }
                })
            })
        })
    }
    static getProductSearchMinMaxId(companyId, keyword, max, sort, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{ 
                client.collection(this.name).find(
                    {companyId, name : new RegExp(".*"+keyword+".*", "i")}
                )
                .sort(sort ? {[sort] : max ? -1 : 1 } : {_id: max ? -1 : 1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "searchSupplierMinMaxId";
                        reject(error);
                        if(callback) callback(error)
                    }
                    else{
                        res();
                        if(result.length !== 0 ) {
                            if (callback) callback(result[0]._id);
                            resolve(result[0]._id);
                        }
                        else {
                            if(callback) callback(0);     //converted back to int
                            resolve(0);
                        }
                    }
                });
            });
        });
    }
    static getProductMinMaxId(companyId, max, sort, callback){
        return new Promise((resolve, reject)=>{
            structure.db.hms((client, res, rej)=>{ 
                client.collection(this.name).find(
                    {companyId}
                ).sort(sort ? {[sort] : max ? -1 : 1 } : {_id: max ? -1 : 1})
                .limit(1).toArray((err, result)=>{
                    if(err) {
                        rej(err)
                        const error = errMsg + "searchSupplierMinMaxId";
                        reject(error);
                        if(callback) callback(error)
                    }
                    else{
                        res();
                        if(result.length !== 0 ) {
                            if (callback) callback(result[0]._id);
                            resolve(result[0]._id);
                        }
                        else {
                            if(callback) callback(0);     //converted back to int
                            resolve(0);
                        }
                    }
                });
            });
        });
    }
}