"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = __importDefault(require("../models/user.model"));
const pageRouter = (0, express_1.Router)();
pageRouter.get('/', (req, res) => {
    res.status(200).send('Home');
});
pageRouter.get('/auth-check', (req, res) => {
    const { username, isLoggedIn } = req.cookies;
    if (!isLoggedIn || !username) {
        res.status(401).json({ error: 'You are not authorized.' });
        return;
    }
    const user = user_model_1.default.findByUsername(username);
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
pageRouter.get('/logout', (req, res) => {
    res.clearCookie('isLoggedIn');
    res.clearCookie('username');
    res.status(200).send('Logged out!');
});
exports.default = pageRouter;
