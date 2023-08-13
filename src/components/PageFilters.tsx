import { type FC } from 'react';

import Filters from '@/components/Filters/Filters';
import { type ITableFilterItem } from '@/lib/localTypes';

interface IProps {
  onFilterChange: (filters: any) => void;
  filtersConfig: ITableFilterItem[];
}

export const PageFilters: FC<IProps> = ({ filtersConfig, onFilterChange }) => {
  return (
    <div className={'flex items-start justify-between'}>
      <Filters config={filtersConfig} onFilterChange={onFilterChange} />
    </div>
  );
};
