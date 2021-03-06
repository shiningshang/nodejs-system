
exports.setRequestUrl=function(app){
    var user = require('./controllers/user'),
	config = require("./config"),
        indexObj = require('./controllers/index');
    
    app.all('/', indexObj.index);
    app.all('/login', user.login);
    app.post('/onLogin', user.onLogin);
    app.get('/onLogout', user.onLogout);
    app.get('/user/userList', user.userList);
    app.post('/user/addUser', user.addUser);
    app.get('/user/init',user.init);
    app.post('/user/editUser', user.editUser);
    app.get('/user/del/:id', user.delUser);
    app.get('/user/edit/:id', user.edit);
    app.get('/user/add', user.add);
    app.all('/user/download', user.download);

    app.post('/index/newContent', indexObj.newContent);
    app.get('/index', indexObj.index);
    app.get('/index/:id', indexObj.viewContect);
    app.get('/index/:id/edit', indexObj.editContect);
    app.post('/index/:id/edit', indexObj.saveContect);
    app.get('/index/:id/delete', indexObj.deleteContectById);
    app.all('*',function(req,res,next){
      var url = req.originalUrl;
      for(var i=0,l=config.pass_url.length;i<l;i++){
        var r = '.*\.'+config.pass_url[i]+'$';
        if(new RegExp(r).test(url)){
          //console.log(url)
          next();
          return;
        }
      }
      res.render('404.html', {
        title: 'No Found'
      })
    })

}
