"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuantitySelectorProps {
  quantity: number; // From Parent
  setQuantity: (val: number | ((prev: number) => number)) => void; // Setter from Parent
}

export default function QuantitySelector({ quantity, setQuantity }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 p-2 h-14 rounded-md">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setQuantity((q) => Math.max(1, q - 1))} // Updates parent state
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-6 text-center text-sm font-medium tabular-nums text-gray-900">
        {quantity}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setQuantity((q) => q + 1)} // Updates parent state
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}