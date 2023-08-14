import { configureDatabase } from './db/client';
import { configureTables } from './tables';

const isNode = (): boolean =>
  Object.prototype.toString.call(
    typeof process !== 'undefined' ? process : 0
  ) === '[object process]';

export type TConfig = {
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
    if (!config.SECRET_KEY) {
      return {
        error: `Please configure your secret key in ${path} file`,
        path,
      };
    }
  } else {
    config = {
      SECRET_KEY: '',
    };
    await writeTextFile(path, JSON.stringify(config));

    return { error: `Please configure your secret key in ${path} file`, path };
  }
  app.config = config;
  if (app.tables) return app as TApp;
  const db = await configureDatabase();

  const tables = configureTables(db as any, config);

  app.tables = tables;

  return app as TApp;
}
