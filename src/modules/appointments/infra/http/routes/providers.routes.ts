import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ProviderDayAvailabilityControler from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityControler';
import ProviderMonthAvailabilityControler from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityControler';

const router = Router();
const providerController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDayAvailabilityControler();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityControler();

router.use(ensureAuthenticated);

router.get('/', providerController.index);
router.get(
  '/:provider_id/day-availability',
  providerDayAvailabilityController.index,
);
router.get(
  '/:provider_id/month-availability',
  providerMonthAvailabilityController.index,
);

export default router;
