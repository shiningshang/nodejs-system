"use strict";

var config = require('../config');
var userDBModel = require('../models/user.js');
var crypt = require('../utils/crypt.js');
var download = require('../utils/download.js').download;
var user =new userDBModel.Schema("user").model;
exports.login = function (req, res, next) {
        res.render('login.html',{message:""});
};
exports.onLogin = function (req, res, next) {
    var mdPassword=crypt.md5(req.body.password);
    var queryObj = {userName:req.body.userName,password:mdPassword};
    user.findOne(queryObj,function(err,userInfo){
		if(err){
			 res.render('./login.html',{message:"登陆失败！"});
		}else{
			if(userInfo){
                req.session.user = userInfo;
                res.redirect("/index");
			}else{
				 res.render('./login.html',{message:"用户名和密码错误！"});
			}
		}
	})
};
exports.onLogout = function (req, res, next) {
    req.session.user = null;
    res.render('./login.html',{message:"用户已经退出!"});
};
 exports.addUser = function (req, res, next){
     var userEntity = new user();
     userEntity.userName=req.body.userName;
     var mdPassword=crypt.md5(req.body.password);
     userEntity.password=mdPassword;
     userEntity.save(function (err,userInfo){
        if (err) {
            return next(err);
        }
        user.find({},function(err,userList){
            res.redirect("/user/userList");
        });
     })
 };
exports.delUser = function (req, res, next) {
    var id = req.params.id;
    user.remove({_id:id}, function(err, doc) {
        if(err){
            console.log(err)
        }
        res.redirect("/user/userList");
    });
};
exports.editUser = function (req, res, next) {
    var id = req.body.id,
    userName = req.body.userName,
    mdPassword = crypt.md5(req.body.password),
    conditions = {_id:id},
    update = {$set : {userName : userName,password:mdPassword}},
    options = {upsert : true};
    user.update(conditions,update,options, function(err, doc) {
        if(err) {
            console.log(err);
        }
        res.redirect("/user/userList");
    });
};
exports.userList=function(req, res, next){
    var search={};
    var page={limit:5,num:1};   
    //查看哪页
    if(req.query.p){
        page['num']=req.query.p<1?1:req.query.p;
    }
    var model = {
        search:search,
        columns:'userName password',
        page:page
    };
    exports.findPagination(model,function(err, pageCount, userList){
        console.log("pageCount"+pageCount+"   userList"+userList.length);
        page['pageCount']=pageCount;
        page['size']=userList.length;
        page['numberOf']=pageCount>5?5:pageCount;
        res.render('./user/users.html', {userList: userList,page:page});
    });
};
exports.findPagination = function(obj,callback) {
    var q=obj.search||{}
    var col=obj.columns;

    var pageNumber=obj.page.num||1;
    var resultsPerPage=obj.page.limit||10;

    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
    var query = user.find({}).skip(skipFrom).limit(resultsPerPage);

    query.exec(function(error, results) {
        if (error) {
            callback(error, null, null);
        } else {
            user.count(q, function(error, count) {
                if (error) {
                    callback(error, null, null);
                } else {
                    var pageCount = Math.ceil(count / resultsPerPage);
                    callback(null, pageCount, results);
                }
            });
        }
    });
}
exports.add = function (req,res,next){
    res.render('./user/add.html');
};
exports.edit = function (req,res,next){
    var id = req.params.id;
    var queryObj = {_id:id};
    user.findOne(queryObj,function(err,userInfo){
        if(userInfo){
            res.render('./user/edit.html',{user:userInfo});
        }
    })
};
//下载csv
exports.download = function (req,res,next){
    
    //var fields = {userName : 1, password : 1};
    user.find({},function(err,userList){
        var data= [];
        for(var i=0,l=userList.length;i<l;i++){
            var u = userList[i];
            data.push({
                userName:u.userName,
                password:u.password,
                create_date:u.create_date
            })
        }
        download.csv(res,data)
    });
    
};