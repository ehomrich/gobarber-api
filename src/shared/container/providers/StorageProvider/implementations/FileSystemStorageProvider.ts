import { promises as fs } from 'fs';
import path from 'path';

import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

export default class FileSystemStorageProvider implements IStorageProvider {
  // eslint-disable-next-line class-methods-use-this
  public async saveFile(file: string): Promise<string> {
    await fs.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    return file;
  }

  // eslint-disable-next-line class-methods-use-this
  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    try {
      await fs.stat(filePath);
    } catch (error) {
      return;
    }

    await fs.unlink(filePath);
  }
}
