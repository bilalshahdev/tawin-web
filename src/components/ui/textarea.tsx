import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: boolean
  errorMessage?: string
}

function Textarea({ className, error, errorMessage, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      <textarea
        data-slot="textarea"
        className={cn(
          "border-input placeholder:text-gray-400 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-100",
          className
        )}
        {...props}
      />
      {error && errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  )
}

export { Textarea }
