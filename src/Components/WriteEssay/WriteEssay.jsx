import React, { useState, useEffect, useRef } from 'react';
import { FaBook } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import BASE_URL from '../../../localhost';
import TextEditor from "./EssayEditor";
import Timer from "./Timer";
import NavigatePage from '../NavigatePage/NavigatePage';
import { ClipLoader } from 'react-spinners'; // Add the spinner

const WriteEssayPage = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null); // Ref to access TextEditor methods
  const [timerDuration, setTimerDuration] = useState(null);
  const [essayContent, setEssayContent] = useState("loading...");
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ended, setEnded] = useState(false);
  const [timerUpHandled, setTimerUpHandled] = useState(false); // Flag to track if the timer has already been handled
  const [pageError,setPageError] = useState(false);
  useEffect(() => {
    const getQuestion = async () => {
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      
      try {
        const result = await axios.get(`${BASE_URL}/user/get-question`, { headers });
        if (result && result.data && result.data.quiz) {
          setEssayContent(result.data.quiz.quizQuestion);
          setPrompt(result.data.quiz.prompt);
          setTimerDuration(parseInt(result.data.remainingTime, 10) || 0); // Ensure valid number
          sessionStorage.setItem("timer1", result.data.remainingTime);
          setAnswer(result.data.answer);
        } else if (result && result.data && result.data.errorMessage) {
          setPageError(result.data.errorMessage);
        }
        else
        {
          setEnded(true)
        }
       
      } catch (error) {
        // Handle the error
      }
    };

    getQuestion();
    

  }, [navigate]);
  const saveAnswer = async (text,verbatimFlagged, ended) => {
    setSaving(true);
    const token = sessionStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const remainingTime = parseInt(sessionStorage.getItem("timer1"), 10) || 0;
    
    try {
      const result = await axios.post(`${BASE_URL}/user/save-answers`, {
        answer: text,
        remainingTime: remainingTime,
        ended: ended,
        verbatimFlagged:verbatimFlagged
      }, { headers });
      return result;
    } catch (error) {
      console.error("Error saving answer:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleOnSubmit = async (text,verbatimFlagged) => {
      setSubmitting(true);
      try {
        await saveAnswer(text,verbatimFlagged, true).then(() => navigate("/summary"));
      } finally {
        setSubmitting(false);
      }
    
  };

  const handleSave = async (text,verbatimFlagged) => {
    setSaving(true);
    try {
      await saveAnswer(text,verbatimFlagged, false);
    } catch (error) {
      navigate("/");
    } finally {
      setSaving(false);
    }
  };

  const handleTimeUp = () => {
    if (!timerUpHandled) { // Ensure the timer up logic runs only once
      setTimerUpHandled(true);
      setSubmitting(true);
      if (editorRef.current) {
        const content = editorRef.current.getContent();
        saveAnswer(content, true).then(() => {
          sessionStorage.removeItem("timer1");
          navigate("/essay-2");
        });
      }
    }
  };

  if (ended) {
    return (
      <NavigatePage 
        title="Question 1 already submitted!"
        message="It seems that you have submitted question 1 already. If not, please contact admin."
        goToPath="/essay-2"
        buttonText="Take me to the next question"
      />
    );
  }

  if (pageError) {
    return (
      <NavigatePage 
        title="Oops"
        message={pageError}
        goToPath="/"
        buttonText="Go home"
      />
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      
      <div className="flex flex-grow overflow-hidden">
        {/* First Column - Essay Content */}
        <div className="w-1/2 p-4 border-r border-gray-300 bg-yellow-100 flex flex-col">
          <div className="flex items-center mb-4">
            <FaBook className="text-2xl text-brown-300 mr-2" />
            <h1 className="text-3xl font-bold">Essay Content</h1>
          </div>
          <div className="p-4 border border-gray-300 rounded-lg bg-white flex-grow overflow-y-auto">
            {essayContent.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Second Column - Writing Area */}
        <div className="w-1/2 p-4 flex flex-col">
          <div className="text-center mb-6">
            <div className="bg-blue-100 text-blue-800 p-4 border border-blue-300 rounded-lg mb-6" style={{ fontSize: '0.875rem' }}>
              <ol className="list-decimal list-inside">
                <li>Read the passage and summarize the below(Ideally 150-200 words):</li>
                <p>Some people believe that global warming is damaging our planet. Others believe that global warming is not a serious problem. Which point of view do you agree with? Why?</p>

                  <p>Give reasons and support your writing with examples.</p>
            </ol>
            </div>
            <div>
              {timerDuration && <Timer name="timer2" duration={timerDuration} onTimeUp={handleTimeUp} />}
            </div>
          </div>

          {/* Saving/Submit Spinner - On Top of TextEditor */}
          {(saving || submitting) && (
            <div className="flex justify-center items-center mb-4">
              <ClipLoader color="#0000ff" loading={saving || submitting} size={30} />
              <span className="ml-2 text-lg">{submitting ? "Submitting..." : "Saving..."}</span>
            </div>
          )}

          {<TextEditor ref={editorRef} initialvalue={answer} refText={essayContent} onSave={handleSave} onSubmit={handleOnSubmit}  />}
        </div>
      </div>
    </div>
  );
};

export default WriteEssayPage;
