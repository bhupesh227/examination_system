

"use client";

import { useEffect, useState } from "react";

export default function Timer({
  duration,
  onTimeUp,
}: {
  duration: number; // in minutes
  onTimeUp: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); 

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-gray-100 px-4 py-2 rounded shadow text-sm font-medium">
      Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
}
