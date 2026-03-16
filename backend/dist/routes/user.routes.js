"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const userRouter = (0, express_1.Router)();
userRouter.post('/login', user_controller_1.default.logInUser);
userRouter.get('/', user_controller_1.default.getAllUsers);
userRouter.get('/:id', user_controller_1.default.getUserByID);
userRouter.post('/', user_controller_1.default.addUser);
userRouter.put('/:id', user_controller_1.default.updateUserById);
userRouter.delete('/:id', user_controller_1.default.deleteUserById);
exports.default = userRouter;
