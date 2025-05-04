import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "itzrg31052004@gmail.com",
    pass: "quku uwek lpxe xmes",
  },
});

export const sendVerificationMail = async (email, verificationCode) => {

  const Tempelate = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #1a202c;
        color: #e2e8f0;
        padding: 30px;
        margin: 0;
      }
      .container {
        max-width: 500px;
        margin: 0 auto;
        background-color: #2d3748;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      }
      h2 {
        color: #a3bffa;
        margin-top: 0;
      }
      p {
        color: #e2e8f0;
      }
      .code {
        font-size: 24px;
        font-weight: bold;
        color: #a3bffa;
        background: #4a5568;
        padding: 12px 20px;
        border-radius: 6px;
        display: inline-block;
        margin: 20px 0;
        letter-spacing: 2px;
      }
      .verify-button {
        background-color: #7b5af0; /* Explicitly set to purple to match website */
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        font-size: 16px;
        text-decoration: none;
        display: inline-block;
      }
      .verify-button:hover {
        background-color: #6b46c1; /* Darker purple on hover */
      }
      .footer {
        font-size: 12px;
        color: #a0aec0;
        margin-top: 30px;
        text-align: right;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Email Verification Code</h2>
      <p>Hello,</p>
      <p>Thank you for signing up! Please use the verification code below to verify your email address:</p>

      <div class="code">${verificationCode}</div> <!-- Example code -->

      <p>This code is valid for the next 5 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>

      <div class="footer">
        <p>— LockChat Team</p>
      </div>
    </div>
  </body>
</html>
    `;

  try {
    const info = await transporter.sendMail({
      from: '"LockTalk" <itzrg31052004@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Verify your Email", // Subject line
      text: "Verify your Email", // plain text body
      html: Tempelate
    });

  } catch (error) {
    console.error("Email error", error);
  }
};
