import React, { useState, useEffect } from 'react';

const Timer = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [hasTimeUp, setHasTimeUp] = useState(false); // New state to handle the time up event

  useEffect(() => {
    if (timeLeft <= 0 && !hasTimeUp) {
      setHasTimeUp(true); // Set flag to true when the timer hits 0
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasTimeUp]);

  useEffect(() => {
    // Call onTimeUp only after the render has completed
    if (hasTimeUp && onTimeUp) {
      onTimeUp();
    }
  }, [hasTimeUp, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="text-3xl font-bold">
      Timer: {formatTime(timeLeft)}
    </div>
  );
};

export default Timer;
