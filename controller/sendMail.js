require('dotenv').config();

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

function sendMail(email, token) {
    let mailOptions = {
        from: process.env.EMAIL,
        to: email, 
        subject: 'Windlife project - Verify your email address',
        html: `<h4>Hello,</h4>
                <h4>Follow this link to verify your account: </h4>
                <a href = "https://windlife.herokuapp.com/api/verify/${token}" target = "_blank">https://windlife.herokuapp.com/api/verify/${token}</a>
                <h4>Note: This link wiil expire after 24 hours. If after 24 hours you haven't verified your account, please re-register to receive a new activation link</h4>
                <h4>If you didn't ask to verify this address, you can ignore this email</h4>
                <h4>Thanks</h4>
                <h4>Windlife project</h4>`
    };
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return console.log(err);
        }
    });
}

module.exports = sendMail;