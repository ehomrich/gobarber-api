import { Router } from 'express';

import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordsRouter from '@modules/users/infra/http/routes/passwords.routes';

const router = Router();

router.use('/appointments', appointmentsRouter);
router.use('/users', usersRouter);
router.use('/sessions', sessionsRouter);
router.use('/password', passwordsRouter);

export default router;
