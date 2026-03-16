"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const zxcvbn_1 = __importDefault(require("zxcvbn"));
const getAllUsers = (req, res) => {
    const users = user_model_1.default.findAll();
    res.status(200).json(users);
};
const getUserByID = (req, res) => {
    const { id } = req.params;
    const user = user_model_1.default.findById(id);
    if (!user) {
        res.status(500).json({
            error: 'User not found!',
        });
        return;
    }
    res.status(200).json(user);
};
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, username, password } = req.body;
    if (!firstname.trim() ||
        !lastname.trim() ||
        !username.trim() ||
        !password.trim()) {
        res.status(400).json({
            error: 'All fields are required.',
        });
        return;
    }
    const passwordScore = (0, zxcvbn_1.default)(password).score;
    if (passwordScore <= 2) {
        res.status(400).json({
            error: 'Password is to weak!',
        });
        return;
    }
    const newUser = yield user_model_1.default.add(firstname, lastname, username, password);
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
});
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { id } = req.params;
    const { firstname, lastname, username, password } = req.body;
    const updatedFields = { firstname, lastname, username, password };
    const hasEmptyField = Object.entries(updatedFields).some(([key, value]) => value !== undefined && !String(value).trim());
    if (hasEmptyField) {
        res.status(400).json({ error: 'Fields cannot be empty. ' });
        return;
    }
    if (password) {
        const passwordScore = (0, zxcvbn_1.default)(password).score;
        if (passwordScore <= 2) {
            res.status(400).json({
                error: 'Password is too weak!',
            });
            return;
        }
    }
    const user = yield user_model_1.default.update(id, {
        firstname: (_a = req.body.firstname) !== null && _a !== void 0 ? _a : undefined,
        lastname: (_b = req.body.lastname) !== null && _b !== void 0 ? _b : undefined,
        username: (_c = req.body.username) !== null && _c !== void 0 ? _c : undefined,
        password: (_d = req.body.password) !== null && _d !== void 0 ? _d : undefined,
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
});
const logInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!(username === null || username === void 0 ? void 0 : username.trim()) || !(password === null || password === void 0 ? void 0 : password.trim())) {
        res.status(400).json({ error: 'Username and password are required.' });
        return;
    }
    const user = yield user_model_1.default.login(username, password);
    if (!user) {
        res.status(401).json({ error: 'Incorrect username or password.' });
        return;
    }
    res.cookie('isLoggedIn', 'true', { httpOnly: true, maxAge: 30 * 60 * 1000 });
    res.cookie('username', user.username, { httpOnly: true });
    res.status(200).json(user);
});
const deleteUserById = (req, res) => {
    const { id } = req.params;
    const isDeleted = user_model_1.default.deleteById(id);
    res.status(200).json({
        isSucces: isDeleted,
    });
};
exports.default = {
    getAllUsers,
    getUserByID,
    addUser,
    updateUserById,
    logInUser,
    deleteUserById,
};
