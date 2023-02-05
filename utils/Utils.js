module.exports = class Utils{
    static rand(){
        return Math.random(0).toString(36).substr(2);
    }
    static token(length){
        return (this.rand()+this.rand()+this.rand()+this.rand()).substr(0,length);
    }
    /**
     * 
     * @param {String} date - "dd/mm/yyyy"
     */
    static getThisDate(date = new Date().toLocaleDateString()){
        date = date.split("/");
        const month = String(date[0]).padStart(2, "0");
        const day = String(date[1]).padStart(2, "0");
        const year = String(date[2]).padStart(2, "0");
        const d = year+"-"+month+"-"+day;
        return new Date(d);
    }
    static getStandardFromLocale(date){
        date = date.split("/");
        const month = String(date[0]).padStart(2, "0");
        const day = String(date[1]).padStart(2, "0");
        const year = String(date[2]).padStart(2, "0");
        const d = year+"-"+month+"-"+day;
        return new Date(d);
    }
    static escapeRegExp(string){
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }
}