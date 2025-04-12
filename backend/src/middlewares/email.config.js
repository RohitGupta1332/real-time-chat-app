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
            background-color: #f4f4f4;
            padding: 30px;
          }
          .container {
            max-width: 500px;
            margin: auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .code {
            font-size: 24px;
            font-weight: bold;
            color: #2b6cb0;
            background: #edf2f7;
            padding: 12px 20px;
            border-radius: 6px;
            display: inline-block;
            margin: 20px 0;
            letter-spacing: 2px;
          }
          .footer {
            font-size: 12px;
            color: #888;
            margin-top: 30px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Email Verification Code</h2>
          <p>Hello,</p>
          <p>Thank you for signing up! Please use the verification code below to verify your email address:</p>
    
          <div class="code">${verificationCode}</div>
    
          <p>This code is valid for the next 15 minutes.</p>
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
            from: '"Rohit" <itzrg31052004@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify your Email", // Subject line
            text: "Verify your Email", // plain text body
            html : Tempelate
        });
      
    } catch (error) {
          console.log("Email error", error);
    }
};
