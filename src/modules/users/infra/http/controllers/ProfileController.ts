import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  // eslint-disable-next-line class-methods-use-this
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showProfileService = container.resolve(ShowProfileService);

    const user = await showProfileService.execute({ user_id });

    return response.json(classToClass(user));
  }

  // eslint-disable-next-line class-methods-use-this
  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, email, old_password, password } = request.body;

    const updateProfileService = container.resolve(UpdateProfileService);

    const updatedUser = await updateProfileService.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    return response.json(classToClass(updatedUser));
  }
}
