"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  expiryDate: string;
}

export default function CountdownTimer({ expiryDate }: Props) {
  const t = useTranslations("translation");

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    if (!expiryDate) return;

    const targetTime = new Date(expiryDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-xs">{t("offerEndsIn")}:</p>

      <div className="flex gap-3 ltr:justify-start rtl:justify-end">
        {[
          { val: timeLeft.days, label: t("days") },
          { val: timeLeft.hours, label: t("hours") },
          { val: timeLeft.minutes, label: t("minutes") },
          { val: timeLeft.seconds, label: t("seconds") },
        ].map((time, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="bg-white text-black w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-xl md:text-2xl font-semibold shadow-lg">
              {time.val}
            </div>

            <span className="text-[10px] text-gray-500 mt-2 uppercase font-semibold tracking-tighter">
              {time.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
