import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    const cacheKey = `provider-list:${user_id}`;
    const cachedData = await this.cacheProvider.recover<User[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const providers = this.usersRepository.findAllProviders({
      except_user_id: user_id,
    });

    await this.cacheProvider.save(cacheKey, providers);

    return providers;
  }
}

export default ListProvidersService;
