const nodemailer = require("nodemailer");
exports.sendEmail = async (options) => {
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   auth: {
  //     user: process.env.SMTP_MAIL,
  //     pass: process.env.SMTP_PASS,
  //   },
  // });
  var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "382e3bf99d1bbc",
        pass: "438cd359af88b9"
      }
    });
  const mailOptions = {
    from: "gurupalsingh83@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};
