const { Resend } = require("resend");
const fs = require("fs");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, filePathOrMessage) => {

  try {

    let emailOptions = {

      from: "onboarding@resend.dev",

      to: email,

      subject: "Amazon Order Update"
    };

    if (typeof filePathOrMessage === "string" &&
        filePathOrMessage.endsWith(".pdf")) {

      const pdfBuffer = fs.readFileSync(filePathOrMessage);

      emailOptions.html = `
        <h2>Order Placed Successfully</h2>
        <p>Your invoice is attached.</p>
      `;

      emailOptions.attachments = [
        {
          filename: "invoice.pdf",
          content: pdfBuffer
        }
      ];

    } else {

      emailOptions.html = `
        <h2>${filePathOrMessage}</h2>
      `;
    }

    await resend.emails.send(emailOptions);

    console.log("Email sent");

  } catch (error) {

    console.log(error);
  }
};

module.exports = sendEmail;