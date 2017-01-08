//general dependencies
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var router = express.Router();
var adminConfig = require('./config/adminconfig.js');


//database configuration
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: adminConfig.mysql.host,
    user: adminConfig.mysql.username,
    password: adminConfig.mysql.password,
    database: 'schemeBeam'
});

connection.connect();


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


