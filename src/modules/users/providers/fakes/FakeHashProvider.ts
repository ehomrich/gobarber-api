import IHashProvider from '../models/IHashProvider';

export default class FakeHashProvider implements IHashProvider {
  // eslint-disable-next-line class-methods-use-this
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  // eslint-disable-next-line class-methods-use-this
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}
