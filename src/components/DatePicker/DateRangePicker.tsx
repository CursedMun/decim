"use client"

import * as React from "react"
import { memo, useCallback } from "react"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"

import Tag from "../Tag/Tag"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  onValueChange?: (value?: DateRange | undefined) => void
  value?: string
  label?: string
}

const DateRangePicker = (props: IProps) => {
  const { className } = props

  const stringToDateRange = useCallback((value?: string) => {
    if (!value) {
      return undefined
    }
    const splittedValue = value.split("_")

    if (
      !splittedValue ||
      splittedValue.length < 2 ||
      !splittedValue[0] ||
      !splittedValue[1]
    ) {
      return undefined
    }

    return {
      from: new Date(splittedValue[0]),
      to: new Date(splittedValue[1]),
    }
  }, [])

  const [date, setDate] = React.useState<DateRange | undefined>(
    stringToDateRange(props.value)
  )

  const onDateSelect = useCallback(
    (date: DateRange | undefined) => {
      setDate(date)
      if (!date?.from || !date.to) {
        return
      }
      props.onValueChange && props.onValueChange(date)
    },
    [props]
  )

  const isDateSelected = React.useMemo(
    () => props.value && date && date.from && date.to,
    [date, props.value]
  )

  return (
    <div className={cn("grid gap-0", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "my-0 h-9 w-[100x] justify-start py-0 text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="font-inter text-text_002 text-sm">
              {props.label}
            </span>
            {isDateSelected ? (
              <Tag className="bg-backgroundPrimary ml-2 rounded-md px-2 py-1 text-xs text-primary">
                1
              </Tag>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default memo(DateRangePicker)
