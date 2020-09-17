import { injectable, inject } from 'tsyringe';
import { getHours } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  user_id: string;
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
    user_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayForProvider(
      {
        provider_id: user_id,
        day,
        month,
        year,
      },
    );

    const hourSlots = Array.from({ length: 10 }, (_, index) => 8 + index);

    const availability = hourSlots.map(hour => {
      const alreadyBooked = appointments.find(
        ({ date }) => getHours(date) === hour,
      );

      return {
        hour,
        available: !alreadyBooked,
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
