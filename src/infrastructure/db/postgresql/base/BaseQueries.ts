import type Database from 'tauri-plugin-sql-api';

import { error, log } from '@/lib/logger';
import BaseSQLQueries from './BaseSQLQueries';
import { type TExtTable } from './BaseTable';

export type TFindAllResult<T> = {
  edges: (T & TExtTable)[];
  pageInfo: {
    total: number;
    limit: number;
    offset: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
type StringKeysWithContains<T> = {
  [Key in keyof T]: Key extends string ? { contains: string } : never;
};
export type FindOneOptions<T> = {
  where?: Partial<T | StringKeysWithContains<T>>;
  sort?: Partial<Record<keyof T, 'ASC' | 'DESC'>>;
};
export type FindAllOptions<T> = FindOneOptions<T> & {
  take?: number;
  skip?: number;
};
export class BaseQuery<
  T extends Record<string, string | number>
> extends BaseSQLQueries<T> {
  private DEFAULT_TAKE = 100;

  constructor(
    protected db: Database,
    protected name: string,
    private seedData?: Partial<Record<keyof T, string | number>>[]
  ) {
    super(name);
  }

  protected seed = async () => {
    if (!this.seedData) return;
    const query = await this.insertQuery(this.seedData);

    const queryResult = await this.db
      .execute(query)
      .catch((err) => error({ err, query }));

    return queryResult;
  };

  public async createMany(data: Partial<Record<keyof T, string | number>>[]) {
    const query = await this.insertQuery(data);
    const queryResult = await this.db
      .execute(query)
      .catch((err) => error({ err, query }));

    return queryResult;
  }

  public async create(data: Partial<Record<keyof T, string | number>>) {
    const query = await this.insertQuery([data]);
    const queryResult = await this.db
      .execute(query)
      .catch((err) => error({ err, query }));

    return queryResult;
  }

  public async save(data: Partial<Record<keyof T, string | number>>) {
    const query = await this.saveQuery(data);
    const queryResult = await this.db
      .execute(query)
      .catch((err) => error({ err, query }));

    return queryResult;
  }

  public async findFirst(data: FindOneOptions<T>) {
    return (await this.findAll({ ...data, take: 1 })).edges[0];
  }

  public async findAll(data: FindAllOptions<T> = { take: this.DEFAULT_TAKE }) {
    data.take = data.take ?? this.DEFAULT_TAKE;
    data.skip = data.skip ?? 0;
    const query = await this.findQuery(data);

    log({ query });
    const queryResult = (await this.db
      .select(query)
      .catch((err) => error({ err, query }))) as T[];

    log({ queryResult: JSON.parse(JSON.stringify(queryResult)) });

    const total = await this.totalQuery(data.where);

    const totalResult = (await this.db
      .select(total)
      .catch((err) => error({ err, query }))) as {
      count: number;
    }[];

    log({
      hasNextPage: totalResult[0].count > data.take + data.skip,
      hasPreviousPage: data.skip > 0,
    });

    return {
      edges: queryResult.map((item) => {
        if ('createdAt' in item) {
          (item as any).createdAt = new Date(
            item['createdAt'].toString().replace('00:00:00', '00:00')
          );
        }
        if ('updatedAt' in item) {
          (item as any).updatedAt = new Date(
            item['updatedAt'].toString().replace('00:00:00', '00:00')
          );
        }

        return item;
      }),
      pageInfo: {
        total: totalResult[0].count,
        limit: data.take as number,
        offset: data.skip,
        hasNextPage: totalResult[0].count > data.take + data.skip,
        hasPreviousPage: data.skip > 0,
      },
    };
  }

  public async deleteById(id: number | string) {
    const query = await this.deleteByIdQuery(id);
    const queryResult = await this.db
      .execute(query)
      .catch((err) => error({ err, query }));

    return queryResult;
  }
}
