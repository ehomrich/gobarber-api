import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IHashProvider from '@modules/users/providers/models/IHashProvider';

interface IRequestBody {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequestBody): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('Token not found', 404);
    }

    const user = await this.usersRepository.findById(userToken?.user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (differenceInHours(Date.now(), userToken.created_at) > 2) {
      throw new AppError('Token expired', 401);
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
