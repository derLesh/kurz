import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "",
        fixed: "resize-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  asChild?: boolean
  limit?: number
  value?: string
  defaultValue?: string
}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, variant, limit, value, defaultValue, ...props }, ref) => {
  const [charCount, setCharCount] = React.useState(
    (value?.toString().length || defaultValue?.toString().length || 0)
  )
  const [isNearLimit, setIsNearLimit] = React.useState(false)

  React.useEffect(() => {
    if (value !== undefined) {
      const length = value.toString().length
      setCharCount(Math.min(length, limit || length))
      setIsNearLimit(limit ? limit - length <= 3 : false)
    }
  }, [value, limit])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (limit && e.target.value.length > limit) {
      return
    }

    const inputLength = e.target.value.length
    setCharCount(inputLength)
    
    if (limit) {
      setIsNearLimit(limit - inputLength <= 10)
    }

    if (props.onChange) {
      props.onChange(e)
    }
  }

  return (
    <div className="relative">
      <textarea
        className={cn(
          textareaVariants({ variant, className }),
          isNearLimit && "text-red-500",
          className
        )}
        ref={ref}
        onChange={handleChange}
        value={value}
        defaultValue={defaultValue}
        maxLength={limit}
        {...props}
      />
      {limit && (
        <div 
          className={cn(
            "absolute bottom-2 right-2 text-xs text-muted-foreground select-none",
            isNearLimit && "text-red-500"
          )}
        >
          {charCount}/{limit}
        </div>
      )}
    </div>
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
