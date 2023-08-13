import { memo, type FC, type PropsWithChildren } from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

interface IProps {
  className?: string
  size?: "small" | "default"
  type?: "default" | "danger" | "primary"
}

const tagVariants = cva("rounded px-1.5 font-medium py-0.5", {
  variants: {
    size: {
      default: "text-base",
      small: "text-xs",
    },
    type: {
      default: "text-[#7A919C] bg-backgroundSecondary",
      danger: "text-error bg-[#FBEFEE]",
      primary: "text-[#1DAFB0] bg-[#F4F9FD]",
    },
  },
})

const Tag: FC<PropsWithChildren<IProps>> = ({
  className,
  size = "default",
  children,
  type,
}) => {
  return (
    <div className={cn(tagVariants({ size, type, className }))}>{children}</div>
  )
}

export default memo(Tag)
