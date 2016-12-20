var md5 = require('md5');
var sg = require('sendgrid')(SENDGRID_API_KEY);


module.exports = function(app, connection) {

    //add email address to database, create a verification code, and send verification link to email address
    app.post('/api/v1/newemail', function(req, res) {
        // regex on both client and server side for protection in case JS is augmented
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(req.body.email)) {
            res.json('Email address is not valid!');
        } else {
            var email = req.body.email;
            var name = email.substring(0, email.lastIndexOf("@"));
            var domain = email.substring(email.lastIndexOf("@") +1);
            var hashCode = md5(name + domain);
            //send verification email
            function sendGrid(referredBy){
                connection.query('INSERT INTO emails (emailaddress, referralcode, referredby) VALUES (?, ?, ?)', [req.body.email, hashCode, referredBy], function(err, rows, fields) {
                    if (err) {
                        res.json(401);
                    } else {
                        //send verification email
                        var helper = require('sendgrid').mail;
                        var from = new helper.Email("schemeBeam@schemeBeam.com");
                        var to = new helper.Email(req.body.email);
                        var subject = "subject here";
                        var content = new helper.Content(
                                "text/html", "<h1>Your referral link:</h1> <h2>" + req.body.domain + "/#/" + hashCode + "</h2>" +
                                "<div><a href=\"" + req.body.domain + "/#/verify/" + hashCode + "\">Click here</a> to activate your referral link and to get started sharing with your contacts! Good luck!</div>" +
                                "<br><div>If you would like to check on your position in the referral contest, <a href=\"" + req.body.domain + "/#/stats/" + hashCode + "\">click here.</a></div>");
                        var mail = new helper.Mail(from, subject, to, content);

                        var sg = require('sendgrid')(SENDGRID_API_KEY);

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
                          // Handle the response here.
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

    //gets full list of emails entered
    app.get('/api/v1/data/', function(req, res) {
        connection.query(
            'SELECT * FROM emails ORDER BY referrals DESC, datetime ASC', 
            function(err, rows, fields){   
                if(err) throw err;
                res.json(rows);
        });
    });

    //get the rank of the contestant
    app.get('/api/v1/getrank/:thisId', function(req, res) {
        var url_Id = req.param('thisId');
        console.log(url_Id);
            connection.query(
                'SELECT * FROM (  SELECT emailaddress, referrals, referralcode, @rownum:=@rownum + 1 as row_number FROM emails t1,' +
                '(SELECT @rownum := 0) t2 ORDER BY referrals DESC, datetime ASC) t1 WHERE `referralcode`=(?)',[url_Id], 
                function(err, rows, fields){   
                    if(err) throw err;
                    res.json(rows);
            });
    });

    //gets configuration data for campaign
    app.get('/api/v1/config/', function(req, res) {
            connection.query(
                'SELECT * FROM config', 
                function(err, rows, fields){   
                    if(err) throw err;
                    res.json(rows);
            });
    });

    //gets the number of total emails collected
    app.get('/api/v1/count/', function(req, res) {
            connection.query(
                'SELECT COUNT(*) AS count FROM emails', 
                function(err, rows, fields){   
                    if(err) throw err;
                    res.json(rows);
            });
    });

    //get the referral code of the contestant from their email address
    app.get('/api/v1/gethashbyemail', function(req, res) {
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
    app.get('/api/v1/toprange', function(req, res){
        var limit = 3;
        connection.query('SELECT emailaddress FROM emails ORDER BY referrals DESC, datetime ASC LIMIT ?',[limit], function(err, rows, fields){
            if (err) throw err;
            res.json(rows);
       });
    });

}
