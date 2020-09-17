import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import IStorageProvider from './models/IStorageProvider';

import FileSystemStorageProvider from './implementations/FileSystemStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';

const providers = {
  disk: FileSystemStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
