import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 10, 10).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 8, 10, 12),
      user_id: 'fake-user-id',
      provider_id: '209r901r',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('209r901r');
  });

  it('should not be able to two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 10, 10).getTime();
    });

    const date = new Date(2020, 8, 10, 12);

    await createAppointmentService.execute({
      date,
      user_id: 'fake-user-id',
      provider_id: '39mm98ri',
    });

    await expect(
      createAppointmentService.execute({
        date,
        user_id: 'fake-user-id',
        provider_id: '298hfh18',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a date in the past', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 8, 10, 9),
        user_id: 'fake-user-id',
        provider_id: '298hfh18',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment where the user and the provider are the same person', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 10, 13).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 8, 10, 15),
        user_id: 'fake-user-id',
        provider_id: 'fake-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment outside of business hours (8am-5pm)', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 10, 16).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 8, 11, 6),
        user_id: 'fake-user-id',
        provider_id: 'before-8am',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 8, 11, 19),
        user_id: 'fake-user-id',
        provider_id: 'after-5pm',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
