const hir = require("./apps/hir/hirHandler");
const inv = require("./apps/inv/invHandler")
const pos = require('./apps/pos/posHandler');
const dsp = require("./apps/dsp/dspHandler");
module.exports = async function(req, res){
    console.log("App = " + req.params.app);
    switch(req.params.app){
        case "hir" : return hir(req, res);
        case "pos" : return pos(req, res);
        case "inv" : return inv(req, res);
        case "dsp" : return dsp(req, res);
    }
}