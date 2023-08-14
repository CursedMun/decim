import type Database from 'tauri-plugin-sql-api';

import CryptoJS from 'crypto-js';
import { type QueryResult } from 'tauri-plugin-sql-api';
import { type TConfig } from '../app';
import {
  type FindAllOptions,
  type FindOneOptions,
} from '../db/sqlite/base/BaseQueries';
import { BaseTable, type TExtTable } from '../db/sqlite/base/BaseTable';
export type TPassword = {
  id: number;
  name: string;
  password: string;
  tags: string;
  description?: string;
};
export class PasswordTable extends BaseTable<TPassword> {
  constructor(db: Database, private config: TConfig) {
    super(
      db,
      'passwords',
      {
        id: {
          type: 'INTEGER',
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: 'TEXT',
          notNull: true,
        },
        password: {
          type: 'TEXT',
          notNull: true,
        },
        tags: {
          type: 'TEXT',
        },
        description: {
          type: 'TEXT',
        },
      },
      [
        {
          id: 1,
          name: 'test',
          password: 'test',
          tags: 'test1,test2',
        },
        {
          id: 2,
          name: 'test2',
          password: 'test2',
          tags: 'test3,test2',
        },
        {
          id: 3,
          name: 'test3',
          password: 'test3',
          tags: 'test5,test4',
        },
      ],
      true
    );
  }

  public save(
    data: Partial<Record<keyof TPassword | keyof TExtTable, string | number>>
  ): Promise<void | QueryResult> {
    data = JSON.parse(JSON.stringify(data));
    data.password = this.encrypt(data.password as string);

    return super.save(data);
  }

  public async findAll(data?: FindAllOptions<TPassword & TExtTable>) {
    const result = await super.findAll(data);

    return {
      ...result,
      edges: result.edges.map((edge) => {
        return {
          ...edge,
          password: this.decrypt(edge.password),
        };
      }),
    };
  }

  public findFirst(
    data: FindOneOptions<TPassword & TExtTable>
  ): Promise<TPassword & TExtTable> {
    return super.findFirst(data).then((edge) => {
      return {
        ...edge,
        password: this.decrypt(edge.password),
      };
    });
  }

  private encrypt(password: string) {
    return CryptoJS.AES.encrypt(password, this.config.SECRET_KEY).toString();
  }

  private decrypt(password: string) {
    const bytes = CryptoJS.AES.decrypt(password, this.config.SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    return originalText;
  }
}
