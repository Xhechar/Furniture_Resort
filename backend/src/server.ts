import express, { json, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { sendOrderSuccessfullEmail } from './emails/email_services/email.order.notification';
import { sendTerminatedAccountsMails } from './emails/email_services/email.delete.notification';
import { welcomeUser } from './emails/email_services/email.welcome.user';

const app = express();

app.use(json());
app.use(cors());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({
    err: err.message
  })
});

app.listen(3000, () => {
  "Server is running on port 3000"
});

const email = express();

email.listen(3001, () => {
  cron.schedule("*/5 * * * * *", () => {
    console.log("Checking database ...");

    welcomeUser();
    deliveredOrderMails();
    deliveredOrderMails();
    sendOrderSuccessfullEmail();
    sendTerminatedAccountsMails();
  })
})

function deliveredOrderMails() {
  throw new Error('Function not implemented.');
}
