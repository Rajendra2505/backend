const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateInvoice = (order, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    
    doc.fontSize(20).text("Amazon Clone Pvt Ltd", { align: "center" });
    doc.fontSize(12).text("GSTIN: 29ABCDE1234F1Z5", { align: "center" });
    doc.text("Bangalore, India", { align: "center" });

    doc.moveDown(2);

    
    doc.fontSize(16).text("GST INVOICE", { align: "center" });
    doc.moveDown();

    
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Customer: ${order.shippingAddress.fullName}`);
    doc.text(`Email: ${order.email}`);

    doc.moveDown();

    
    doc.text("Products:");
    doc.moveDown(0.5);

    order.products.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.product.name} - ₹${item.product.price} x ${item.quantity} = ₹${item.product.price * item.quantity}`
      );
    });

    doc.moveDown();

    
    doc.text(`Subtotal: ₹${order.totalPrice}`);

    const gst = Math.round(order.totalPrice * 0.18);
    const finalTotal = order.totalPrice + gst;

    doc.text(`GST (18%): ₹${gst}`);
    doc.text(`Total Amount: ₹${finalTotal}`);

    doc.moveDown();
    doc.text("Thank you for shopping!", { align: "center" });

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

module.exports = generateInvoice;