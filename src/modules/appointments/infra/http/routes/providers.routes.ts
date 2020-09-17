import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

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
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerDayAvailabilityController.index,
);
router.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerMonthAvailabilityController.index,
);

export default router;
