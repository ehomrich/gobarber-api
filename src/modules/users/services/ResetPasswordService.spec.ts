import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset a password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({ token, password: 'new-password' });

    const updatedUser = await fakeUsersRepository.findById(user.id);
    const newPasswordHash = await fakeHashProvider.generateHash('new-password');

    expect(generateHash).toBeCalledWith('new-password');
    expect(updatedUser?.password).toEqual(newPasswordHash);
  });

  it('should not be able to reset a password for a non-existent token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'foo-bar',
        password: 'baz-qux',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset a password for a non-existent user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user',
    );

    await expect(
      resetPasswordService.execute({
        token,
        password: 'baz-qux',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset a password with an expired token', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        token,
        password: 'foo-bar-baz',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
