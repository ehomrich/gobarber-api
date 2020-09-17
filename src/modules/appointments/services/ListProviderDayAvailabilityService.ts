import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  // eslint-disable-next-line class-methods-use-this
  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayForProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    const currentDate = new Date(Date.now());
    const hourSlots = Array.from({ length: 10 }, (_, index) => 8 + index);

    const availability = hourSlots.map(hour => {
      const alreadyBooked = appointments.find(
        ({ date }) => getHours(date) === hour,
      );

      const compareDate = new Date(year, month - 1, day, hour);
      const available = !alreadyBooked && isAfter(compareDate, currentDate);

      return { hour, available };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
