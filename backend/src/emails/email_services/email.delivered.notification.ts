
import { PrismaClient } from "@prisma/client";
import ejs from "ejs";
import { MessageOptions } from "../../interfaces/backend.interfaces";
import { sendMail } from "../email_config/email.config";

const prisma = new PrismaClient({
  log: ["error"]
});

const deliveredOrderMails = async () => {
  
  let orders = await prisma.order.findMany({
    where: {
      DeliveryStatus: 'delivered',
      DeliveryMailSent: false
    },
    include: {
      User: true,
      Product: true
    }
  });

  if (orders.length == 0) console.log("Emails sent for all products delivered");
  
  for (let order of orders) {
    ejs.renderFile('../../../email_templates/delivery.mail.ejs', { UserName: order.User.Fullname, productName: order.Product.ProductName }, async(err, data) => {
      if (err) console.log("An error occured during sending mail.");

      let messageOptions: MessageOptions = {
        from: process.env.EMAIL as string,
        to: order.User.Email,
        subject: "Product Delivered",
        html: data
      };

      await sendMail(messageOptions);

      let update = await prisma.order.update({
        where: {
          OrderId: order.OrderId
        },
        data: {
          DeliveryMailSent: true
        }
      });

      update == null ? console.log("Email sent successfully but unable to update email delivered status") :
        console.log("Email successfully sent.");
    });
  };
}

const deliveredCustomOrderMails = async () => {
  
  let orders = await prisma.customOrder.findMany({
    where: {
      DeliveryStatus: 'delivered',
      DeliveryMailSent: false
    },
    include: {
      User: true,
      Product: true
    }
  });

  if (orders.length == 0) console.log("Emails sent for all products delivered");
  
  for (let order of orders) {
    ejs.renderFile('../../../email_templates/delivery.mail.ejs', { UserName: order.User.Fullname, productName: order.Product.ProductName }, async (err, data) => {
      if (err) console.log("An error occured during sending mail.");

      let messageOptions: MessageOptions = {
        from: process.env.EMAIL as string,
        to: order.User.Email,
        subject: "Product Delivered",
        html: data
      };

      await sendMail(messageOptions);

      let update = await prisma.order.update({
        where: {
          OrderId: order.CustomOrderId
        },
        data: {
          DeliveryMailSent: true
        }
      });

      update == null ? console.log("Email sent successfully but unable to update email delivered status") :
        console.log("Email successfully sent.");
    });
  };
}