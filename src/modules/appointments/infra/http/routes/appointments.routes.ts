import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http//controllers/AppointmentsController';

const router = Router();
const appointmentsController = new AppointmentsController();

router.use(ensureAuthenticated);

router.get('/', async (request, response) => {
  const appointmentsRepository = new AppointmentsRepository();
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

router.post('/', appointmentsController.create);

export default router;
