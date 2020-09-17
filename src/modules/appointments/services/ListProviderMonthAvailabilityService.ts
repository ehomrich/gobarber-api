import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
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
  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthForProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    const currentDate = new Date(Date.now());
    const daysOfTheMonth = Array.from(
      { length: getDaysInMonth(new Date(year, month - 1)) },
      (_, index) => index + 1,
    );

    const availability = daysOfTheMonth.map(day => {
      const appointmentsOfTheDay = appointments.filter(
        ({ date }) => getDate(date) === day,
      );

      const compareDate = new Date(year, month - 1, day);
      const available =
        appointmentsOfTheDay.length < 10 && isAfter(compareDate, currentDate);

      return { day, available };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
