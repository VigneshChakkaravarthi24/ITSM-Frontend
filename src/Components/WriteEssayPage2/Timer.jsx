import React, { useState, useEffect } from 'react';

const Timer = ({ duration, name, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = sessionStorage.getItem(name);
    return savedTime ? Math.max(parseInt(savedTime, 10), 0) : duration;
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        sessionStorage.setItem(name, newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, name, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="text-3xl font-bold text-red-500 mb-4">
      Time Left: {formatTime(timeLeft)}
    </div>
  );
};

export default Timer;
