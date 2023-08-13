import { type FC, type ReactNode } from "react"
import { Map as MapIcon, Table as TableIcon } from "lucide-react"

import { ITableFilterItem } from "@/lib/localTypes"

import Filters from "../Filters/Filters"

interface IProps {
  onFilterChange: (filters: any) => void
  filtersConfig: ITableFilterItem[]
  firstIcon?: ReactNode
  secondIcon?: ReactNode
  tab?: TTab
  onTabChange?: (tab: TTab) => void
  isIconsHidden?: boolean
}
export type TTab = "first" | "second"
export const TableFilters: FC<IProps> = ({
  filtersConfig,
  onFilterChange,
  firstIcon,
  secondIcon,
  tab,
  onTabChange,
  isIconsHidden,
}) => {
  return (
    <div className={"flex items-start justify-between"}>
      <Filters config={filtersConfig} onFilterChange={onFilterChange} />
      {!isIconsHidden && (
        <div className={"flex gap-1 rounded-md border border-border p-1"}>
          <div
            className={`cursor-pointer rounded p-1.5 ${
              tab === "first" && "bg-hover"
            }`}
            onClick={() => onTabChange?.("first")}
          >
            {firstIcon ? firstIcon : <TableIcon size={16} color={"#677075"} />}
          </div>
          <div
            className={`cursor-pointer rounded p-1.5 ${
              tab === "second" && "bg-hover"
            }`}
            onClick={() => onTabChange?.("second")}
          >
            {secondIcon ? secondIcon : <MapIcon size={16} color={"#677075"} />}
          </div>
        </div>
      )}
    </div>
  )
}
