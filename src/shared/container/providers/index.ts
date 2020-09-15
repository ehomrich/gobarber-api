import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import FileSystemStorageProvider from './StorageProvider/implementations/FileSystemStorageProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  FileSystemStorageProvider,
);
