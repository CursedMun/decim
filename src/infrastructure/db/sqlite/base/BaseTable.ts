import { error, log } from '@/lib/logger';
import type Database from 'tauri-plugin-sql-api';
import { BaseQuery } from './BaseQueries';

type ColumnType = 'INTEGER' | 'TEXT' | 'TIMESTAMP' | 'BOOLEAN';
export type TColumn = {
  // SQLite type
  type: ColumnType;
  primaryKey?: boolean;
  notNull?: boolean;
  autoIncrement?: boolean;
};

export type TExtTable = {
  createdAt: number;
  updatedAt: number;
};

export class BaseTable<
  T extends Record<string, string | number>
> extends BaseQuery<T & TExtTable> {
  public type: T & TExtTable = {
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  constructor(
    db: Database, // Use the SQLite database instance
    name: string,
    private createColumns: Record<keyof T, TColumn>,
    seedData?: Partial<Record<keyof T, string | number>>[],
    seed?: boolean
  ) {
    super(db, name, seedData);
    this.createColumns = {
      ...this.createColumns,
      createdAt: {
        type: 'TIMESTAMP',
        notNull: true,
      },
      updatedAt: {
        type: 'TIMESTAMP',
        notNull: true,
      },
    };
    this.createColumns = Object.entries(this.createColumns).reduce(
      (prev, [key, value]) => {
        return {
          ...prev,
          [key]: {
            ...value,
            name: key,
            ...(value.primaryKey ? { notNull: true } : {}),
          },
        };
      },
      {} as Record<keyof T, TColumn>
    );
    this.createTables().then((x) => {
      if (seed) {
        // this.seed();
      }
    });
  }

  private async createTables() {
    const diff = await this.tableSqlDiffQuery(this.name, this.createColumns);

    log(this.name, diff);
    if (diff.length > 0) {
      await this.migrate(diff);
    }
    const tableExists = await this.tableExists(this.name);

    if (tableExists) {
      return;
    }
    const query = await this.tableSqlCreateQuery(this.name, this.createColumns);

    log([query]);
    const queryResult = await this.db.execute(query); // Use exec instead of execute for SQLite

    return queryResult;
  }

  private migrate = async (queries: string[]) => {
    for (const query of queries) {
      await this.db.execute(query).catch((err) => {
        error({ query, message: 'error on migrate: ', err });
      });
    }

    return true;
  };

  private tableExists = async (tableName: string) => {
    const query = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`;
    const queryResult = (await this.db.select(query)) as any[];

    log({ queryResult });

    return queryResult?.length > 0;
  };

  private tableSqlDiffQuery = async (
    tableName: string,
    table: Record<string, TColumn>
  ) => {
    const tableExists = await this.tableExists(tableName);

    log('tableExists: ', tableExists);

    if (!tableExists) {
      return [];
    }

    const dbColumnsQuery = `PRAGMA table_info(${tableName})`;
    const dbColumns = (await this.db.select(dbColumnsQuery)) as any[];
    const dbColumnMap: Record<
      string,
      {
        name: string;
        type: ColumnType;
        notnull: number;
        dflt_value: string | null;
      }
    > = {};
    const diff: string[] = [];

    dbColumns.forEach((dbColumn) => {
      dbColumnMap[dbColumn.name] = dbColumn;
    });

    for (const columnName in table) {
      const { type, primaryKey, notNull, autoIncrement } = table[columnName];

      if (!dbColumnMap[columnName]) {
        const createColumnQuery = `ALTER TABLE ${tableName} ADD COLUMN "${columnName}" ${type} ${
          notNull ? 'NOT NULL' : 'NULL'
        } ${primaryKey ? 'PRIMARY KEY' : ''} ${
          autoIncrement ? 'AUTOINCREMENT' : ''
        }`;

        diff.push(createColumnQuery);
      } else {
        const dbColumn = dbColumnMap[columnName];
        const alterQueries: string[] = [];

        if (dbColumn.type !== type) {
          alterQueries.push(
            `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" SET DATA TYPE ${type}`
          );
        }

        if (dbColumn.dflt_value !== null && !autoIncrement) {
          alterQueries.push(
            `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" DROP DEFAULT`
          );
        } else if (dbColumn.dflt_value === null && autoIncrement) {
          // Autoincrement is handled differently in SQLite
        }

        if (
          (dbColumn.notnull === 0 && notNull) ||
          (dbColumn.notnull === 1 && !notNull)
        ) {
          alterQueries.push(
            `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" ${
              notNull ? 'SET NOT NULL' : 'DROP NOT NULL'
            }`
          );
        }

        if (alterQueries.length > 0) {
          diff.push(...alterQueries);
        }
      }
    }

    for (const dbColumn of dbColumns) {
      if (!table[dbColumn.name]) {
        const dropColumnQuery = `ALTER TABLE ${tableName} DROP COLUMN "${dbColumn.name}"`;

        diff.push(dropColumnQuery);
      }
    }

    return diff;
  };

  private tableSqlCreateQuery = async (
    tableName: string,
    table: Record<string, TColumn>
  ) => {
    let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

    for (const column in table) {
      sql += `"${column}" ${table[column].type} ${
        table[column].primaryKey ? 'PRIMARY KEY' : ''
      } ${table[column].notNull ? 'NOT NULL' : ''},`;
    }
    sql = sql.slice(0, -1);
    sql += ');';

    return sql;
  };
}
