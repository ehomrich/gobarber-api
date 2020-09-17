import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the availability of the provider during the day', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'johndoe',
      date: new Date(2020, 8, 11, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'johndoe',
      date: new Date(2020, 8, 11, 10, 0, 0),
    });

    const dayAvailability = await listProviderDayAvailabilityService.execute({
      user_id: 'johndoe',
      day: 11,
      month: 9,
      year: 2020,
    });

    expect(dayAvailability).toBeInstanceOf(Array);
    expect(dayAvailability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: true },
        { hour: 10, available: false },
      ]),
    );
  });
});
