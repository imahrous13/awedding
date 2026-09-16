"use client";

import { useEffect, useState } from "react";
import { weddingData } from "@/data/wedding";

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getParts(now: number): CountdownParts {
  const diff = Math.max(0, new Date(weddingData.dateISO).getTime() - now);

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function arabicDigits(value: string) {
  return value.replace(/[0-9]/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
}

const EMPTY_PARTS: CountdownParts = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export function Countdown({ className = "" }: { className?: string }) {
  const [parts, setParts] = useState<CountdownParts>(EMPTY_PARTS);

  useEffect(() => {
    const tick = () => setParts(getParts(Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const units = [
    { label: "يوم", value: arabicDigits(String(parts.days)) },
    { label: "ساعة", value: arabicDigits(pad(parts.hours)) },
    { label: "دقيقة", value: arabicDigits(pad(parts.minutes)) },
    { label: "ثانية", value: arabicDigits(pad(parts.seconds)) },
  ];

  return (
    <div className={`countdown ${className}`} aria-label="العد التنازلي للزفاف">
      {units.map((unit) => (
        <div className="count-unit" key={unit.label}>
          <span className="count-value">{unit.value}</span>
          <small className="count-label">{unit.label}</small>
        </div>
      ))}
    </div>
  );
}
