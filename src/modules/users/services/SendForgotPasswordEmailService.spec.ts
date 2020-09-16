import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeMailProvider,
    );
  });

  it('should be able to send a password recovery email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute(user);

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send a password recovery email for a non-existing user', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a password recovery token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute(user);

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
