module.exports = function(app, connection) {

    var passport = require('passport');
    var cookieParser = require('cookie-parser');
    var Strategy = require('passport-local');
    var adminConfig = require('../config/adminconfig.js');
    var jwt = require('jsonwebtoken');
    var expressJwt = require('express-jwt');
    var authenticate = expressJwt({secret : 'server secret'});


    app.use(passport.initialize());

    // authentication method for verifying a user attempting to log-in
    app.post('/loginAuth', passport.authenticate(
        'local', {
            session: false
        }), generateToken, respond);

    // logs user out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/routerCheck', function(req, res) {
        if(!req.user) {
            res.json('400');
        } else {
            res.json('200');
        }
    });

/*    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

*/

    // general authentication method
    passport.use(new Strategy(
    function(username, password, done) { // callback with email and password from our form
        if(adminConfig.admin.username === username && adminConfig.admin.password === password) {
            return done(null, adminConfig.admin.username);
        } else {
            return done(null, false);
        }
    }));


    function generateToken(req, res, next) {  
      req.token = jwt.sign({
        id: req.user,
      }, 'server secret', {
        expiresIn: '1h'
      });
      next();
    }


    function respond(req, res) { 
      res.json({
        user: req.user,
        token: req.token
      });
    }


}
