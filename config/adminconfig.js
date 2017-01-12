//If you make any changes to schemeBeam, make sure you NEVER reference this config file on the front end of your code.

module.exports = {
  //Port on which to deploy app.js
  "port": 80,
  //Your personal SendGrid API key. 
  "SENDGRID_API_KEY": "your_api_key_here",
  //Mysql configuration
  "mysql": {
    "host": "localhost",
    "schema": "schemeBeam",
    "username": "root",
    "password": "my_password"
  },
  //Make absolutely sure you change these values before you start your campaign. Used to log into admin UI and gain access to certain API endpoints.
  "admin": {
  	"username": "admin",
  	"password": "password"
  },
  "passportSecret": "schemeBeamSecret"
}