//APP
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var flash = require('connect-flash');

//DB
var mongoose = require('mongoose');
var configDB = require('./config/database');

//AUTH
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');

mongoose.connect(configDB.url);

var port = 1337;
var app = express();
//setting app config. Path to html files is in 'views' bc of ejs.
app.set('view engine', 'ejs');
//path to files (css, js)
app.set('ConUHacksVMusic2', path.join(__dirname, 'ConUHacksVMusic2'));
app.use(express.static(__dirname + '/public'));

app.use(flash());

//to handle post requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//setting auth config.
//Argument of function is passport
require('./config/passport')(passport);
app.use(cookieParser());
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session());

require('./routes')(app,passport);

app.listen(process.env.PORT || port);
