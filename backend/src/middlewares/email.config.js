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
    try {
        const info = await transporter.sendMail({
            from: '"Rohit" <itzrg31052004@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify your Email", // Subject line
            text: "Verify your Email", // plain text body
            html: `<b>${verificationCode}</b>`, // html body
        });
      
        console.log("Message sent: ", info.messageId);
    } catch (error) {
          console.log("Email error", error);
    }
};
