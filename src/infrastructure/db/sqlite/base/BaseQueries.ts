// import type Database from 'tauri-plugin-sql-api'

// import BaseSQLQueries from './BaseSQLQueries'
// import { type TExtTable } from './BaseTable'

// export type TFindAllResult<T> = {
//   edges: Partial<T & TExtTable>[]
//   pageInfo: {
//     total: number
//     limit: number
//     offset: number
//   }
// }
// type StringKeysWithContains<T> = {
//   [Key in keyof T]: Key extends string ? { contains: string } : never
// }
// export type FindOneOptions<T> = {
//   where?: Partial<T | StringKeysWithContains<T>>
//   sort?: Partial<Record<keyof T, 'ASC' | 'DESC'>>
// }
// export type FindAllOptions<T> = FindOneOptions<T> & {
//   take?: number
//   skip?: number
// }
// export class BaseQuery<
//   T extends Record<string, string | number>
// > extends BaseSQLQueries<T> {
//   private DEFAULT_TAKE = 100

//   constructor(
//     protected db: Database,
//     protected name: string,
//     private seedData?: Partial<Record<keyof T, string | number>>[]
//   ) {
//     super(name)
//   }

//   protected seed = async () => {
//     if (!this.seedData) return
//     const query = await this.insertQuery(this.seedData)
//     const queryResult = await this.db.execute(query)

//     console.log(queryResult)

//     return queryResult
//   }

//   public async createMany(data: Partial<Record<keyof T, string | number>>[]) {
//     const query = await this.insertQuery(data)
//     const queryResult = await this.db.execute(query)

//     return queryResult
//   }

//   public async create(data: Partial<Record<keyof T, string | number>>) {
//     const query = await this.insertQuery([data])
//     const queryResult = await this.db.execute(query)

//     return queryResult
//   }

//   public async save(data: Partial<Record<keyof T, string | number>>) {
//     const query = await this.saveQuery(data)
//     const queryResult = await this.db.execute(query)

//     return queryResult
//   }

//   public async findFirst(data: FindOneOptions<T>) {
//     const query = await this.findQuery({ ...data, take: 1 })
//     const queryResult = (await this.db.select(query)) as T[]

//     return queryResult[0]
//   }

//   public async findAll(data: FindAllOptions<T> = { take: this.DEFAULT_TAKE }) {
//     data.take = data.take ?? this.DEFAULT_TAKE
//     const query = await this.findQuery(data)

//     console.log(query)
//     const queryResult = (await this.db.select(query)) as T[]

//     const total = await this.totalQuery(data.where)

//     console.log({
//       totalQuery: total,
//     })
//     const totalResult = (await this.db.select(total)) as { count: number }[]

//     console.log({
//       query,
//       queryResult,
//       total,
//       totalResult,
//     })

//     return {
//       edges: queryResult,
//       pageInfo: {
//         total: totalResult[0].count,
//         limit: data.take as number,
//         offset: 0,
//       },
//     }
//   }

//   public async deleteById(id: number | string) {
//     const query = await this.deleteByIdQuery(id)
//     const queryResult = await this.db.execute(query)

//     return queryResult
//   }
// }
