import { MailConfigurations, MessageOptions } from "../../interfaces/backend.interfaces";
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

let mailConfigurations: MailConfigurations = ({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.PASS as string
  }
});

const createTransporter = (configurations: MailConfigurations) => {
  return nodemailer.createTransport(configurations);
};

export const sendMail = async (messageOptions: MessageOptions) => {
  
  try {
    const transporter = createTransporter(mailConfigurations);

    await transporter.verify();

    transporter.sendMail(messageOptions, (err, info) => {
      if (err) {
        console.log("An error occured during sending mails, Error: " + err);
      } else {
        console.log("Emails passed successfully" + info.response);
      }
    })
  } catch (error) {
    console.log(`Error occured in sending email, Error: ${error}`);
  }

}