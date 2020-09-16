import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

const router = Router();
const profileController = new ProfileController();

router.use(ensureAuthenticated);

router.get('/', profileController.show);
router.put('/', profileController.update);

export default router;
