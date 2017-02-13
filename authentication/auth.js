module.exports = function(app, connection) {

    var passport = require('passport');
    var cookieParser = require('cookie-parser');
    var expressSession = require('express-session');
    var LocalStrategy = require('passport-local').Strategy;
    var adminConfig = require('../config/adminconfig.js');


    app.use(expressSession({
        secret: adminConfig.passportSecret
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // authentication method for verifying a user attempting to log-in
    app.post('/loginAuth', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            } else if (!user) {
                res.status(401).send({
                    success: false
                });
            } else {
                req.logIn(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({
                        success: true
                    });
                });
            }
        })(req, res, next);
    });

    // logs user out
    app.post('/logout', function(req, res) {
        req.logout();
        res.end();

    });

    app.post('/routerCheck', function(req, res) {
        if (req.isAuthenticated()) {
            res.json('200');
        } else {
            res.json('401');
        }
    });


    // general authentication method
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
    function(req, username, password, done) { // callback with email and password from our form
        if(adminConfig.admin.username === username && adminConfig.admin.password === password) {
            return done(null, adminConfig.admin.username);
        } else {
            return done(null, false);
        }
    }));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // middleware function used in routes in order to regulate access based on whether or not the user is authenticated
    return function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/#/login');
        }
    }





}
