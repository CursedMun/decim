import React, { useRef, type ChangeEvent, type FC, type ReactNode } from "react"
import {
  Select as SelectComponent,
  SelectValue,
  type SelectProps,
  type Trigger,
} from "@radix-ui/react-select"
import { Loader2 } from "lucide-react"

import SearchInput from "../SearchInput"
import { Label } from "../ui/label"
import { SelectContent, SelectItem, SelectTrigger } from "../ui/select"

interface IProps {
  containerClassName?: string
  placeholder: string
  options: IOption[]
  label?: string
  required?: boolean
  wrapContainerClassName?: string
  error?: string
  isQuery?: boolean
  loading?: boolean
  contentFooterComponent?: ReactNode
  searchText?: string
  onSearchChange?: (text: string) => void
  onValueChange?: (value: string, record?: any) => void
}

export interface IOption {
  value: string | number
  name: string
  record?: any
}

type TSelectProps = SelectProps & IProps

export const Select: FC<TSelectProps> = (props) => {
  const selectTriggerRef = useRef<React.ElementRef<typeof Trigger> | null>(null)
  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!!props.onSearchChange) {
      props.onSearchChange(event.target.value)
    }
  }
  return (
    <div className={`${props.wrapContainerClassName || ""}`}>
      {!!props.label && (
        <Label onClick={() => selectTriggerRef.current?.focus()}>
          {props.label}{" "}
          {!!props.required && <span className={"text-error"}>*</span>}
        </Label>
      )}
      <SelectComponent
        {...props}
        onValueChange={(value) => {
          const option = props.options.find((i) => i.value == value)
          props.onValueChange && props.onValueChange(value, option?.record)
        }}
      >
        <SelectTrigger
          ref={selectTriggerRef}
          className={`${props.containerClassName || ""} ${
            props.error ? "border-error" : ""
          }`}
        >
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {props.isQuery && (
            <SearchInput
              value={props.searchText}
              onChange={onSearchChange}
              containerClassName={"w-full max-w-full mb-2"}
            />
          )}
          {props.options.map((option, index) => (
            <SelectItem key={`option-${index}`} value={`${option.value}`}>
              {option.name}
            </SelectItem>
          ))}
          {!!props.loading && (
            <Loader2 className={"mx-auto my-4 animate-spin"} />
          )}
          {!!props.contentFooterComponent && props.contentFooterComponent}
        </SelectContent>
      </SelectComponent>
      {!!props.error && (
        <p className="text-error mt-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          {props.error}
        </p>
      )}
    </div>
  )
}
