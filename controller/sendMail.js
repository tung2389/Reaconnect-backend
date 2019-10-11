require('dotenv').config();

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

function sendMail(email) {
    let mailOptions = {
        from: process.env.EMAIL,
        to: email, 
        subject: 'Nodemailer - Test',
        text: 'Wooohooo it works!!'
    };
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return console.log(err);
        }
        console.log("Successfully sent")
    });
}

module.exports = sendMail;