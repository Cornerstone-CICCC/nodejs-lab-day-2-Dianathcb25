import { Router, Request, Response } from 'express';
import userModel from '../models/user.model';

const pageRouter = Router();

pageRouter.get('/', (req: Request, res: Response) => {
  res.status(200).send('Home');
});

pageRouter.get('/auth-check', (req: Request, res: Response) => {
  const { username, isLoggedIn } = req.cookies;

  if (!isLoggedIn || !username) {
    res.status(401).json({ error: 'You are not authorized.' });
    return;
  }
  const user = userModel.findByUsername(username);

  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }
  res.status(200).json({
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
  });
});

pageRouter.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('isLoggedIn');
  res.clearCookie('username');
  res.status(200).send('Logged out!');
});

export default pageRouter;
