//general dependencies
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var router = express.Router();

//route configuration
app.use('/api', router);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

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

//server initiation
var port = 80;
app.listen(port, function() {
    console.log('schemeBeam up and running on port ' + port);
});


// Handle / root route.
app.get('/', function(req, res) {
	res.render('index.ejs');
});

    app.post('/api/v1/newemail', function(req, res) {
        // regex on both client and server side for protection in case JS is augmented
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(req.body.email)) {
            res.json('Email address is not valid!');
        } else {
            connection.query('INSERT INTO emails (emailaddress) VALUES (?)', [req.body.email], function(err, rows, fields) {
                if (err) {
                	console.log(err);
                    res.status(401);
                }
            });
        }
        res.end();
    });