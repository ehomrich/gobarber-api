import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';
import User from '../models/User';

interface RequestBody {
  name: string;
  email: string;
  password: string;
}

interface CreatedUser {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export default class CreateUserService {
  // eslint-disable-next-line class-methods-use-this
  private omitPassword(user: User): CreatedUser {
    const { id, name, email, created_at, updated_at } = user;

    return { id, name, email, created_at, updated_at };
  }

  public async execute({
    name,
    email,
    password,
  }: RequestBody): Promise<CreatedUser> {
    const usersRepository = getRepository(User);

    const userExists = await usersRepository.findOne({ where: { email } });

    if (userExists) {
      throw new AppError('Email address already in use.');
    }

    const hashedPassword = await hash(password, 8);
    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    await usersRepository.save(user);

    return this.omitPassword(user);
  }
}
