import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../../localhost';

const sharedClasses = {
  textGold: 'text-yellow-700',
  textBrown: 'text-brown-900',
  input: 'border border-yellow-500 p-2 w-full rounded-lg bg-brown-50 placeholder-yellow-700',
  button: 'bg-yellow-600 text-brown-900 font-semibold p-2 rounded-lg w-full cursor-pointer hover:bg-yellow-500',
  buttonDisabled: 'bg-yellow-300 text-yellow-900 cursor-not-allowed',
  checkboxLabel: 'text-yellow-700',
};

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const isFormValid = email && password && agree;

  const validateUser = async (email, password) => {
    setLoading(true);
    setLoginError('');
    try {
      const body = { email, password };
      const result = await axios.post(`${BASE_URL}/users/login`, body);
      if (result && result.data && result.data.token) {
        sessionStorage.setItem("token", result.data.token);
        sessionStorage.setItem("user",JSON.stringify( result.data.user));
        navigate('/userHome');
      }
    } catch (error) {
      setLoginError(error.response ? error.response.data.errorMessage : "An error occurred while reaching the server. Please contact the admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    validateUser(email, password);
  };

  return (
    <div className="h-screen flex flex-col bg-brown-300">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full md:w-1/3 p-8 bg-yellow-200 rounded-lg shadow-lg border border-yellow-500">
          <h2 className={`text-2xl font-bold ${sharedClasses.textBrown} mb-6 text-center`}>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className={`block ${sharedClasses.textGold}`} htmlFor="email">Email address</label>
              <input
                className={sharedClasses.input}
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className={`block ${sharedClasses.textGold}`} htmlFor="quiz-code">Password </label>
              <input
                className={sharedClasses.input}
                type="password"
                id="quiz-code"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="agree"
                className="mr-2"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
              />
              <label htmlFor="agree" className={sharedClasses.checkboxLabel}>I agree to the terms and conditions</label>
            </div>

            {loginError && (
              <p className="text-red-500 mb-6 text-center">{loginError}</p>
            )}

            <button
              className={`${sharedClasses.button} ${!isFormValid ? sharedClasses.buttonDisabled : ''}`}
              type="submit"
              disabled={!isFormValid || loading}
            >
              <Spinner loading={loading} />
              {!loading && 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
