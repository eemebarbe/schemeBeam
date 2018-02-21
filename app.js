//general dependencies
var express = require('express',
    cookieParser = require('cookie-parser'),
    i18n = require('i18n'));
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var adminConfig = require('./config/adminconfig.js');

i18n.configure({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  cookie: 'yourcookiename',
  directory: __dirname + '/locales'
});

//database configuration
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: adminConfig.mysql.host,
    user: adminConfig.mysql.username,
    password: adminConfig.mysql.password,
    database: 'schemeBeam',
    socketPath: adminConfig.mysql.socketPath
});

connection.connect();

app.use(cookieParser());

app.use(i18n.init);

//route configuration
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//internal app dependencies
var api = require('./api/api.js')(app, connection);
var routes = require('./routes/routes.js')(app, connection);
var auth = require('./authentication/auth.js')(app, connection);

//server initiation
var port = adminConfig.port;
app.listen(port, function() {
    console.log('schemeBeam up and running on port ' + port);
});

