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

  it('should be able to list the day availability of the provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'johndoe',
      date: new Date(2020, 8, 11, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'johndoe',
      date: new Date(2020, 8, 11, 16, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 11, 12).getTime();
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
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: true },
        { hour: 16, available: false },
        { hour: 17, available: true },
      ]),
    );
  });
});
