var express = require('express')
, mongoHelper = require("./utils/mongoUtils")
    , urlHelper = require("./routes.js")
  , http = require('http')
  , config = require("./config");  


var app = express();

app.engine('html', require('ejs').renderFile);

app.configure(function(){
  app.set('port', config.port);
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');
  app.use(express.logger('dev'));
  app.use(express.cookieParser('some secret here'));
  app.use(express.session());
  app.use(function (req, res, next) {
      var url = req.originalUrl;
      //第一次使用,取消下面的注释，手动添加用户url:/user/init
      //next();return;
      for(var i=0,l=config.pass_url.length;i<l;i++){
        var r = '.*\.'+config.pass_url[i]+'$';
        if(new RegExp(r).test(url)){
          console.log(url)
          next();
          return;
        }
      }
      if (url != "/login" && url != "/onLogin" && !req.session.user) {
        next();
        return res.redirect("/login");
      }
      if(req.session.user){
        //类似于session的东西
        res.locals.userName = req.session.user.userName; 
      }
      next();
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
app.configure('development', function(){
  app.use(express.errorHandler());
});

urlHelper.setRequestUrl(app);

mongoHelper.connect(function(error){
    if (error) throw error;
});
app.on('close', function(errno) {
	mongoHelper.disconnect(function(err) { });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
