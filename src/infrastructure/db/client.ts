import Database from 'tauri-plugin-sql-api';
import { type TConfig } from '../app';

export const configureDatabase = async (config: TConfig) => {
  return await Database.load(config.DB_PATH);
};
