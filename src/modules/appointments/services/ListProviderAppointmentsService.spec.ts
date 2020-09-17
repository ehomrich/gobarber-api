import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it("should be able to list the day's appointments for the provider", async () => {
    const [first, second, third] = await Promise.all(
      [8, 13, 16].map(hour =>
        fakeAppointmentsRepository.create({
          provider_id: 'provider',
          user_id: Math.random().toString(36).substring(5),
          date: new Date(2020, 8, 11, hour, 0, 0),
        }),
      ),
    );

    const appointments = await listProviderAppointmentsService.execute({
      provider_id: 'provider',
      day: 11,
      month: 9,
      year: 2020,
    });

    expect(appointments).toEqual(
      expect.arrayContaining([first, second, third]),
    );
  });
});
