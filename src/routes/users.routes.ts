import { Router } from 'express';

import CreateUserService from '../services/CreateUserService';

const router = Router();

router.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUserService = new CreateUserService();
    const user = await createUserService.execute({ name, email, password });

    return response.json(user);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default router;
