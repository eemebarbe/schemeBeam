module.exports = function(app, connection) {

    app.post('/api/v1/newemail', function(req, res) {
        // regex on both client and server side for protection in case JS is augmented
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(req.body.email)) {
            res.json('Email address is not valid!');
        } else {
            connection.query('INSERT INTO emails (emailaddress) VALUES (?)', [req.body.email], function(err, rows, fields) {
                if (err) {
                    res.status(401);
                }
            });
        }
        res.end();
    });

}