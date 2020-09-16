import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list all providers', async () => {
    const loggedUser = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const richard = await fakeUsersRepository.create({
      name: 'Richard Roe',
      email: 'richardroe@example.com',
      password: '123456',
    });

    const jane = await fakeUsersRepository.create({
      name: 'Jane Joe',
      email: 'janejoe@example.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toBeInstanceOf(Array);
    expect(providers).toEqual([richard, jane]);
  });
});
