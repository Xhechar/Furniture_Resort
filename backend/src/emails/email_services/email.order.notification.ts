
import { PrismaClient } from "@prisma/client";
import ejs from 'ejs';
import { MessageOptions } from "../../interfaces/backend.interfaces";
import { sendMail } from "../email_config/email.config";

const prisma = new PrismaClient({
  log: ["error"]
});

export const sendOrderSuccessfullEmail = async () => {
  let users = await prisma.user.findMany({
    where: {
      HasOrder: true
    },
    include: {
      Orders: {
        include: {
          Product: true
        }
      },
      CustomOrders: {
        include: {
          Product: true
        }
      }
    }
  });

  for (let user of users) {
    ejs.renderFile('../../../email_templates/order.mail.ejs', { userName: user.Fullname }, async(err, data) => {
      if (err) {
        console.log("an error occured during sending mail", err);
      }

      let messageOptions: MessageOptions = ({
        from: process.env.EMAIL as string,
        to: user.Email,
        subject: "SUCCESSFULL ORDER",
        html: data
      });

      await sendMail(messageOptions);

      let updateStatus = await prisma.user.update({
        where: {
          UserId: user.UserId
        },
        data: {
          HasOrder: true
        }
      });

      if (updateStatus == null) console.log("Email sent successfully but profile not updated.");

      console.log("Email successfully sent");
    })
  }
}