import { promises as fs } from 'fs';
import handlebars from 'handlebars';

import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default class HandlebarsMailTemplateProvider
  implements IMailTemplateProvider {
  // eslint-disable-next-line class-methods-use-this
  public async parse({
    file,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const templateContent = await fs.readFile(file, { encoding: 'utf-8' });

    const compileTemplate = handlebars.compile(templateContent);

    return compileTemplate(variables);
  }
}
