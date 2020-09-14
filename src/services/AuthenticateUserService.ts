import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '../config/auth';
import User from '../models/User';

interface RequestBody {
  email: string;
  password: string;
}

interface AuthenticationResponse {
  user: User;
  token: string;
}

export default class AuthenticateUserService {
  // eslint-disable-next-line class-methods-use-this
  public async execute({
    email,
    password,
  }: RequestBody): Promise<AuthenticationResponse> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Invalid email or password.');
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}
