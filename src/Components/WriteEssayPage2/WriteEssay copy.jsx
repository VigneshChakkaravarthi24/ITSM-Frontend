import React, { useState, useEffect, useRef } from 'react';
import { FaBook } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import BASE_URL from '../../../localhost';
import TextEditor from "./EssayEditor";
import Timer from "./Timer";
import NavigatePage from '../NavigatePage/NavigatePage';

const WriteEssayPage2 = () => {
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

  useEffect(() => {
    const getQuestion = async () => {
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      
      try {
        const result = await axios.get(`http://${BASE_URL}:3001/user/getQuestion2`, { headers });
        if (result.data.question && result.data.prompt) {
          setEssayContent(result.data.question);
          setPrompt(result.data.prompt);
          setTimerDuration(parseInt(result.data.remainingTime, 10) || 0); // Ensure valid number
          sessionStorage.setItem("timer1", result.data.remainingTime);
          setAnswer(result.data.answer);
          setEnded(result.data.ended);
        }
      } catch (error) {
        navigate("/");
      }
    };

    getQuestion();
  }, [navigate]);

  const saveAnswer = async (text, ended) => {
    setSaving(true);
    const token = sessionStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const remainingTime = parseInt(sessionStorage.getItem("timer2"), 10) || 0;
    
    try {
      const result = await axios.post(`http://${BASE_URL}:3001/user/save-answers`, {
        answer: text,
        remainingTime: remainingTime,
        ended: ended,
        questionNumber: 2
      }, { headers });
      return result;
    } catch (error) {
      console.error("Error saving answer:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleOnSubmit = async (text) => {
    const result = window.confirm("Are you sure you want to submit the answer?");
    if (result) {
      setSubmitting(true);
      try {
        await saveAnswer(text, true).then(() => navigate("/summary"));
        sessionStorage.removeItem("timer2");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleSave = async (text) => {
    setSaving(true);
    try {
      await saveAnswer(text, false);
      console.log("Answer saved successfully");
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
          sessionStorage.removeItem("timer2");
          navigate("/summary");
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
                <li>Read the passage and write a five-paragraph essay:</li>
                <ol className="list-decimal list-inside ml-4">
                  <li>Summarize the article (two or three paragraphs).</li>
                  <li>Share your perspective about the relationship between outlook and longevity.</li>
                </ol>
                <li>Use details from the information you are given when you write your explanation.</li>
                <li>Do NOT copy more than THREE words.</li>
              </ol>
            </div>
            <div>
             {timerDuration && <Timer name="timer2" duration={timerDuration} onTimeUp={handleTimeUp} />}
            </div>
          </div>
         {timerDuration && <TextEditor ref={editorRef} refText={essayContent} onSave={handleSave} onSubmit={handleOnSubmit} />}
          {saving &&<p>Saving..</p>}
          <div className="text-right mt-4">
            <button
              onClick={() => handleOnSubmit(answer)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteEssayPage2;
