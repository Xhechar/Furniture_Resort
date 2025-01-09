import { PrismaClient } from "@prisma/client";
import { MessageOptions } from "../../interfaces/backend.interfaces";
import ejs from "ejs";
import { sendMail } from "../email_config/email.config";
import { update } from "lodash";

let prisma = new PrismaClient({
  log: ["error"]
});

export const sendTerminatedAccountsMails = async () => {
  let users = await prisma.user.findMany({
    where: {
      IsDeleted: true,
      HasWishList: false
    }
  });

  if (users.length == 0) console.log("All users have terminated their accounts");
  
  for (let user of users) {
    ejs.renderFile('../../../email_templates/deleted.account.mails.ejs', { user_name: user.Fullname, FurnitureMail: process.env.EMAIL as string }, async (err, data) => {
      if (err) {
        console.log("An error occured during sending mail.", err);
      } else {
          let messageOptions: MessageOptions = ({
            from: process.env.EMAIL as string,
            to: user.Email,
            subject: 'ACCOUNT TERMINATED.',
            html: data
          });

          await sendMail(messageOptions);
          
          let success = await prisma.user.update({
            where: {
              UserId: user.UserId
            },
            data: {
              HasWishList: true
            }
          });

          if (success) {
            console.log(`Deleted email sent for ${user.Email}`);
          } else {
            console.log(`Error sending deletion of account mail to ${user.Email}`);
          }
    
          console.log(`Email sent to ${user.Email}`);
        }
    });
  }
}