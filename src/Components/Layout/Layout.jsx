import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar'; // Adjust the path as needed

const Layout = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    // Load the saved time from localStorage, default to 300 seconds (5 minutes)
    const savedTime = sessionStorage.getItem('globalTimeLeft');
    return savedTime ? parseInt(savedTime, 10) : 120;
  });

  useEffect(() => {
    // Save the timeLeft to localStorage whenever it changes
    sessionStorage.setItem('globalTimeLeft', timeLeft);

    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-100 border-b border-gray-300 p-4 text-center">
        <div className="text-3xl font-bold">
          Timer: {formatTime(timeLeft)}
        </div>
      </div>
      <div className="flex-grow flex items-center justify-center bg-white p-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;
