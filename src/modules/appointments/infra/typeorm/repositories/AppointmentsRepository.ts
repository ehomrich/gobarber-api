import { Repository, getRepository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthForProviderDTO from '@modules/appointments/dtos/IFindAllInMonthForProviderDTO';
import IFindAllInDayForProviderDTO from '@modules/appointments/dtos/IFindAllInDayForProviderDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointment = await this.ormRepository.findOne({ where: { date } });

    return appointment;
  }

  public async findAllInMonthForProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthForProviderDTO): Promise<Appointment[]> {
    const parsedDate = `${String(month).padStart(2, '0')}-${year}`;

    const appointments = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedDate}'`,
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayForProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayForProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDate = `${parsedDay}-${parsedMonth}-${year}`;

    const appointments = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDate}'`,
        ),
      },
    });

    return appointments;
  }
}

export default AppointmentsRepository;
