import type Database from 'tauri-plugin-sql-api';

import { error, log } from '@/lib/logger';
import { BaseQuery } from './BaseQueries';

type ColumnType = 'int4' | 'varchar' | 'timestamptz' | 'boolean';
export type TColumn = {
  //postgre type
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
    db: Database,
    name: string,
    private createColumns: Record<keyof T, TColumn>,
    seedData?: Partial<Record<keyof T, string | number>>[],
    seed?: boolean
  ) {
    super(db, name, seedData);
    this.createColumns = {
      ...this.createColumns,
      createdAt: {
        type: 'timestamptz',
        notNull: true,
      },
      updatedAt: {
        type: 'timestamptz',
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
    //compare the old schema to the new and see if there are any changes
    // and if there are, then run the migration
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
    const queryResult = await this.db.execute(query).catch((err) => {
      error('error on create: ', err);
    });

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
    //check if table exists as postgresql
    const query = `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '${tableName}');`;
    const queryResult = (await this.db.select(query)) as { exists: boolean }[];

    return queryResult[0]?.exists ?? false;
  };

  private tableSqlDiffQuery = async (
    tableName: string,
    table: Record<string, TColumn>
  ) => {
    // Check if table exists
    const tableExists = await this.tableExists(tableName);

    log('tableExists: ', tableExists);

    if (!tableExists) {
      return [];
    }

    // Get the diff as PostgreSQL and return it
    const dbColumnsQuery = `
    SELECT column_name, udt_name, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = '${tableName}'
  `;
    const dbColumns = (await this.db.select(dbColumnsQuery)) as {
      column_name: string;
      udt_name: ColumnType;
      is_nullable: 'YES' | 'NO';
      column_default: string | null;
    }[];
    const dbColumnMap: Record<
      string,
      {
        column_name: string;
        udt_name: ColumnType;
        is_nullable: 'YES' | 'NO';
        column_default: string | null;
      }
    > = {};
    const diff: string[] = [];

    dbColumns.forEach((dbColumn) => {
      dbColumnMap[dbColumn.column_name] = dbColumn;
    });

    // Compare and synchronize columns
    for (const columnName in table) {
      const { type, primaryKey, notNull, autoIncrement } = table[columnName];

      if (!dbColumnMap[columnName]) {
        // Column does not exist in the database, create it
        const createColumnQuery = `ALTER TABLE ${tableName} ADD COLUMN "${columnName}" ${type} ${
          notNull ? 'NOT NULL' : 'NULL'
        } ${primaryKey ? 'PRIMARY KEY' : ''} ${autoIncrement ? 'SERIAL' : ''}`;

        diff.push(createColumnQuery);
      } else {
        const dbColumn = dbColumnMap[columnName];
        const alterQueries: string[] = [];

        // Compare column type
        if (dbColumn.udt_name !== type) {
          alterQueries.push(
            `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" SET DATA TYPE ${type}`
          );
        }
        if (
          dbColumn.column_default !== null &&
          dbColumn.column_default.startsWith('nextval') &&
          !autoIncrement
        ) {
          alterQueries.push(
            `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" DROP DEFAULT`
          );
          alterQueries.push(`DROP SEQUENCE ${tableName}_${columnName}_seq;`);
        } else if (dbColumn.column_default === null && autoIncrement) {
          const seq = `${tableName}_${columnName}_seq`;

          alterQueries.push(`CREATE SEQUENCE ${seq};`);
          alterQueries.push(
            `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" SET DEFAULT nextval('${seq}'::regclass)`
          );
        }

        if (
          (dbColumn.is_nullable === 'YES' && notNull) ||
          (dbColumn.is_nullable === 'NO' && !notNull)
        ) {
          // Compare nullability
          alterQueries.push(
            `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" ${
              notNull ? 'SET NOT NULL' : 'DROP NOT NULL'
            }`
          );
        }

        if (alterQueries.length > 0) {
          diff.push(...alterQueries); // Spread the alter queries into the diff array
        }
      }
    }

    // Drop columns not in tableDefinition
    for (const dbColumn of dbColumns) {
      if (!table[dbColumn.column_name]) {
        const dropColumnQuery = `ALTER TABLE ${tableName} DROP COLUMN "${dbColumn.column_name}" CASCADE`;

        diff.push(dropColumnQuery);
      }
    }

    return diff; // Return the array of SQL queries
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
