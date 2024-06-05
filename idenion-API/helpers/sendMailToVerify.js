const nodemailer = require("nodemailer");

const sendMailToVerify = async (email, token) => {
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"moheetshendarkar@gmail.com',
    to: email,
    subject: "Idenion - Login",
    html: `<div><h2>Please Click the below link to Verify.</h2><p>It will be active for the next 1 hour</p><a href="http://localhost:5000/api/v1/auth/verify/${token}">Verify</a></div>`,
  });
};
module.exports = sendMailToVerify;
