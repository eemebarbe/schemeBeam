var md5 = require('md5');
var adminConfig = require('../config/adminconfig.js');
var settingsConfig = require('../config/settingsconfig.js');
var sg = require('sendgrid')(adminConfig.SENDGRID_API_KEY);

module.exports = function(app, connection) {

var ensureAuthenticated = require('../authentication/auth.js')(app);

    //add email address to database, create a verification code, and send verification link to email address
    app.post('/api/v1/newemail', function(req, res) {
        // regex on both client and server side for protection in case JS is augmented
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (req.body.name == '') {
            res.json('Votre nom doit être renseigné !');
        } else if (!re.test(req.body.email)) {
            res.json('Email address is not valid!');
        } else {
            var email = req.body.email;
            var name = req.body.name;
            var domain = email.substring(email.lastIndexOf("@") +1);
            var hashCode = md5(name + email);
            //send verification email
            function sendGrid(referredBy){
                connection.query('INSERT INTO emails (name, emailaddress, referralcode, referredby) VALUES (?, ?, ?, ?)', [name, req.body.email, hashCode, referredBy], function(err, rows, fields) {
                    if (err) {
                        res.json(401);
                    } else {
                        //send verification email
                        var helper = require('sendgrid').mail;
                        var from = new helper.Email(settingsConfig.senderAddress);
                        var to = new helper.Email(req.body.email);
                        var subject = settingsConfig.subjectLine;
                        var emailTemplate = require('../config/email_template.js')(
                            req.body.domain,
                            hashCode, 
                            settingsConfig.brandColor, 
                            settingsConfig.emailImage, 
                            settingsConfig.preHeader, 
                            settingsConfig.senderAddress,
                            settingsConfig.emailHeader,
                            settingsConfig.footerName,
                            settingsConfig.footerLocation
                            );
                        var content = new helper.Content(
                                "text/html", emailTemplate);
                        var mail = new helper.Mail(from, subject, to, content);

                        var request = sg.emptyRequest({
                          method: 'POST',
                          path: '/v3/mail/send',
                          body: mail.toJSON(),
                        });

                        sg.API(request, function(error, response) {
                          // Handle the response here.
                        });
                        res.end();
                    }
                });
            }
            //pass referral code to select the user who gets a referral point
            if(req.body.hashCode !== undefined){
                connection.query('SELECT emailaddress FROM emails WHERE `referralcode`=(?)', [req.body.hashCode], function(err, rows, fields) {
                    if(err) throw err;
                    var data = rows[0].emailaddress;
                    sendGrid(data);
                });
            //if no referral code used
            } else {
                sendGrid("none");
            }
        }
    });

    //checks if referral code is valid
    app.get('/api/v1/checkhash/:thisId', function(req, res) {
        var url_Id = req.param('thisId');
        connection.query('SELECT referralcode FROM emails WHERE `referralcode`=(?)',[url_Id], function(err, rows, fields){
          if(rows.length !== 0){
            res.json(200);
          } else {
            res.json(401);
          }
        });
    });

    //verifies referral code to be used by contestant
    app.get('/api/v1/verifyhash/:thisId', function(req, res) {
        var url_Id = req.param('thisId');
        connection.query('SELECT verified,referredby,emailaddress FROM emails WHERE `referralcode`=(?)',[url_Id], function(err, rows, fields){
            if(err) throw err;
            if(rows.length !== 0) {
                var referredBy = rows[0].referredby;
                var verified = rows[0].verified;
                var emailaddress = rows[0].emailaddress;
                //if not yet verified, change status to verified
                if(verified === "false") {
                    connection.query('UPDATE emails SET `verified`=(?) WHERE `referralcode`=(?)',["true", url_Id], function(err, rows, fields){
                        if(err) throw err;
                        //add email address to contact list now that it's verified
                        var addContact = sg.emptyRequest({
                          method: 'POST',
                          path: '/v3/contactdb/recipients',
                          body: [{ "email": emailaddress }]
                        });
                        sg.API(addContact, function(error, response) {
                            var recipient_Id = response.body.persisted_recipients.toString();
                            var addContactToList = sg.emptyRequest({
                              method: 'POST',
                              path: '/v3/contactdb/lists/' + adminConfig.list_Id + '/recipients/' + recipient_Id,
                            });
                            sg.API(addContactToList, function(error, response) {
                                //add response
                            });
                        });
                        //add a referral point to the contestant that referred the newly verified contestant
                        connection.query('UPDATE emails SET referrals = referrals + 1 WHERE `emailaddress`=(?)',[referredBy], function(err, rows, fields){
                            if(err) throw err;
                        });
                    });
                }
                res.json(200);
            } else {
                res.json(401);
            }
        });
    });

    //resend verification email on request
    app.post('/api/v1/resendVerificationEmail', function(req, res) {
        var email = req.body.email;
        var name = req.body.name;
        var domain = email.substring(email.lastIndexOf("@") +1);
        var hashCode = md5(name + email);
        //send verification email
        var helper = require('sendgrid').mail;
        var from = new helper.Email(settingsConfig.senderAddress);
        var to = new helper.Email(req.body.email);
        var subject = settingsConfig.subjectLine;
        var emailTemplate = require('../config/email_template.js')(
            req.body.domain,
            hashCode, 
            settingsConfig.brandColor, 
            settingsConfig.emailImage, 
            settingsConfig.preHeader, 
            settingsConfig.senderAddress,
            settingsConfig.emailHeader,
            settingsConfig.footerName,
            settingsConfig.footerLocation
            );
        var content = new helper.Content(
                "text/html", emailTemplate);
        var mail = new helper.Mail(from, subject, to, content);

        var request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON(),
        });

        sg.API(request, function(error, response) {
            //response
        });
        res.end();
    });

    //gets full list of emails entered
    app.get('/api/v1/data/', ensureAuthenticated, function(req, res) {
        connection.query(
            'SELECT emailaddress FROM emails WHERE `verified`=\'true\' ORDER BY referrals DESC, datetime ASC', 
            function(err, rows, fields){   
                if(err) throw err;
                res.json(rows);
        });
    });

    //get the rank of the contestant
    app.get('/api/v1/getrank/:thisId', function(req, res) {
        var url_Id = req.param('thisId');
            connection.query(
                'SELECT * FROM (  SELECT emailaddress, referrals, referralcode, @rownum:=@rownum + 1 as row_number FROM emails t1,' +
                '(SELECT @rownum := 0) t2 ORDER BY referrals DESC, datetime ASC) t1 WHERE `referralcode`=(?)',[url_Id], 
                function(err, rows, fields){   
                    if(err) throw err;
                    res.json(rows);
            });
    });

    //gets the number of total emails collected
    app.get('/api/v1/count/', function(req, res){
            connection.query(
                'SELECT COUNT(*) AS count FROM emails', 
                function(err, rows, fields){   
                    if(err) throw err;
                    res.json(rows);
            });
    });

    //gets the number of total emails collected that are verified
    app.get('/api/v1/countverified/', function(req, res){
            connection.query(
                'SELECT COUNT(*) AS count FROM emails WHERE `verified`=\'true\'', 
                function(err, rows, fields){   
                    if(err) throw err;
                    res.json(rows);
            });
    });

    //get the referral code of the contestant from their email address
    app.get('/api/v1/gethashbyemail', function(req, res){
        var url_Id = req.query.email;
        connection.query('SELECT referralcode, verified FROM emails WHERE `emailaddress`=(?)',[url_Id], function(err, rows, fields){
          if(rows.length !== 0 && rows[0].verified === "true"){
            res.json(rows);
          } else {
            res.json(402);
          }
        });
    });

    //get list of contestants within specified range
    app.get('/api/v1/toprange', ensureAuthenticated, function(req, res){
        var limit = settingsConfig.prizeRange;
        connection.query('SELECT emailaddress FROM emails WHERE `verified`=\'true\' ORDER BY referrals DESC, datetime ASC LIMIT ?',[limit], function(err, rows, fields){
            if (err) throw err;
            res.json(rows);
       });
    });

}
