import React, { useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { useNavigate } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import NavigatePage from '../NavigatePage/NavigatePage';

const AudioTestPage = () => {
  const [hasAgreed, setHasAgreed] = useState(false);
  const navigate=useNavigate()

  const loaderData=useLoaderData()
  if(loaderData && loaderData.data && loaderData.data.errorMessage)
    {
      return <NavigatePage navbar={false}buttonText="Back to login" message={loaderData.data.errorMessage} title="Oops!!"  goToPath="/"></NavigatePage>
  
    }
  if((!loaderData)||(!loaderData.data.message))
  {
    
    return <NavigatePage buttonText="Back to login" message="You might be logged out. Please login again" title="Oops!!"  goToPath="/"></NavigatePage>
  }


  const handleNext = () => {
  
     navigate("/test-instructions")
 
 
  

   }
  return (
    <div style={{ backgroundColor: '#FFF9E5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '16px', color: '#8B4513' }}>
          Audio Test
        </h1>
        <ul style={{ marginBottom: '24px', fontSize: '1.125rem', listStyleType: 'disc', paddingInlineStart: '20px' }}>
          <li>This is to check if your audio output works.</li>
          <li>The audio will be played only once during the exam.</li>
          <li>You can change the volume while it is playing.</li>
          <li>Test this audio file before entering the exam.</li>
        </ul>
        
        {/* React Audio Player */}
        <ReactAudioPlayer
    // src={process.env.PUBLIC_URL + '/test.mp3'}

          controls
          volume={0.5} // Initial volume set to 50%
          style={{ marginBottom: '24px' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <input
            type="checkbox"
            id="agree"
            style={{ marginRight: '8px' }}
            checked={hasAgreed}
            onChange={() => setHasAgreed(!hasAgreed)}
          />
          <label htmlFor="agree" style={{ fontSize: '1.125rem' }}>
            I agree to the terms
          </label>
        </div>

        <button
          onClick={handleNext}
          style={{
            backgroundColor: '#FFD700',
            color: '#8B4513',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            width: '100%',
            maxWidth: '200px',
          }}
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default AudioTestPage;
