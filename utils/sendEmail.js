const nodemailer = require("nodemailer");

const sendEmail = async(to,filepath)=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        },
    });
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        subject:"order invoice",
        text:"your order has been placed successfully.invoice attached.",
        attachments:[
            {
                filename:"invoice.pdf",
                path:filepath,
            },
        ],
    });
};
module.exports = sendEmail;