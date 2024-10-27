import React, { useState, useEffect, useRef } from 'react';
import { FaBook } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Navbar from '../Navbar/Navbar';
import BASE_URL from '../../../localhost';
import NavigatePage from '../NavigatePage/NavigatePage';

const WriteEssayPage2 = () => {
  const navigate = useNavigate();

  const [timerDuration, setTimerDuration] = useState(null);
  const [essayContent, setEssayContent] = useState('loading...');
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ended, setEnded] = useState(false);
  const [history, setHistory] = useState([answer]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const editorRef = useRef(null);

  useEffect(() => {
    const getQuestion = async () => {
      const token = sessionStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const result = await axios.get(`http://${BASE_URL}:3001/user/getQuestion1`, { headers });
        if (result.data.question && result.data.prompt) {
          setEssayContent(result.data.question);
          setPrompt(result.data.prompt);
          setTimerDuration(parseInt(result.data.remainingTime));
          sessionStorage.setItem('timer1', result.data.remainingTime);
          setAnswer(result.data.answer);
          setEnded(result.data.ended);
        }
      } catch (error) {
        // Handle the error, e.g., navigate to an error page
      }
    };

    getQuestion();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        handleUndo();
      } else if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [history, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setAnswer(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setAnswer(history[historyIndex + 1]);
    }
  };

  const handleChange = (event) => {
    const newText = event.target.innerText;
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newText]);
    setHistoryIndex(newHistory.length);
    setAnswer(newText);
  };

  const countWords = (text) => {
    const trimmedText = text.trim();
    if (trimmedText === '') {
      return 0;
    }
    return trimmedText.split(/\s+/).length;
  };

  const wordCount = countWords(answer);

  const saveAnswer = async (text, ended) => {
    setSaving(true);
    const token = sessionStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const storageTimer = sessionStorage.getItem('timer1');
    let remainingTime = parseInt(storageTimer, 10);

    if (isNaN(remainingTime)) {
      remainingTime = 0;
    }

    try {
      const result = await axios.post(
        `http://${BASE_URL}:3001/user/save-answers`,
        {
          answer: text,
          remainingTime,
          ended,
          questionNumber: 1,
        },
        { headers }
      );
      return result;
    } catch (error) {
      console.error('Error saving answer:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleOnSubmit = async (text) => {
    const result = window.confirm('Are you sure you want to submit the answer?');
    if (result) {
      setSubmitting(true);
      try {
        await saveAnswer(text, true).then(() => navigate('/essay-2'));
        sessionStorage.removeItem('timer1');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleSave = async (text) => {
    setSaving(true);
    try {
      await saveAnswer(text, false);
      console.log('Answer saved successfully');
    } catch (error) {
      navigate('/');
    } finally {
      setSaving(false);
    }
  };

  const handleTimeUp = () => {
    setSubmitting(true);
    saveAnswer(answer, true).then(() => {
      sessionStorage.removeItem('timer1');
      navigate('/essay-2');
    });
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

        <div className="w-1/2 p-4 flex flex-col">
          <div className="text-center mb-6">
            <div className="bg-blue-100 text-blue-800 p-4 border border-blue-300 rounded-lg mb-6" style={{ fontSize: '0.875rem' }}>
              <ol className="list-decimal list-inside">{prompt}</ol>
            </div>
          </div>
          <div className="text-center mb-6">
            <div className="flex items-center mb-4">
              <button onClick={handleUndo} disabled={historyIndex === 0} className="bg-yellow-300 text-brown-600 p-2 rounded-lg mr-2">
                Undo
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
                className="bg-yellow-300 text-brown-600 p-2 rounded-lg mr-2"
              >
                Redo
              </button>
              <button
                onClick={() => handleSave(answer)}
                className={`bg-green-300 text-brown-600 p-2 rounded-lg mr-2 flex items-center ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={saving}
              >
                {saving && <ClipLoader size={20} color={'#123abc'} className="mr-2" />}
                Save
              </button>
              <button
                onClick={() => handleOnSubmit(answer)}
                className={`bg-yellow-300 text-brown-600 p-2 rounded-lg ml-auto flex items-center ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={submitting}
              >
                {submitting && <ClipLoader size={20} color={'#123abc'} className="mr-2" />}
                Submit
              </button>
              <div className="text-sm text-gray-600 ml-4">Word Count: {wordCount}</div>
            </div>
            <div
              ref={editorRef}
              contentEditable
              onInput={handleChange}
              className="h-96 w-full border border-brown-600 rounded-lg p-4 bg-white shadow-md overflow-y-auto"
              style={{
                minHeight: '200px',
                maxHeight: '400px',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.5',
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteEssayPage2;
