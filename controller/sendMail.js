const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require('dotenv').config();

const nodemailer = require('nodemailer');

const OAuth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET
)

OAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

const accessToken = OAuth2Client.getAccessToken()

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
         type: "OAuth2",
         user: process.env.EMAIL, 
         clientId: process.env.OAUTH_CLIENT_ID,
         clientSecret: process.env.OAUTH_CLIENT_SECRET,
         refreshToken: process.env.REFRESH_TOKEN,
         accessToken: accessToken //access token variable we defined earlier
}});

function sendMail(email, token) {
    let mailOptions = {
        from: process.env.EMAIL,
        to: email, 
        subject: 'Reaconnect project - Verify your email address',
        html: `<h4>Hello,</h4>
                <h4>Follow this link to verify your account: </h4>
                <a href = "https://reaconnect.herokuapp.com/api/verify/${token}" target = "_blank">https://reaconnect.herokuapp.com/api/verify/${token}</a>
                <h4>Note: This link wiil expire after 24 hours. If after 24 hours you haven't verified your account, please re-register to receive a new activation link</h4>
                <h4>If you didn't ask to verify this address, you can ignore this email</h4>
                <h4>Thanks</h4>
                <h4>Reaconnect project</h4>`
    };
    transport.sendMail(mailOptions, (err, data) => {
        if (err) {
            return console.log(err);
        }
    });
}

module.exports = sendMail;