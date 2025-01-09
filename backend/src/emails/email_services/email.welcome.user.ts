import { PrismaClient } from "@prisma/client";
import ejs from 'ejs';
import { MessageOptions } from "../../interfaces/backend.interfaces";
import { sendMail } from "../email_config/email.config";

let prisma = new PrismaClient({
  log: ["error"]
});

export const welcomeUser = async () => {
  let users = await prisma.user.findMany({
    where: {
      IsWelcomed: false
    }
  });

  if(users.length == 0) console.log("All users have recieved their welcome mails");
  
  for (let user of users) {
    try {
      ejs.renderFile('../../../email_templates/welcome.user.ejs', {UserName: user.Fullname.split(' ')[0]}, async (err, data) => {
      if (err) {
        console.log(`An error occured, during sending mail to ${user.Fullname}`, err);
      } else {

        let messageOptions: MessageOptions = ({
          from: process.env.EMAIL as string,
          to: user.Email,
          subject: 'Welcome to Furnitures!',
          html: data
        });

        await sendMail(messageOptions);

        let success = await prisma.user.update({
          where: {
            UserId: user.UserId
          },
          data: {
            IsWelcomed: true
          }
        });

        if (success) {
          console.log(`Welcome mail sent successfully to ${user.Fullname}`);
        } else {
          console.log(`Failed to send welcome mail to ${user.Fullname}`);
        }
      }
    });
    } catch (error) {
      console.log(`An error occured, during sending mail to ${user.Fullname}`, error);
    }
  }
}