import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 8, 1),
      provider_id: '209r901r',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('209r901r');
  });

  it('should not be able to two appointment on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const date = new Date(2020, 4, 1, 11);

    await createAppointmentService.execute({ date, provider_id: '39mm98ri' });

    expect(
      createAppointmentService.execute({ date, provider_id: '298hfh18' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
