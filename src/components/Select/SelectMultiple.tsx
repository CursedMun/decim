"use client"

import * as React from "react"
import { memo, useCallback, useRef } from "react"
import { type Trigger } from "@radix-ui/react-select"
import { Check, ChevronDown, Loader2 } from "lucide-react"

import { SelectOption } from "@/lib/localTypes"
import { cn } from "@/lib/utils"

import SearchInput from "../SearchInput"
import { Command, CommandGroup, CommandItem } from "../ui/command"
import { Label } from "../ui/label"

interface IProps {
  required?: boolean
  label?: string
  placeholder: string
  value?: SelectOption[] | null
  error?: string
  wrapContainerClassName?: string
  searchText?: string
  onSearchChange?: (text: string) => void
  loading?: boolean
  isQuery?: boolean
  options: SelectOption[]
  contentFooterComponent?: JSX.Element | null
  onValueChange: (records: SelectOption[]) => void
  onOpenChange?: (isOpen: boolean) => void
  showCounter?: boolean
  mode?: "single" | "multiple"
  disabled?: boolean
}

const SelectMultiple = (props: IProps) => {
  const {
    onValueChange,
    placeholder,
    searchText,
    onSearchChange,
    isQuery,
    options,
    mode = "single",
  } = props
  const [open, setOpen] = React.useState(false)

  const selectTriggerRef = useRef<React.ElementRef<typeof Trigger> | null>(null)

  const handleOpenChange = (open: boolean) => {
    if (!props.disabled) {
      setOpen(open)
    }
  }

  const handleSelect = useCallback(
    (value: SelectOption, isSelected: boolean) => {
      if (!isSelected) {
        const reuslt =
          mode === "single" ? [value] : [...(props.value || []), value]
        onValueChange && onValueChange(reuslt)
      } else {
        const result =
          mode === "single"
            ? []
            : [...(props.value || [])].filter((i) => i.id !== value.id)
        onValueChange(result)
      }
    },
    [mode, onValueChange, props.value]
  )

  return (
    <div
      className={cn(
        props.wrapContainerClassName,
        props.disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <div
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleOpenChange(!open)
        }}
      >
        {!!props.label && (
          <Label onClick={() => selectTriggerRef.current?.focus()}>
            {props.label}{" "}
            {!!props.required && <span className={"text-error"}>*</span>}
          </Label>
        )}
        <Command className={"overflow-visible bg-transparent"}>
          <div className="group rounded-md border border-input px-2 py-1.5 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <p className="text-text_002 px-1 py-0.5 text-sm font-medium">
                {mode === "single"
                  ? props.value && props.value[0] && props.value[0].name
                    ? props.value[0].name
                    : placeholder
                  : placeholder}
              </p>
              <div className="flex flex-row items-center">
                {props.value &&
                props.showCounter &&
                Array.isArray(props.value) &&
                props.value.length >= 1 ? (
                  <div className="bg-backgroundPrimary mr-1 rounded px-2  py-0.5">
                    <span className="text-xs text-primary">
                      {props.value.length}
                    </span>
                  </div>
                ) : (
                  <div className="mr-1 px-2 py-0.5"></div>
                )}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
            </div>
          </div>
          <div className={`relative`}>
            {open && options.length > 0 ? (
              <div className="absolute top-0 z-50 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                {isQuery && (
                  <SearchInput
                    value={searchText}
                    onChange={(e) =>
                      onSearchChange && onSearchChange(e.target.value)
                    }
                    onBlur={() => handleOpenChange(false)}
                    onFocus={() => handleOpenChange(true)}
                    containerClassName={"w-full max-w-full mb-2"}
                  />
                )}
                <CommandGroup className="h-full overflow-auto">
                  {options.map((option) => {
                    const isSelected = props.value?.find(
                      (i) => i.id === option.id
                    )

                    return (
                      <CommandItem
                        key={option.id}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onSelect={() => {
                          handleSelect(option, !!isSelected)
                        }}
                        className={"cursor-pointer"}
                      >
                        <div className="h-4 w-4">
                          {isSelected ? (
                            <Check className="h-full w-full" />
                          ) : null}
                        </div>
                        {option.name}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                {!!props.loading && (
                  <Loader2 className={"mx-auto my-4 animate-spin"} />
                )}
                {props.contentFooterComponent && props.contentFooterComponent}
              </div>
            ) : null}
          </div>
        </Command>
      </div>
      {open ? (
        <div
          onClick={() => handleOpenChange(false)}
          style={{
            background: "transparent",
            position: "absolute",
            top: "0px",
            left: "0px",
            height: "100%",
            width: "100%",
          }}
        ></div>
      ) : null}
    </div>
  )
}

export default memo(SelectMultiple)
