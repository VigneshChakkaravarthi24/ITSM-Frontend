import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar'; // Adjust the path as needed
import { FaBook } from 'react-icons/fa'; // Using react-icons for the content icon
import { useNavigate } from 'react-router-dom';
import Timer from './Timer'; // Adjust the path as needed
import axios from 'axios';
import NavigatePage from '../NavigatePage/NavigatePage';
import BASE_URL from '../../../localhost';
import { useLoaderData } from 'react-router-dom';
const EssayPage = () => {

  const loaderData=useLoaderData()

    if(loaderData.data.ended)
    {
      return <NavigatePage buttonText="Go to Home" message="You have submitted your answer. Contact admin if not. " title="Exam ended already"  goToPath="/"></NavigatePage>

    }
    let essayContent = loaderData.data.question.question
    const navigate = useNavigate();
  
  


  const handleTimeUp = () => {
    navigate("/essay-audio-2")
  };

  const handleNext = () => {
    
      navigate("/essay-audio-2")
  
  };


  return (
    <div className="h-screen flex flex-col">
  <Navbar />
  <div className="p-4 flex-grow flex">
    {/* First Column */}
    <div className="w-1/2 p-4 border-r border-gray-300 bg-yellow-100 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
      <div className="flex items-center mb-4">
        <FaBook className="text-2xl text-brown-300 mr-2" />
        <h1 className="text-3xl font-bold">Essay Content</h1>
      </div>
      {essayContent.trim().split('\n\n').map((paragraph, index) => (
        <p key={index} className="mb-4">
          {paragraph}
        </p>
      ))}
    </div>

    {/* Second Column */}
    <div className="w-1/2 p-4 flex flex-col items-center justify-start">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Give yourself 3 minutes to read this essay.</h2>
        <Timer initialTime={180} onTimeUp={handleTimeUp} />
        <button
          onClick={handleNext}
          className="bg-yellow-300 text-brown-600 p-3 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default EssayPage;

export async function loader()
{
  const token = sessionStorage.getItem("token");
  let headers = { Authorization: `Bearer ${token}` };
  try
  {
    const result = await axios.get(`${BASE_URL}/user/get-question/2`, { headers });
    if(!result)
      {
        console.log("the result is",result)
        throw new Response(JSON.stringify({message:"Unable to reach server", buttonText:"Go Home",title:"Server error",goToPath:"/",navbar:true},{status:500}))

      }
      else if(result && result.data&& result.data.errorMessage)
      {
        throw new Response(JSON.stringify({message:result.data.errorMessage,buttonText:"Go Home",title:"Oops!",goToPath:"/"}),{status:500})
      }
      return result


  }
  catch(error)
  {
    throw new Response(JSON.stringify({message:error.message, buttonText:"Go Home",title:"Server error",goToPath:"/",navBar:true},{status:500}))

  }




}