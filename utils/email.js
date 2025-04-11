// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'devanshbhardwaj1919@gmail.com',
    pass: 'your_app_password', // Use app-specific password if 2FA is on
  },
});

const sendOrderCompletedMail = async (userEmail, order) => {
  await transporter.sendMail({
    from: '"Smart Canteen" <devanshbhardwaj1919@gmail.com>',
    to: userEmail,
    subject: 'Your Order is Ready for Pickup 🍱',
    html: `
      <h2>Hello!</h2>
      <p>Your order for <strong>${order.itemName}</strong> has been completed.</p>
      <p><strong>Pickup Code:</strong> ${order.uniqueCode}</p>
      <p>Please collect your food from the canteen counter.</p>
      <p>Thank you for using Smart Canteen!</p>
    `,
  });
};

module.exports = { sendOrderCompletedMail };
