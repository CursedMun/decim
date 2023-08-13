import React from 'react';

import { EXTENDED_DATE_FORMAT } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { formatDistance } from 'date-fns';
import { format } from 'date-fns/esm';

interface IProps {
  date: Date;
  format?: string;
  className?: string;
}

const DateRender = (props: IProps) => {
  return (
    <span
      className={cn(props.className, 'whitespace-nowrap')}
      title={format(new Date(props.date), EXTENDED_DATE_FORMAT)}
    >
      {formatDistance(new Date(props.date), new Date(), { addSuffix: true })}
    </span>
  );
};

export default React.memo(DateRender);
