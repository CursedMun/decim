/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import chalk from 'chalk';
function getCallerName() {
  // Get stack array
  try {
    const orig = Error.prepareStackTrace;

    Error.prepareStackTrace = (error, stack) => stack;
    const { stack } = new Error();

    Error.prepareStackTrace = orig;

    const caller = (stack as any)[2];

    return caller ? caller.getFunctionName() : undefined;
  } catch (e) {
    return 'Decim';
  }
}
export function log(...message: any[]) {
  console.log(
    chalk.green(`[LOG] [${new Date().toISOString()}] [${getCallerName()}]`),
    ...message
  );
}

export function error(...message: any[]) {
  console.log(
    chalk.red(`[ERROR] [${new Date().toISOString()}] [${getCallerName()}]`),
    ...message
  );
}
