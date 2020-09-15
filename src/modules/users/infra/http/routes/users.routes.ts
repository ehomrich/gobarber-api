import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';

const router = Router();
const uploadAdapter = multer(uploadConfig);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

router.post('/', usersController.create);

router.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAdapter.single('avatar'),
  userAvatarController.update,
);

export default router;
