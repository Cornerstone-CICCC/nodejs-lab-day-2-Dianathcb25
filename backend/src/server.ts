// Create your server
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import pageRouter from './routes/page.routes';
import userRouter from './routes/user.routes';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:4321'],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use('/users', userRouter);
app.use('/', pageRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send('Invalid route.');
});

const PORT = process.env.PORT;
if (!PORT) {
  throw new Error('Missing port!');
}
app.listen(PORT, () => {
  console.log(`Server is runing on http://localhost:${PORT} `);
});
