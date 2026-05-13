const { Resend } = require("resend");
const fs = require("fs");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, filePath) => {

  try {

    const pdfBuffer = fs.readFileSync(filePath);

    await resend.emails.send({

      from: "onboarding@resend.dev",

      to: email,

      subject: "Amazon Order Invoice",

      html: `
        <h2>Order Placed Successfully</h2>
        <p>Your invoice PDF is attached.</p>
      `,

      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer
        }
      ]

    });

    console.log("Email sent successfully");

  } catch (error) {

    console.log(error);
  }
};

module.exports = sendEmail;