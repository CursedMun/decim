// import Database from 'tauri-plugin-sql-api'

// import { BaseQuery } from './BaseQueries'

// export type TColumn = {
//   type: 'INTEGER' | 'TEXT'
//   primaryKey?: boolean
//   notNull?: boolean
// }
// type TDiff = {
//   name: string
//   type: string
//   notnull: number
//   dflt_value: string
//   add: boolean
// }

// export type TExtTable = {
//   createdAt: number
//   updatedAt: number
// }
// export class BaseTable<
//   T extends Record<string, string | number>
// > extends BaseQuery<T & TExtTable> {
//   public type: T & TExtTable = {
//     createdAt: 0,
//     updatedAt: 0,
//   } as any
//   constructor(
//     db: Database,
//     name: string,
//     private createColumns: Record<keyof T, TColumn>,
//     seedData?: Partial<Record<keyof T, string | number>>[],
//     seed?: boolean
//   ) {
//     super(db, name, seedData)
//     this.createColumns = {
//       ...this.createColumns,
//       createdAt: {
//         type: 'INTEGER',
//         notNull: true,
//       },
//       updatedAt: {
//         type: 'INTEGER',
//         notNull: true,
//       },
//     }
//     this.createTables().then((x) => {
//       if (seed) {
//         this.seed()
//       }
//     })
//   }

//   private async createTables() {
//     //compare the old schema to the new and see if there are any changes
//     // and if there are, then run the migration
//     const diff = await this.tableSqlDiffQuery(this.name, this.createColumns)
//     if (diff.length > 0) {
//       await this.migrate(diff)
//     }
//     const query = await this.tableSqlCreateQuery(this.name, this.createColumns)
//     const queryResult = await this.db.execute(query).catch((err) => {
//       console.log('error on create: ', err)
//     })
//     return queryResult
//   }
//   private migrate = async (diff: TDiff[]) => {
//     const queries = await this.tableSqlMigrateQuery(this.name, diff)
//     console.log(queries)
//     for (const query of queries) {
//       await this.db.execute(query).catch((err) => {
//         console.log(query)
//         console.log('error on migrate: ', err)
//       })
//     }
//     return true
//   }
//   private tableSqlMigrateQuery = async (tableName: string, diffs: TDiff[]) => {
//     const queries = [] as string[]
//     for (const diff in diffs) {
//       if (diffs[diff].add) {
//         queries.push(
//           `ALTER TABLE ${tableName} ADD COLUMN ${diffs[diff].name} ${
//             diffs[diff].type
//           } ${diffs[diff].notnull ? 'NOT NULL' : ''} ${
//             diffs[diff].dflt_value ? `DEFAULT ${diffs[diff].dflt_value}` : ''
//           };`
//         )
//       } else {
//         queries.push(
//           `ALTER TABLE ${tableName} DROP COLUMN ${diffs[diff].name};`
//         )
//       }
//     }
//     return queries
//   }
//   private tableExists = async (tableName: string) => {
//     const query = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`
//     const queryResult = (await this.db.select(query)) as { name: string }[]
//     return queryResult.length > 0
//   }
//   private tableSqlDiffQuery = async (
//     tableName: string,
//     table: Record<string, TColumn>
//   ) => {
//     //check if table exists
//     const tableExists = await this.tableExists(tableName)
//     if (!tableExists) {
//       return []
//     }
//     const query = `PRAGMA table_info(${tableName});`
//     const queryResult = (await this.db.select(query)) as {
//       name: string
//       type: string
//       notnull: number
//       dflt_value: string
//       pk: number
//     }[]
//     const diff: TDiff[] = []
//     for (const column in table) {
//       const columnExists = queryResult.find((x) => x.name === column)
//       if (!columnExists) {
//         diff.push({
//           name: column,
//           type: table[column].type,
//           notnull: table[column].notNull ? 1 : 0,
//           dflt_value: '',
//           add: true,
//         })
//       }
//     }
//     for (const column of queryResult) {
//       if (!table[column.name]) {
//         diff.push({
//           name: column.name,
//           type: column.type,
//           notnull: column.notnull,
//           dflt_value: column.dflt_value,
//           add: false,
//         })
//       }
//     }
//     return diff
//   }
//   private tableSqlCreateQuery = async (
//     tableName: string,
//     table: Record<string, TColumn>
//   ) => {
//     let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (`
//     for (const column in table) {
//       sql += `${column} ${table[column].type} ${
//         table[column].primaryKey ? 'PRIMARY KEY' : ''
//       } ${table[column].notNull ? 'NOT NULL' : ''},`
//     }
//     sql = sql.slice(0, -1)
//     sql += ');'
//     return sql
//   }
// }
