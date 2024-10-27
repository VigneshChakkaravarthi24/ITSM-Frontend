import React, { useState, useRef,useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Navbar from '../Navbar/Navbar'; // Adjust the path as needed
import { useLoaderData, useNavigate } from 'react-router-dom';
import picture from '../../../public/listening.jfif'; // Replace with the path to your picture
import Timer from './AudioTimer'; // Import Timer component
import axios from 'axios';
import NavigatePage from '../NavigatePage/NavigatePage';
import BASE_URL from '../../../localhost';
import NoAudioPage from './NoAudio';
const AudioPage2 = () => {
  const [audio, setAudio] = useState();

  const loaderData= useLoaderData()
  console.log("the loader data is",loaderData) //Comment this later
  if(!loaderData)
  {
    return (
  
      <NavigatePage title="Error has occuer while getting audio"
            message="An Error occured while fetching audio. Please go to home and try logging in again"
            goToPath="/"
            buttonText="Take me home"></NavigatePage>
        )    
  }
  const isPlayed = (loaderData.isPlayed); //TO be used when isPlayed is there. 
  const audioSource = loaderData.audio
  const ended = loaderData.ended

  if(ended)
  {
    return (
  
      <NavigatePage title="Question 2 already submitted!"
            message="It seems that you have submitted question 1 already. If not please contanct admin."
            goToPath="/summary"
            buttonText="End test"></NavigatePage>
        )

  }

  if (!audioSource || typeof audioSource !== 'string' || audioSource.length < 1) {
    console.log("No audio found");


    return (

<NoAudioPage/>

    )
  }



};

export default AudioPage2;


export async function loader()
{
  const token = sessionStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`,
};


const result = await axios.get(`${BASE_URL}/user/get-audio/2`,{ headers });
return result.data
};
