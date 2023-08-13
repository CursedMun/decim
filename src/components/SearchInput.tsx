import { Search } from 'lucide-react';
import { memo, type FC } from 'react';

import { DEFAULT_ICON_COLOR } from '@/lib/constants';
import { type InputProps } from '@/lib/localTypes';

import Input from './ui/input';

interface IProps {
  containerClassName?: string;
}

const SearchInput: FC<InputProps & IProps> = (props) => {
  return (
    <div className={`relative w-[240px] ${props.containerClassName || ''}`}>
      <Search
        size={16}
        color={DEFAULT_ICON_COLOR}
        className={'absolute left-[12px] top-[12px]'}
      />
      <Input placeholder={'a_search'} {...props} className={'pl-9 pr-3'} />
    </div>
  );
};

export default memo(SearchInput);
