import { User } from '../types/user.types';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

class UserModel {
  private users: User[] = [];

  findAll() {
    return this.users;
  }

  findById(id: string) {
    return this.users.find((u) => u.id === id);
  }

  findByUsername(username: string) {
    return this.users.find(
      (u) => u.username.toLocaleLowerCase() === username.toLocaleLowerCase(),
    );
  }

  async add(
    firstname: string,
    lastname: string,
    username: string,
    password: string,
  ) {
    const found = this.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );
    if (found) {
      return null;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      id: uuidv4(),
      firstname,
      lastname,
      username,
      password: hashedPassword,
    };
    this.users = [...this.users, newUser];
    return newUser;
  }

  async update(id: string, changes: Partial<User>) {
    const foundIndex = this.users.findIndex((u) => u.id === id);
    if (foundIndex === -1) {
      return null;
    }

    if (changes.username) {
      const usernameTaken = this.users.find(
        (u) =>
          u.username.toLowerCase() === changes.username!.toLowerCase() &&
          u.id !== id,
      );
      if (usernameTaken) {
        return 'taken';
      }
    }

    if (changes.password) {
      changes.password = await bcrypt.hash(changes.password, 12);
    }

    this.users[foundIndex] = {
      ...this.users[foundIndex],
      firstname: changes.firstname ?? this.users[foundIndex].firstname,
      lastname: changes.lastname ?? this.users[foundIndex].lastname,
      username: changes.username ?? this.users[foundIndex].username,
      password: changes.password ?? this.users[foundIndex].password,
    };
    return this.users[foundIndex];
  }

  async login(username: string, password: string) {
    const user = this.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  deleteById(id: string) {
    const found = this.findById(id);
    if (!found) {
      return false;
    }
    this.users = this.users.filter((u) => u.id !== id);
    return true;
  }
}

export default new UserModel();
