var util = require('util');
var date = require('../utils/dateFormat.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    userName:String,
    password:String,
    create_date: { type: String, default: date.getSmpFormatNowDate(true) }
});
//访问todo对象模型
mongoose.model('user', userSchema);
module.exports.Schema =function (modelName){
    return{model:mongoose.model(modelName)};
}
