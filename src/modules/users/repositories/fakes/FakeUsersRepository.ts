import { v4 as uuid } from 'uuid';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { name, email, password, id: uuid() });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const index = this.users.findIndex(({ id }) => id === user.id);

    this.users[index] = user;

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }
}
