import type Database from 'tauri-plugin-sql-api';

import { BaseTable } from '../db/postgresql/base/BaseTable';

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
          type: 'int4',
          primaryKey: true,
          autoIncrement: true,
        },
        lastLogin: {
          type: 'int4',
        },
        masterPassword: {
          type: 'varchar',
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
