import { useEffect, useState } from "react"

export function useCountdown(endDate: Date) {
    const calc = () => {
        const diff = Math.max(0, endDate.getTime() - Date.now())
        return {
            second: Math.floor((diff / 1000) % 60),
            minute: Math.floor((diff / 1000 / 60) % 60),
            hour: Math.floor((diff / 1000 / 60 / 60) % 24),
            day: Math.floor(diff / 1000 / 60 / 60 / 24),
        }
    }
    const [time, setTime] = useState(calc)
    useEffect(() => {
        const id = setInterval(() => setTime(calc()), 1000)
        return () => clearInterval(id)
    }, [])
    return time
}