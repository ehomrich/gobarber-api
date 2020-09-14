import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const router = Router();

router.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const authenticateUserService = new AuthenticateUserService();

    const { user, token } = await authenticateUserService.execute({
      email,
      password,
    });

    delete user.password;

    return response.json({ user, token });
  } catch (error) {
    return response.status(401).json({ error: error.message });
  }
});

export default router;
