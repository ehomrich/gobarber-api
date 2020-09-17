import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability of the provider', async () => {
    const timeSlots = Array.from({ length: 10 }, (_, index) => 8 + index);

    await Promise.all(
      timeSlots.map(hour =>
        fakeAppointmentsRepository.create({
          provider_id: 'johndoe',
          date: new Date(2020, 8, 10, hour, 0, 0),
        }),
      ),
    );

    await fakeAppointmentsRepository.create({
      provider_id: 'johndoe',
      date: new Date(2020, 8, 11, 9, 0, 0),
    });

    const monthAvailability = await listProviderMonthAvailabilityService.execute(
      {
        user_id: 'johndoe',
        month: 9,
        year: 2020,
      },
    );

    expect(monthAvailability).toBeInstanceOf(Array);
    expect(monthAvailability).toEqual(
      expect.arrayContaining([
        { day: 10, available: false },
        { day: 11, available: true },
      ]),
    );
  });
});
