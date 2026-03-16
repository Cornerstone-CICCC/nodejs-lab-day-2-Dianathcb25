import { Request, Response } from 'express';
import userModel from '../models/user.model';
import { User } from '../types/user.types';
import zxcvbn from 'zxcvbn';
import { error } from 'console';

const getAllUsers = (req: Request, res: Response) => {
  const users = userModel.findAll();
  res.status(200).json(users);
};

const getUserByID = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const user = userModel.findById(id);
  if (!user) {
    res.status(500).json({
      error: 'User not found!',
    });
    return;
  }
  res.status(200).json(user);
};

const addUser = async (
  req: Request<{}, {}, Omit<User, 'id'>>,
  res: Response,
) => {
  const { firstname, lastname, username, password } = req.body;
  if (
    !firstname.trim() ||
    !lastname.trim() ||
    !username.trim() ||
    !password.trim()
  ) {
    res.status(400).json({
      error: 'All fields are required.',
    });
    return;
  }

  const passwordScore = zxcvbn(password).score;
  if (passwordScore <= 2) {
    res.status(400).json({
      error: 'Password is to weak!',
    });
    return;
  }

  const newUser: User | null = await userModel.add(
    firstname,
    lastname,
    username,
    password,
  );
  if (!newUser) {
    res.status(500).json({
      error: 'Username is taken!',
    });
    return;
  }

  res.cookie('isLoggedIn', 'true', {
    maxAge: 10 * 60 * 1000,
    httpOnly: true,
  });
  res.cookie('username', newUser.username, { httpOnly: true });
  res.status(201).json(newUser);
};

const updateUserById = async (
  req: Request<{ id: string }, {}, Partial<User>>,
  res: Response,
) => {
  const { id } = req.params;
  const { firstname, lastname, username, password } = req.body;
  const updatedFields = { firstname, lastname, username, password };
  const hasEmptyField = Object.entries(updatedFields).some(
    ([key, value]) => value !== undefined && !String(value).trim(),
  );
  if (hasEmptyField) {
    res.status(400).json({ error: 'Fields cannot be empty. ' });
    return;
  }

  if (password) {
    const passwordScore = zxcvbn(password).score;
    if (passwordScore <= 2) {
      res.status(400).json({
        error: 'Password is too weak!',
      });
      return;
    }
  }

  const user = await userModel.update(id, {
    firstname: req.body.firstname ?? undefined,
    lastname: req.body.lastname ?? undefined,
    username: req.body.username ?? undefined,
    password: req.body.password ?? undefined,
  });
  if (user === null) {
    res.status(404).json({
      error: 'User not found!',
    });
    return;
  }
  if (user === 'taken') {
    res.status(409).json({ error: 'This username is already taken!' });
    return;
  }

  if (username) {
    res.cookie('username', user.username, { httpOnly: true });
  }
  res.status(200).json(user);
};

const logInUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username?.trim() || !password?.trim()) {
    res.status(400).json({ error: 'Username and password are required.' });
    return;
  }

  const user = await userModel.login(username, password);
  if (!user) {
    res.status(401).json({ error: 'Incorrect username or password.' });
    return;
  }
  res.cookie('isLoggedIn', 'true', { httpOnly: true, maxAge: 30 * 60 * 1000 });
  res.cookie('username', user.username, { httpOnly: true });
  res.status(200).json(user);
};

const deleteUserById = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const isDeleted = userModel.deleteById(id);
  res.status(200).json({
    isSucces: isDeleted,
  });
};

export default {
  getAllUsers,
  getUserByID,
  addUser,
  updateUserById,
  logInUser,
  deleteUserById,
};
