import { configureApp, type TApp } from '@/infrastructure/app';

export let app: TApp;
export let useApp = () => {
  return app.tables;
};
export async function initGlobalApp() {
  if (app) return app;
  const appInit = await configureApp();

  console.log(appInit);
  if (!appInit) return null;
  if ('error' in appInit) return appInit;
  app = appInit;
  console.log('app', app);
  useApp = () => app.tables;

  return app;
}
