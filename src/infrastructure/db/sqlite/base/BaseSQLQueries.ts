// import { type FindAllOptions } from './BaseQueries'

// export default class BaseSQLQueries<T extends Record<string, string | number>> {
//   constructor(private tableName: string) {}

//   protected saveQuery = async (
//     data: Partial<Record<keyof T, string | number>>
//   ) => {
//     data = {
//       ...data,
//       updatedAt: new Date(),
//     }
//     if ('id' in data) {
//       return this.tableSqlUpdateQuery(data)
//     }

//     return this.insertQuery([data])
//   }

//   protected tableSqlUpdateQuery = async (
//     data: Partial<Record<keyof T, string | number>>
//   ) => {
//     data = {
//       ...data,
//       updatedAt: new Date(),
//     }
//     let sql = `UPDATE ${this.tableName} SET `

//     for (const column in data) {
//       sql += `${column} = '${data[column]}',`
//     }
//     sql = sql.slice(0, -1)
//     sql += ` WHERE id = ${data.id};`

//     return sql
//   }

//   protected insertQuery = async (
//     data: Partial<Record<keyof T, string | number>>[]
//   ) => {
//     data = data.map(
//       (x) =>
//         ({
//           ...x,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         } as any)
//     )
//     let sql = `INSERT INTO ${this.tableName} (`

//     for (const column in data[0]) {
//       sql += `${column},`
//     }
//     sql = sql.slice(0, -1)
//     sql += ') VALUES '
//     for (const row of data) {
//       sql += '('
//       for (const column in row) {
//         sql += `'${row[column]}',`
//       }
//       sql = sql.slice(0, -1)
//       sql += '),'
//     }
//     sql = sql.slice(0, -1)
//     sql += ';'

//     return sql
//   }

//   protected findQuery = async (data: FindAllOptions<T>) => {
//     const { where, sort, skip, take } = data
//     const sql = [`SELECT * FROM ${this.tableName}`]

//     sql.push(...this.getWhereQuery(where))

//     if (sort) {
//       sql.push(` ORDER BY  ${Object.keys(sort)[0]} ${Object.values(sort)[0]} `)
//     }
//     sql.push(`LIMIT ${take}`)
//     if (skip) {
//       sql.push(`OFFSET ${skip}`)
//     }
//     sql.push(';')

//     return sql.join(' ')
//   }

//   private getWhereQuery = (where: FindAllOptions<T>['where']) => {
//     const columnsLength = Object.keys(where || {}).length

//     const sql = []
//     let i = 0

//     if (columnsLength > 0) {
//       sql.push('WHERE')
//     }

//     for (const column in where) {
//       const elem = where[column]

//       if (!elem) {
//         i++
//         continue
//       }
//       if ('contains' in elem) {
//         sql.push(`${this.tableName}.${column} LIKE '%${elem['contains']}%'`)
//       } else {
//         sql.push(`${this.tableName}.${column} = '${elem}'`)
//       }
//       if (i < columnsLength - 1) sql.push(`AND`)
//       i++
//     }

//     return sql
//   }

//   protected totalQuery = async (where: FindAllOptions<T>['where']) => {
//     const sql = [`SELECT COUNT(*) as count FROM ${this.tableName}`]

//     if (where) {
//       sql.push(...this.getWhereQuery(where))
//     }
//     sql.push(';')

//     return sql.join(' ')
//   }

//   protected deleteByIdQuery = async (id: number | string) => {
//     const sql = `DELETE FROM ${this.tableName} WHERE id = ${id};`

//     return sql
//   }
// }
