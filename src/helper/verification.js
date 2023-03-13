const nodemailer = require("nodemailer");

let testAccount = nodemailer.createTestAccount();
const generateVerificationCode = () => {
  // Generate a random six-digit verification code
  return Math.floor(100000 + Math.random() * 900000);
};

const sendVerificationEmail = async (email, verificationCode) => {
  const nilaiPromise = new Promise((resolve, rejects) => {
    resolve(testAccount);
  });
  nilaiPromise.then((account) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.PASSWORD_EMAIL,
      },
    });
    const mailOptions = {
      from: account.user,
      to: email,
      subject: "Verifikasi Email",
      text: `Klik link berikut untuk verifikasi email: http://localhost:3000/user/verify?email=${email}&verification_code=${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email Berhasil di kirim " + info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
    });
  });
};

module.exports = { generateVerificationCode, sendVerificationEmail };
