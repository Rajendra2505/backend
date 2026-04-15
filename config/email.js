const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: "rajendraprasad0525@gmail.com", 
    pass: "rvig iadj yjwe wcwz" 
  }
});

module.exports = transporter;
