import nodemailer from "nodemailer";
import config from "../../config";


const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"FOOD HEAVEN 👻" <smmubasshiralkasshaf15@hmail.com>',
    to: email,
    subject: "RESET PASSWORD LINK ✔",
    // text: "Hello world?",
    html,
  });
};

export default emailSender;
