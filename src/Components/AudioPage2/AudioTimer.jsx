import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const Timer = forwardRef(({ initialTimeLeft, onTimeUp }, ref) => {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);

  useImperativeHandle(ref, () => ({
    resetTimer: () => setTimeLeft(initialTimeLeft),
    clearTimer: () => setTimeLeft(0)
  }));

  useEffect(() => {
    // Make sure the time is greater than zero before starting the interval
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Cleanup interval on component unmount or if timeLeft changes
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    // If the time reaches 0, call onTimeUp
    if (timeLeft === 0 && onTimeUp) {
      onTimeUp(); // Call the callback when time is up
    }
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '1.875rem', fontWeight: 'bold', color: '#8B4513' }}>
      Time Left: {formatTime(timeLeft)}
    </div>
  );
});

export default Timer;
