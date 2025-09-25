// import nodemailer from 'nodemailer';

// // Configure transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD
//   }
// });

// // Generate a random 6-digit OTP
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Send verification email with OTP
// const sendVerificationEmail = async (email, otp) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_USERNAME,
//       to: email,
//       subject: 'Email Verification OTP',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <h2 style="color: #333;">Verify Your Email</h2>
//           <p>Thank you for registering with our service. Please use the following OTP to verify your email address:</p>
//           <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
//             ${otp}
//           </div>
//           <p>This OTP will expire in 10 minutes.</p>
//           <p>If you didn't request this verification, please ignore this email.</p>
//         </div>
//       `
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent: ' + info.response);
//     return true;
//   } catch (error) {
//     console.error('Error sending email: ', error);
//     return false;
//   }
// };

// export { generateOTP, sendVerificationEmail };

import nodemailer from 'nodemailer';

// Configure transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  },
  // Add these options for better security and reliability
  tls: {
    rejectUnauthorized: false // Helps with self-signed certificates
  },
  secure: true // Use SSL
});

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email with OTP
const sendVerificationEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p>Thank you for registering with our service. Please use the following OTP to verify your email address:</p>
          <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email: ', error);
    return false;
  }
};

export { generateOTP, sendVerificationEmail };