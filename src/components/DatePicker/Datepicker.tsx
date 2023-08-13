'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import Tag from '../Tag/Tag';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface IProps {
  onValueChange?: (value?: Date) => void;
}

const DatePicker = (props: IProps) => {
  const [date, setDate] = useState<Date | undefined>();

  const onDateSelect = useCallback(
    (date?: Date) => {
      setDate(date);
      props.onValueChange && props.onValueChange(date);
    },
    [props]
  );

  const isDateSelected = useMemo(() => date, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {isDateSelected ? (
            <Tag className="bg-backgroundPrimary rounded-md p-1.5 text-primary">
              1
            </Tag>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default memo(DatePicker);
