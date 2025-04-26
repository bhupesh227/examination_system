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
    
    if (duration <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, onTimeUp]); 


  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  
  const isTimeLow = timeLeft <= 30; // Visual Warning

  return (
    <div className={`px-4 py-2 rounded shadow text-sm font-medium ${
      isTimeLow ? 'bg-red-100 text-red-800' : 'bg-gray-100'
    }`}>
      Time Left: {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}