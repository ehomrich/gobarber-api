import { hash, compare } from 'bcryptjs';

import IHashProvider from '@modules/users/providers/models/IHashProvider';

export default class BCryptHashProvider implements IHashProvider {
  // eslint-disable-next-line class-methods-use-this
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  // eslint-disable-next-line class-methods-use-this
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
