const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: "rajendraprasad0525@gmail.com", 
    pass: "rvig iadj yjwe wcwz" 
  }
});

module.exports = transporter;
