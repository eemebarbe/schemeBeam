//general dependencies
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var router = express.Router();


//database configuration
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'my_password',
    database: 'schemeBeam'
});

connection.connect();

var env = require("./env.js");


var helper = require('sendgrid').mail;
var from = new helper.Email("eeme.barbe@gmail.com");
var to = new helper.Email("eeme.barbe@gmail.com");
var subject = "subject here";
var content = new helper.Content("text/html", "<h1>Your referral link:</h1> <h2>second header</h2>");
var mail = new helper.Mail(from, subject, to, content);

var sg = require('sendgrid')(SENDGRID_API_KEY);

var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON(),
});

function sendMessage() {
sg.API(request, function(error, response) {
  // Handle the response here.
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
});
}

//route configuration
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//internal app dependencies
var api = require('./api/api.js')(app, connection);
var routes = require('./routes/routes.js')(app, connection);

//server initiation
var port = 80;
app.listen(port, function() {
    console.log('schemeBeam up and running on port ' + port);
});


