import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  // eslint-disable-next-line class-methods-use-this
  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;
    const cachedData = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const appointments = await this.appointmentsRepository.findAllInDayForProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    await this.cacheProvider.save(cacheKey, appointments);

    return appointments;
  }
}

export default ListProviderAppointmentsService;
