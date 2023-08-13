import type Database from 'tauri-plugin-sql-api';

import { type TConfig } from '../app';
import { HostTable } from './HostsTable';
import { NoteTable } from './NoteTable';
import { PasswordTable } from './PasswordTable';
import { SettingsTable } from './SettingsTable';

export const configureTables = (db: Database, config: TConfig) => {
  return {
    password: new PasswordTable(db, config),
    note: new NoteTable(db),
    settings: new SettingsTable(db),
    host: new HostTable(db),
  };
};
