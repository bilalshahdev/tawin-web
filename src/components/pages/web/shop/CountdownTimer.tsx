"use client"

import { useCountdown } from "@/utils/useCountdown"
import { useTranslations } from "next-intl"

export default function CountdownTimer() {
  const t = useTranslations("translation");
  const end = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 12 * 60 * 1000 + 2 * 1000)
  const { second, minute, hour, day } = useCountdown(end)

  const units = [
    { label: "day", value: day },
    { label: "hour", value: hour },
    { label: "minute", value: minute },
    { label: "second", value: second }
  ]

  return (
    <div className="flex items-center justify-center gap-2">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <div className="flex h-12 w-14 items-center justify-center bg-gray-100">
            <span className="text-xl font-semibold text-foreground tabular-nums">
              {String(value).padStart(2, "0")}
            </span>
          </div>
          {/* Using t(label) to dynamically fetch "day", "hour", etc. */}
          <span className="text-[10px] text-muted-foreground">{t(label)}</span>
        </div>
      ))}
    </div>
  )
}