import type Database from 'tauri-plugin-sql-api';
import { BaseTable } from '../db/postgresql/base/BaseTable';

export type THost = {
  id: number;
  name: string;
  url: string;
  tags: string;
  creds?: string;
  description?: string;
};
export class HostTable extends BaseTable<THost> {
  constructor(db: Database) {
    super(
      db,
      'hosts',
      {
        id: {
          type: 'int4',
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: 'varchar',
          notNull: true,
        },
        url: {
          type: 'varchar',
          notNull: true,
        },
        tags: {
          type: 'varchar',
        },
        description: {
          type: 'varchar',
        },
        creds: {
          type: 'varchar',
        },
      },
      [
        {
          id: 1,
          name: 'test',
          url: 'artika@hgdev.me',
          tags: 'test,test1,test2',
        },
        {
          id: 2,
          name: 'test2',
          url: 'test2',
          tags: 'test3,test2',
        },
        {
          id: 3,
          name: 'test3',
          url: 'test3',
          tags: 'test5,test4',
        },
      ],
      true
    );
  }
}
