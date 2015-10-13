var mime=require("./mime.js").mime;
var CSV = require('comma-separated-values');
var date = require('../utils/dateFormat.js');
var download = {
     /**
     data:json
     */
     csv : function(res,data) {
         var now = date.getSmpFormatNowDate(true)
         res.setHeader('Content-disposition', 'attachment; filename='+now+'.csv');  
         res.writeHead(200, {  
             'Content-Type': mime.lookupExtension('.csv')  
         });  
         res.write(new Buffer('\xEF\xBB\xBF','binary'));//add utf-8 bom  
         var d = new CSV(data, { header: true }).encode();
         res.end(d); 
     }
}
exports.download=download;