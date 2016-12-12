var md5 = require('md5');


module.exports = function(app, connection) {

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
            connection.query('SELECT emailaddress FROM emails WHERE `referralcode`=(?)', [req.body.hashCode], function(err, rows, fields) {
                if(err) throw err;
                var referredBy = rows[0].emailaddress;
                connection.query('INSERT INTO emails (emailaddress, referralcode, referredby) VALUES (?, ?, ?)', [req.body.email, hashCode, referredBy], function(err, rows, fields) {
                    if (err) {
                        res.status(401);
                    } else {
                        var helper = require('sendgrid').mail;
                        var from = new helper.Email("schemeBeam@schemeBeam.com");
                        var to = new helper.Email(req.body.email);
                        var subject = "subject here";
                        var content = new helper.Content(
                                "text/html", "<h1>Your referral link:</h1> <h2>" + req.body.domain + "/" + hashCode + "</h2>" +
                                "<div>Click here to activate your referral link and get to started sharing with your friends! Good luck!</div>");
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
                            });
                        }
                        sendMessage();
                    }
                });
            });

        }
        res.end();
    });

    app.get('/api/v1/checkhash/:thisId', function(req, res) {
        var url_Id = req.param('thisId');
        connection.query('SELECT referralcode FROM emails WHERE `referralcode`=(?)',[url_Id], function(err, rows, fields){
          if(rows.length !== 0){
            res.json(200);
          } else {
            res.json(401);
          }
        res.end();
        });
    });

    app.get('/api/v1/verifyhash/:thisId', function(req, res) {
        var url_Id = req.param('thisId');
        connection.query('UPDATE emails SET `verified`=(?) WHERE `referralcode`=(?)',["true", url_Id], function(err, rows, fields){
          if(err) throw err;
          connection.query('SELECT referredby FROM emails WHERE `referralcode`=(?)',[url_Id], function(err, rows, fields){
            if(err) throw err;
            var referredBy = rows[0].referredby;
            connection.query('UPDATE emails SET referrals = referrals + 1 WHERE `emailaddress`=(?)',[referredBy], function(err, rows, fields){
                if(err) throw err;
            });
          });
        res.end();
        });
    });


}
