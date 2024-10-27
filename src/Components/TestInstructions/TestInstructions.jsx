// TestInstructionsPage.js
import React, { useState } from 'react';
import { json, useLoaderData, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'; // Adjust the path as needed
import axios from 'axios';
import { ClipLoader } from 'react-spinners'; // Import the spinner component
import Timer from './Timer'; // Import the Timer component
import BASE_URL from '../../../localhost';
import NavigatePage from '../NavigatePage/NavigatePage';
const sharedClasses = {
  border: 'border border-brown-300 dark:border-yellow-700',
  textLight: 'text-yellow-900 dark:text-brown-200',
  textDark: 'text-brown-300 dark:text-yellow-700',
  bgLight: 'bg-brown-300 dark:bg-yellow-700',
  bgDark: 'bg-yellow-700 dark:bg-brown-300',
  p: 'p-2',
  button: 'bg-yellow-300 dark:bg-brown-600 text-yellow-900 dark:text-brown-200 p-2 rounded-lg w-full',
  timer: 'text-3xl font-bold',
  list: 'list-disc pl-5 text-left',
};

const TestInstructionsPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const loaderData=useLoaderData()
  if(loaderData && loaderData.data && loaderData.data.errorMessage)
    {
      return <NavigatePage buttonText="Back to login" message={loaderData.data.errorMessage} title="Oops!!"  goToPath="/"></NavigatePage>
  
    }
  if((!loaderData)||(!loaderData.data.message))
    {
      
      return <NavigatePage buttonText="Back to login" message="You might be logged out. Please login again" title="Oops!!"  goToPath="/"></NavigatePage>
    }

  const [loading, setLoading] = useState(false); // Add loading state





  const handleOnClick = async () => {
      navigate("/essay")
    
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-100 border-b border-gray-300 p-4 text-center">
        <Timer 
          initialTime={120} // Set timer for 2 minutes
          onTimeUp={()=>{
            
            navigate("/essay")}} // Redirect to /essay when timer expires
        />
      </div>
      <div className="flex-grow flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-lg bg-gray-100 border border-gray-300 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-brown-300">Instructions</h1>
          <p className="mt-4 text-left">
            This is a writing test.
          </p>
          <ul className={`mt-4 ${sharedClasses.list}`}>
            <li>For this task, you will have 3 minutes to read a passage about an academic topic.</li>
            <li>You may take short notes on a piece of paper.</li>
            <li>You will have 20 minutes to write a detailed summary of the lecture.</li>
            <li>Explain how the lecture relates to the reading passage.</li>
            <li>While you write, you will be able to see the reading passage. Your notes will not be scored.</li>
          </ul>
          <button
            className={`${sharedClasses.button} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleOnClick}
            disabled={loading} // Disable button when loading
          >
            {loading ? <ClipLoader size={20} color={"#ffffff"} /> : 'Start Test'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestInstructionsPage;

