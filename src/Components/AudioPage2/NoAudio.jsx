import React, { useRef, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Timer from "./AudioTimer";
import Spinner from "../Spinner/Spinner"; // Import your Spinner component
import { useNavigate } from "react-router-dom";

const NoAudioPage = () => {
  const timerRef = useRef();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false); // For controlling spinner visibility

  const handleTimeUp = () => {
    console.log("The time is up.");
    navigate("/write-test-2")
  };

  const handleNext = (event) => {
    event.preventDefault();
    setLoading(true); // Show spinner when "Next" button is clicked

    // Clear the timer
    if (timerRef.current) {
      timerRef.current.clearTimer();
    }

    // Simulate some delay (e.g., navigation or other async tasks)
    setTimeout(() => {
      setLoading(false); // Hide spinner after a delay
      // Navigate to the next page (you can add navigation logic here)
    }, 2000); // Simulating a delay of 2 seconds
    navigate("/write-test-2")

  };

  return (
    <div style={{ backgroundColor: "#FFF9E5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <Timer ref={timerRef} initialTimeLeft={15} onTimeUp={handleTimeUp} />
        <div style={{ textAlign: "center", marginBottom: "24px", fontSize: "1rem", color: "#8B4513" }}>
          <p>
            <strong>Note:</strong> There is no audio file for this question. Please go ahead to the next question.
          </p>
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          disabled={loading} // Disable button when loading
        >
          {loading ? <Spinner loading={true} /> : 'Next'} {/* Show spinner if loading */}
        </button>
      </div>
    </div>
  );
};

export default NoAudioPage;
