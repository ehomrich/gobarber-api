import { v4 as uuid } from 'uuid';
import { isEqual, getDate, getMonth, getYear } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthForProviderDTO from '@modules/appointments/dtos/IFindAllInMonthForProviderDTO';
import IFindAllInDayForProviderDTO from '@modules/appointments/dtos/IFindAllInDayForProviderDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private appoinments: Appointment[] = [];

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { date, provider_id, id: uuid() });

    this.appoinments.push(appointment);

    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointment = this.appoinments.find(i => isEqual(i.date, date));

    return appointment;
  }

  public async findAllInMonthForProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthForProviderDTO): Promise<Appointment[]> {
    const appointments = this.appoinments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async findAllInDayForProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayForProviderDTO): Promise<Appointment[]> {
    const appointments = this.appoinments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }
}

export default AppointmentsRepository;
