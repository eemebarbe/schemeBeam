//general dependencies
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var router = express.Router();

//route configuration
app.use('/api', router);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//database configuration
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'my_password',
    database: 'schemeBeam'
});

connection.connect();

//internal app dependencies
var api = require('./api/api.js')(app);

//server initiation
var port = 80;
app.listen(port, function() {
    console.log('schemeBeam up and running on port ' + port);
});


// Handle / root route.
app.get('/', function(req, res) {
	res.sendfile('./public/views/index.html');
});

