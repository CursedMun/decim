import {
  Popover as PopoverShadcn,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { type FC, type ReactNode } from 'react';

import { PopoverContent } from '../ui/popover';

interface IProps {
  triggerComponent: ReactNode;
  contentComponent: ReactNode;
  triggerClassname?: string;
  contentClassname?: string;
}

export const Popover: FC<IProps> = ({
  triggerComponent,
  contentComponent,
  triggerClassname,
  contentClassname,
}) => {
  return (
    <PopoverShadcn>
      <PopoverTrigger className={triggerClassname || ''}>
        {triggerComponent}
      </PopoverTrigger>
      <PopoverContent className={contentClassname || ''}>
        {contentComponent}
      </PopoverContent>
    </PopoverShadcn>
  );
};
