import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@modules/users/providers/models/IHashProvider';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestBody {
  name: string;
  email: string;
  password: string;
}

interface ICreatedUser {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  // eslint-disable-next-line class-methods-use-this
  private omitPassword(user: User): ICreatedUser {
    const { id, name, email, created_at, updated_at } = user;

    return { id, name, email, created_at, updated_at };
  }

  public async execute({
    name,
    email,
    password,
  }: IRequestBody): Promise<ICreatedUser> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new AppError('Email address already in use.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return this.omitPassword(user);
  }
}

export default CreateUserService;
