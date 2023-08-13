import { configureDatabase } from './db/client';
import { configureTables } from './tables';

const isNode = (): boolean =>
  Object.prototype.toString.call(
    typeof process !== 'undefined' ? process : 0
  ) === '[object process]';

export type TConfig = {
  DB_PATH: string;
  DB_TYPE: 'sqlite' | 'postgres';
  SECRET_KEY: string;
};

const app = {
  tables: undefined,
  config: undefined,
} as App;

type App = {
  tables?: Awaited<ReturnType<typeof configureTables>>;
  config?: TConfig;
};
export type TApp = Required<App>;
export async function configureApp() {
  if (isNode()) {
    return;
  }
  const { exists, readTextFile, writeTextFile } = await import(
    '@tauri-apps/plugin-fs'
  );
  const { appConfigDir } = await import('@tauri-apps/api/path');
  const appConfigDirPath = await appConfigDir();

  const path = `${appConfigDirPath}/config.decim`;
  let config: TConfig;

  if (await exists(path)) {
    const fileJson = await readTextFile(path);

    config = JSON.parse(fileJson) as TConfig;
    if (!config.DB_PATH || !config.DB_TYPE) {
      return { error: `Please configure your database in ${path} file`, path };
    }
  } else {
    config = {
      DB_PATH: '',
      DB_TYPE: 'postgres',
      SECRET_KEY: '',
    };
    await writeTextFile(path, JSON.stringify(config));

    return { error: `Please configure your database in ${path} file`, path };
  }
  console.log(config);
  app.config = config;
  if (app.tables) return app as TApp;
  const db = await configureDatabase(config);
  const tables = configureTables(db, config);

  app.tables = tables;

  return app as TApp;
}
