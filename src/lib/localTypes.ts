export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export type LocaleISO = 'ru' | 'en';

export type TForm = {
  onSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  isLoading?: boolean;
  error: {
    message?: string;
  } | null;
  isError: boolean;
};

export enum FilterFieldType {
  SEARCH = 'SEARCH',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  ENUM = 'ENUM',
}

export interface ITableFilterItem {
  fieldName: string;
  fieldType: FilterFieldType;
  dateOptions?: {
    isRange: boolean;
  };
  query?: any;
  queryOptions?: any; // TODO add typings
}

export interface SelectOption<T = any> {
  id: number;
  name: string;
  record?: T;
}
