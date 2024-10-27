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
  console.log("The loader data is",loaderData)
  if(!loaderData)
  {
    return (
  
      <NavigatePage title="Error has occuer while getting audio"
            message="An Error occured while fetching audio. Please go to home and try logging in again"
            goToPath="/"
            buttonText="Take me home"></NavigatePage>
        )    
  }
  if(loaderData.data.ended)
    {
      return <NavigatePage buttonText="Take me to question 2" message="You have submitted question 1 already. Go to question 2. " title="Question 1 submitted already"  goToPath="/essay-2"></NavigatePage>

    }
  const isPlayed = (loaderData.data.isPlayed); //TO be used when isPlayed is there. 
  const audioSource = loaderData.data.question.audio
  const ended = loaderData.data.ended

  if(ended)
  {
    return (
  
      <NavigatePage title="Question 1 already submitted!"
            message="It seems that you have submitted question 1 already. If not please contanct admin."
            goToPath="/essay-1"
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



