import { clsx, type ClassValue } from 'clsx';
import format from 'date-fns/format';
import { twMerge } from 'tailwind-merge';

import { EXTENDED_DATE_FORMAT } from './constants';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export const formatDate = (date?: Date, newDateFormat?: string) => {
  if (!date) {
    return '';
  }

  return format(date, newDateFormat || EXTENDED_DATE_FORMAT);
};
