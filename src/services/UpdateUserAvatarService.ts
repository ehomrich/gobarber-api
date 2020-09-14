import { promises as fs } from 'fs';
import path from 'path';
import { getRepository } from 'typeorm';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';
import User from '../models/User';

interface RequestBody {
  user_id: string;
  avatarFilename: string;
}

export default class UpdateUserAvatarService {
  // eslint-disable-next-line class-methods-use-this
  public async execute({
    user_id,
    avatarFilename,
  }: RequestBody): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new AppError(
        'Only authenticated users are allowed to change avatar.',
        401,
      );
    }

    if (user.avatar) {
      const userAvatarFilepath = path.join(uploadConfig.directory, user.avatar);
      const fileExists = await fs.stat(userAvatarFilepath);

      if (fileExists) {
        await fs.unlink(userAvatarFilepath);
      }
    }

    user.avatar = avatarFilename;

    await usersRepository.save(user);

    return user;
  }
}
