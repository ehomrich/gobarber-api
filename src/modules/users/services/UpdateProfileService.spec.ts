import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update a user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Richard Roe',
      email: 'richardroe@example.com',
    });

    expect(updatedUser.name).toEqual('Richard Roe');
    expect(updatedUser.email).toEqual('richardroe@example.com');
  });

  it('should not be able to update the profile of a user that does not exist', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'the-id-of-a-user-that-does-not-exist',
        name: 'Jane Joe',
        email: 'janejoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a user profile by passing an email already in use', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'abcdef',
    });

    const user = await fakeUsersRepository.create({
      name: 'Richard Roe',
      email: 'richardroe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: user.name,
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: user.name,
      email: user.email,
      old_password: '123456',
      password: 'abcdef',
    });

    expect(updatedUser.password).toEqual(
      await fakeHashProvider.generateHash('abcdef'),
    );
  });

  it('should not be able to update the password without confirming the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: user.name,
        email: user.email,
        password: 'ofhodf',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with a wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: user.name,
        email: user.email,
        old_password: '232313',
        password: 'abcdef',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
