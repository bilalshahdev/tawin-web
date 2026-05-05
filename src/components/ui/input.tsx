import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "auth"
  error?: boolean
  errorMessage?: string
}

function Input({ className, type, variant = "default", error, errorMessage, ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "flex w-full min-w-0 transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 text-sm",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",

          variant === "default" && [
            "h-[52px] px-4 rounded-full bg-gray-50 border-transparent border",
            "placeholder:text-gray-400",
            "focus-visible:ring focus-visible:ring-purple-100 focus-visible:border-aqua",
            error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-100"
          ],

          variant === "auth" && [
            "h-9 rounded-none border-0 border-b border-border bg-transparent shadow-none",
            "placeholder:text-muted-foreground",
            "focus-visible:ring-0 focus-visible:border-aqua",
            error && "border-red-500 focus-visible:border-red-500"
          ],

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

export { Input }