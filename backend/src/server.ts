import express, { json, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cron from 'node-cron';
import cookieParser from 'cookie-parser';
import { sendOrderSuccessfullEmail } from './emails/email_services/email.order.notification';
import { sendTerminatedAccountsMails } from './emails/email_services/email.delete.notification';
import { welcomeUser } from './emails/email_services/email.welcome.user';
import { authRouter } from './routers/auth.routes';
import { cartRouter } from './routers/cart.routes';
import { categoryRouter } from './routers/category.routes';
import { cOrderRouter } from './routers/custom.order.routes';
import { messageRouter } from './routers/messages.routes';
import { orderRouter } from './routers/order.routes';
import { pqtRouter } from './routers/pqt.routes';
import { productRouter } from './routers/products.routes';
import { progressRouter } from './routers/progress.routes';
import { reviewRouter } from './routers/reviews.routes';
import { userRouter } from './routers/user.routes';
import { wishlistRouter } from './routers/wishlist.routes';

const app = express();

app.use(json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/cart', cartRouter);
app.use('/category', categoryRouter);
app.use('/custom-order', cOrderRouter);
app.use('/messqges', messageRouter);
app.use('/order', orderRouter);
app.use('/pqt', pqtRouter);
app.use('/products', productRouter);
app.use('/progress', progressRouter);
app.use('/reviews', reviewRouter);
app.use('/user', userRouter);
app.use('/wishlist', wishlistRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({
    error: err.message
  })
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// const email = express();

// email.listen(3001, () => {
//   cron.schedule("*/5 * * * * *", () => {
//     console.log("Checking database ...");

//     welcomeUser();
//     deliveredOrderMails();
//     deliveredOrderMails();
//     sendOrderSuccessfullEmail();
//     sendTerminatedAccountsMails();
//   })
// })

// function deliveredOrderMails() {
//   throw new Error('Function not implemented.');
// }
