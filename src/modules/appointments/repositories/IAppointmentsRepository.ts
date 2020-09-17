import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthForProvider from '../dtos/IFindAllInMonthForProviderDTO';
import IFindAllInDayForProviderDTO from '../dtos/IFindAllInDayForProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllInMonthForProvider(
    data: IFindAllInMonthForProvider,
  ): Promise<Appointment[]>;
  findAllInDayForProvider(
    data: IFindAllInDayForProviderDTO,
  ): Promise<Appointment[]>;
}
