import { memo, type FC, type PropsWithChildren } from "react"

import {
  SheetContent,
  SheetHeader,
  Sheet as SheetShadcn,
  SheetTitle,
} from "./ui/sheet"

interface IProps {
  isOpen: boolean
  changeIsOpen: (isOpen: boolean) => void
  title?: string
}

const Sheet: FC<PropsWithChildren<IProps>> = ({
  children,
  isOpen,
  changeIsOpen,
  title,
}) => {
  return (
    <SheetShadcn onOpenChange={changeIsOpen} open={isOpen}>
      <SheetContent className={"overflow-auto"}>
        {!!title && (
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
        )}
        {children}
      </SheetContent>
    </SheetShadcn>
  )
}

export default memo(Sheet)
