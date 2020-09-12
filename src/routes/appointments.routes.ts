import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const router = Router();

const appointmentsRepository = new AppointmentsRepository();

router.get('/', (request, response) =>
  response.json(appointmentsRepository.all()),
);

router.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = parseISO(date);
  const createAppointmentService = new CreateAppointmentService(
    appointmentsRepository,
  );

  try {
    const appointment = createAppointmentService.execute({
      provider,
      date: parsedDate,
    });

    return response.json(appointment);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default router;
