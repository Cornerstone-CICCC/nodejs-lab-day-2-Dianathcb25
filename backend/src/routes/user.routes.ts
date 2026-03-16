import { Router } from 'express';
import userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/login', userController.logInUser);
userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUserByID);
userRouter.post('/', userController.addUser);
userRouter.put('/:id', userController.updateUserById);
userRouter.delete('/:id', userController.deleteUserById);

export default userRouter;
