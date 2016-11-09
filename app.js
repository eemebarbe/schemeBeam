//general dependencies
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var router = express.Router();

//route configuration
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');


//server initiation
var port = 80;
app.listen(port, function() {
    console.log('schemeBeam up and running on port ' + port);
});


// Handle / root route.
app.get('/', function(req, res) {
res.render('index.ejs');
});