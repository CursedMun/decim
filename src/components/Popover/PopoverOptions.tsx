import { type FC } from 'react';

import { IOption } from '../Select/Select';

export interface IPopoverOption extends IOption {
  isDanger?: boolean;
}
interface IProps {
  options: IPopoverOption[];
  onOptionClick?: (option: string) => void;
}

export const PopoverOptions: FC<IProps> = ({ options, onOptionClick }) => {
  const onClick = (option: string) => {
    if (!!onOptionClick) {
      onOptionClick(option);
    }
  };
  return (
    <>
      {options.map((option, index) => (
        <div
          onClick={() => onClick(option.value as string)}
          key={`${option.value}-${index}`}
          className={
            'hover:bg-backgroundSecondary group cursor-pointer rounded-md px-3 py-1.5'
          }
        >
          <p
            className={`group-hover:text-text font-sans text-sm font-medium text-[#677075] ${
              option.isDanger && 'text-red-500'
            }`}
          >
            {option.name}
          </p>
        </div>
      ))}
    </>
  );
};
