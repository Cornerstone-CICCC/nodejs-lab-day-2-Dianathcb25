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
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserModel {
    constructor() {
        this.users = [];
    }
    findAll() {
        return this.users;
    }
    findById(id) {
        return this.users.find((u) => u.id === id);
    }
    findByUsername(username) {
        return this.users.find((u) => u.username.toLocaleLowerCase() === username.toLocaleLowerCase());
    }
    add(firstname, lastname, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = this.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
            if (found) {
                return null;
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 12);
            const newUser = {
                id: (0, uuid_1.v4)(),
                firstname,
                lastname,
                username,
                password: hashedPassword,
            };
            this.users = [...this.users, newUser];
            return newUser;
        });
    }
    update(id, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const foundIndex = this.users.findIndex((u) => u.id === id);
            if (foundIndex === -1) {
                return null;
            }
            if (changes.username) {
                const usernameTaken = this.users.find((u) => u.username.toLowerCase() === changes.username.toLowerCase() &&
                    u.id !== id);
                if (usernameTaken) {
                    return 'taken';
                }
            }
            if (changes.password) {
                changes.password = yield bcrypt_1.default.hash(changes.password, 12);
            }
            this.users[foundIndex] = Object.assign(Object.assign({}, this.users[foundIndex]), { firstname: (_a = changes.firstname) !== null && _a !== void 0 ? _a : this.users[foundIndex].firstname, lastname: (_b = changes.lastname) !== null && _b !== void 0 ? _b : this.users[foundIndex].lastname, username: (_c = changes.username) !== null && _c !== void 0 ? _c : this.users[foundIndex].username, password: (_d = changes.password) !== null && _d !== void 0 ? _d : this.users[foundIndex].password });
            return this.users[foundIndex];
        });
    }
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
            if (!user)
                return null;
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            return isMatch ? user : null;
        });
    }
    deleteById(id) {
        const found = this.findById(id);
        if (!found) {
            return false;
        }
        this.users = this.users.filter((u) => u.id !== id);
        return true;
    }
}
exports.default = new UserModel();
