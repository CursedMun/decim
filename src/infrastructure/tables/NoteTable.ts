import type Database from 'tauri-plugin-sql-api'
import { BaseTable } from '../db/postgresql/base/BaseTable'

export type TNote = {
  id: number
  title: string
  description: string
  tags: string
  category: string
}
export class NoteTable extends BaseTable<TNote> {
  constructor(db: Database) {
    super(
      db,
      'notes',
      {
        id: {
          type: 'int4',
          primaryKey: true,
        },
        title: {
          type: 'varchar',
        },
        description: {
          type: 'varchar',
        },
        tags: {
          type: 'varchar',
        },
        category: {
          type: 'varchar',
        },
      },
      [
        {
          id: 1,
          title: 'test',
          description: 'test',
          tags: 'test,test1,test2',
          category: 'test',
        },
        {
          id: 2,
          title: 'test2',
          description: 'test2',
          tags: 'test3,test2',
          category: 'test2',
        },
        {
          id: 3,
          title: 'test3',
          description: 'test3',
          tags: 'test5,test4',
          category: 'test3',
        },
      ],
      true
    )
  }
}
