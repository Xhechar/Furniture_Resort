import express, { json, NextFunction, Request, Response } from 'express';
import cors from 'cors';

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