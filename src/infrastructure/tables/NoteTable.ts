import type Database from 'tauri-plugin-sql-api';
import { BaseTable } from '../db/sqlite/base/BaseTable';

export type TNote = {
  id: number;
  title: string;
  description?: string;
  tags?: string;
};
export class NoteTable extends BaseTable<TNote> {
  constructor(db: Database) {
    super(
      db,
      'notes',
      {
        id: {
          type: 'INTEGER',
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: 'TEXT',
          notNull: true,
        },
        description: {
          type: 'TEXT',
        },
        tags: {
          type: 'TEXT',
        },
      },
      [
        {
          id: 1,
          title: 'test',
          description: 'test',
          tags: 'test,test1,test2',
        },
        {
          id: 2,
          title: 'test2',
          description: 'test2',
          tags: 'test3,test2',
        },
        {
          id: 3,
          title: 'test3',
          description: 'test3',
          tags: 'test5,test4',
        },
      ],
      true
    );
  }
}
