import React from 'react';
import Navbar from '../Navbar/Navbar'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';
import { useRouteError } from 'react-router-dom';
const NavigatePage = ({ title, message, goToPath ,buttonText,navbar=true}) => {
  const navigate = useNavigate();

  const handleGoToPath = () => {
    navigate(goToPath);
  };

  
  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
     {navbar && <Navbar />}
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 p-6 rounded-lg shadow-lg text-center">
          <h2 style={{ color: '#8B4513' }} className="text-2xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg text-brown-600 dark:text-brown-400 mb-6">
            {message}
          </p>
          <button
            onClick={handleGoToPath}
            className="bg-yellow-500 hover:bg-yellow-600 text-brown-900 dark:text-brown-200 p-2 rounded-lg w-full"
          >
            {buttonText?buttonText:'Go to home'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigatePage;
