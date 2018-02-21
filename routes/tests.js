var settingsConfig = require('../config/settingsconfig.js');

module.exports = function(app, connection) {
   app.get('/tests/email', function(req, res) {
        var emailTemplate = require('../config/email_template.js')(
            req.protocol,
            req.body.domain,
            null, 
            settingsConfig.brandColor, 
            settingsConfig.emailImage, 
            settingsConfig.preHeader, 
            settingsConfig.senderAddress,
            settingsConfig.emailHeader,
            settingsConfig.footerName,
            settingsConfig.footerLocation
            );
        res.send(emailTemplate);
    });
}
