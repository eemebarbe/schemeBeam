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
            connection.query('INSERT INTO emails (emailaddress, referralcode) VALUES (?, ?)', [req.body.email, hashCode], function(err, rows, fields) {
                if (err) {
                    res.status(401);
                }
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


}