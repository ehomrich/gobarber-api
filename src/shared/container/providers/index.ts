import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import FileSystemStorageProvider from './StorageProvider/implementations/FileSystemStorageProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  FileSystemStorageProvider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  new EtherealMailProvider(),
);
