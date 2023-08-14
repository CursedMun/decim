import type Database from 'tauri-plugin-sql-api';

import { BaseTable } from '../db/sqlite/base/BaseTable';

type TSettingsColumns = {
  id: number;
  lastLogin: number;
  masterPassword: string;
};
export class SettingsTable extends BaseTable<TSettingsColumns> {
  constructor(db: Database) {
    super(
      db,
      'settings',
      {
        id: {
          type: 'INTEGER',
          primaryKey: true,
          autoIncrement: true,
        },
        lastLogin: {
          type: 'INTEGER',
        },
        masterPassword: {
          type: 'TEXT',
        },
      },
      [
        {
          id: 1,
          lastLogin: 0,
          masterPassword: 'admin',
        },
      ],
      true
    );
  }
}
