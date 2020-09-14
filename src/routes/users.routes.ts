import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const router = Router();

const uploadAdapter = multer(uploadConfig);

router.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUserService = new CreateUserService();
  const user = await createUserService.execute({ name, email, password });

  return response.json(user);
});

router.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAdapter.single('avatar'),
  async (request, response) => {
    const updateUserAvatarService = new UpdateUserAvatarService();
    const user = await updateUserAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default router;
