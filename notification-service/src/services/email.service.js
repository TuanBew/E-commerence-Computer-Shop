// notification-service/src/services/email.service.js

const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Compile email template with Handlebars
async function compileTemplate(templateName, data) {
  const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
  const templateSource = await fs.readFile(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);
  return template(data);
}

// Send order confirmation email
async function sendOrderConfirmation(order) {
  try {
    const html = await compileTemplate('orderConfirmation', {
      orderNumber: order.orderNumber,
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      customerName: order.shippingAddress.fullName,
      items: order.items,
      subtotal: order.subtotal.toLocaleString(),
      shipping: order.shippingFee.toLocaleString(),
      discount: order.discountAmount.toLocaleString(),
      total: order.total.toLocaleString(),
      shippingAddress: order.shippingAddress,
      loyaltyPointsEarned: order.loyaltyPointsEarned,
    });

    const mailOptions = {
      from: `"Computer Components Shop" <${process.env.EMAIL_FROM}>`,
      to: order.email,
      subject: `Order Confirmation #${order.orderNumber}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
}

// Send password reset email
async function sendPasswordReset(user, resetToken) {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const html = await compileTemplate('passwordReset', {
      name: user.fullName,
      resetUrl,
      expiryHours: 1,
    });

    const mailOptions = {
      from: `"Computer Components Shop" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

module.exports = {
  sendOrderConfirmation,
  sendPasswordReset,
};