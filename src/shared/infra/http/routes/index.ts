import { Router } from 'express';

import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordsRouter from '@modules/users/infra/http/routes/passwords.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import providersRouter from '@modules/appointments/infra/http/routes/providers.routes';

const router = Router();

router.use('/appointments', appointmentsRouter);
router.use('/providers', providersRouter);
router.use('/users', usersRouter);
router.use('/sessions', sessionsRouter);
router.use('/password', passwordsRouter);
router.use('/profile', profileRouter);

export default router;
