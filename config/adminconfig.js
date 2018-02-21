//If you make any changes to schemeBeam, make sure you NEVER reference this config file on the front end of your code.

module.exports = {
  //Port on which to deploy app.js
  "port": 80,
  //Your personal SendGrid API key. 
  "SENDGRID_API_KEY": "your_api_key_here",
  //The id of the list you would like your client emails to (a number, can be found at the end the url path of your list)
  "list_Id": "this_is_an_integer",
  //Mysql configuration
  "mysql": {
    "host": "localhost",
    "schema": "schemeBeam",
    "username": "root",
    "password": "my_password",
    "socketPath": "/var/run/mysqld/mysqld.sock"
  },
  //Make absolutely sure you change these values before you start your campaign. Used to log into admin UI and gain access to certain API endpoints.
  "admin": {
  	"username": "admin",
  	"password": "password"
  },
  //secret for authentication process. change to whatever you'd like.
  "passportSecret": "schemeBeamSecret"
}
