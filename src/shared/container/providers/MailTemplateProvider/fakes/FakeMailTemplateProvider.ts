import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
  // eslint-disable-next-line class-methods-use-this
  public async parse(data: IParseMailTemplateDTO): Promise<string> {
    return 'Mail template';
  }
}
