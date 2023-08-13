import { type FC } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '../ui/button';

interface IProps {
  currentPageSize: number;
  total: number;
  goPrevious: () => void;
  isPreviousDisabled: boolean;
  goNext: () => void;
  isNextDisabled: boolean;
}

export const TablePagination: FC<IProps> = ({
  currentPageSize,
  total,
  goPrevious,
  goNext,
  isNextDisabled,
  isPreviousDisabled,
}) => {
  return (
    <div className="mt-5 flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {`Показано ${currentPageSize} из ${total}`}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="p-1"
            onClick={goPrevious}
            disabled={isPreviousDisabled}
          >
            <ArrowLeft className="h-4 w-4" />
            <p className="p-2">{'a_back'}</p>
          </Button>
          <Button
            variant="outline"
            className="p-1"
            onClick={goNext}
            disabled={isNextDisabled}
          >
            <p className="p-2">{'a_forward'}</p>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
