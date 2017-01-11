# schemeBeam

Do you want your product to go viral and to build an email list of solid leads to market to directly? Do it for **free** with schemeBeam, the open source referral marketing application! 


## How It Works

1. Decide on a prize to give away. Maybe beta access to your new application for the top 50 referrers, or a free month of your subscription service to the top 10.
2. Let people know about the offer. Link them to your schemeBeam sign-up page, where they can submit their email to enter the contest.
3. Once they enter, an email will be sent to them containing their personal referral link (anyone who signs up through the link will also receive a referral link as well). They'll be asked to confirm their email address in order to participate, ensuring that you're receiving real leads for your product or service.
4. Once they confirm their email address, they'll be encouraged to share their referral link on social media and elsewhere. Every person that signs up through their link will increase their standing in the contest. They'll be able to access data about their rank via the stats page.
5. Once the campaign is finished, you'll have a list of potential customers that will automatically be added to your SendGrid contacts list, in addition to being downloadable as a CSV file via the admin panel.

All neccessary personalizations of the app are centralized into a single configuration file, making it quick and easy to set up.


## Installation and Setup

1. Spin up your MySQL server
2. Create a new database named "schemeBeam"
3. In the command prompt, enter `mysql -u [your username] -p schemeBeam < schemeBeamDB.sql` to import the database structure
4. Add your MySQL credentials to the adminconfig.js file
5. Run `npm install`
6. You'll need to create a SendGrid account. The first 12,000 emails sent are absolutely free. Go to the settings tab and click on "API Keys". Create a general API key and paste it into adminConfig.js (remember to use the actual API key and not the API key ID, happens to everyone)
6. Change the admin credentials in adminconfig.js, and customize your app settings in settingsconfig.js
7. Open localhost in your browser


## License

The code, documentation, non-branded copy and configuration are released under
the MIT license.