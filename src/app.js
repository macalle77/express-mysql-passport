var express = require ('express');
var path = require('path');

var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');

var logger = require('morgan');
var bodyParser = require('body-parser');

//var dbConfig=require('./libs/db');
//var mongoose=require('mongoose');

var app = express();

//connect to DB
//mongoose.connect(dbConfig.url);

//var router = express.Router();

//app.set('port', process.env.PORT || 3000);

//app.listen(app.get('port'), () => {
//  console.log('server on port', app.get('port'))
//  debug('Express server listening on port'+server.address().port)
//})

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

//Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret:'clave', resave: false, saveUninitialized:true,cookie: {secure:false}}));
app.use(passport.initialize());
app.use(passport.session());

//Using the flash middleware provided by connect-flash to store messages in session
//and displaying in templates
var flash=require('connect-flash');
app.use(flash());

//initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

//const indexRoutes = require('./routes/index')
//var routes=require('./routes/index')(passport);
//app.use('/',routes);
var routesFunction=require('./routes/index');
var routes=routesFunction(passport);

app.use('/',routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

module.exports=app;
