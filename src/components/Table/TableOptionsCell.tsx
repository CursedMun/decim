import { type FC } from "react"
import { MoreHorizontal } from "lucide-react"

import { Popover } from "../Popover/Popover"
import { PopoverOptions, type IPopoverOption } from "../Popover/PopoverOptions"

interface IProps {
  options: IPopoverOption[]
  onOptionClick: (option: string, id: number) => void
  id: number
}

export const TableOptionsCell: FC<IProps> = ({
  options,
  onOptionClick,
  id,
}) => {
  return (
    <div className={"flex w-full justify-end"}>
      <Popover
        triggerComponent={
          <div className={"p-2.5"}>
            <MoreHorizontal color={"#9CA4A9"} size={16} />
          </div>
        }
        contentComponent={
          <PopoverOptions
            onOptionClick={(option) => onOptionClick(option, id)}
            options={options}
          />
        }
        contentClassname={"absolute right-[-20px] top-0"}
      />
    </div>
  )
}
