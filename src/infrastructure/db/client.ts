import Database from 'tauri-plugin-sql-api';

export const configureDatabase = async () => {
  return await Database.load('sqlite:decim.db');
};
