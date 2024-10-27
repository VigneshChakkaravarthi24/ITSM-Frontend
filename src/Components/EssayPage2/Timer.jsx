import React, { useState, useEffect, useCallback } from 'react';

const Timer = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  // Callback to handle time up
  const handleTimeUp = useCallback(() => {
    if (onTimeUp) onTimeUp();
  }, [onTimeUp]);

  useEffect(() => {
    // Start the interval when the component mounts
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer); // Clear interval when time is up
          handleTimeUp(); // Trigger the onTimeUp callback
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Decrease time by 1 second

    return () => clearInterval(timer); // Cleanup on unmount
  }, [handleTimeUp]);

  // Format time to mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="text-3xl font-bold text-red-500 mb-6">
      Time Left: {formatTime(timeLeft)}
    </div>
  );
};

export default Timer;
