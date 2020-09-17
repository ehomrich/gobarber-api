import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  user_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  // eslint-disable-next-line class-methods-use-this
  public async execute({ user_id, month, year }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthForProvider(
      {
        provider_id: user_id,
        month,
        year,
      },
    );

    const daysOfTheMonth = Array.from(
      { length: getDaysInMonth(new Date(year, month - 1)) },
      (_, index) => index + 1,
    );

    const availability = daysOfTheMonth.map(day => {
      const appointmentsOfTheDay = appointments.filter(
        ({ date }) => getDate(date) === day,
      );

      return {
        day,
        available: appointmentsOfTheDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
