const structure = require("../../../Infrastructure/structure");

structure.db.schools((client, res, rej)=>{
    client.listCollections().toArray((err, collections)=>{
        for (let i = 0; i < collections.length; i++) {
            const {name} = collections[i];
            client.collection(name).findOne({}, (err, result)=>{
                if(err) {
                    console.log('*************** START  ***************');
                    console.log(err)
                    console.log('*************** END  ***************');
                }
                console.log(result);
            })
        }
    })
})