import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners'; // Import the spinner from react-spinners
import BASE_URL from '../../../localhost';
import axios from 'axios';

const theme = {
  input: 'border border-brown-300 dark:border-yellow-700 p-2 w-full rounded-lg mb-4',
  button: 'bg-yellow-300 dark:bg-brown-600 text-yellow-900 dark:text-brown-200 p-2 rounded-lg w-full cursor-pointer flex items-center justify-center',
};

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contact: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage,setErrorMessage]=useState(false)
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
const submitTicket =async()=>{
  try

  {
    console.log("formdata",formData)
    const token=sessionStorage.getItem("token")
    let headers= {'Authorization': `Bearer ${token}`}
    let body={
      title:formData.title,
      description:formData.description,
      contact:formData.contact,
      user:JSON.parse(sessionStorage.getItem('user'))
  

    }


    const result = await axios.post(`${BASE_URL}/users/create-ticket`,body,{headers})
return result

  }
  catch (error)
  {
console.log("The error is",error)
  }
}
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true); // Set loading to true
  setErrorMessage(""); // Clear any previous error messages

  try {
      const result = await submitTicket();
      console.log("Result:", result); // Log the result to understand its structure

      if (result && result.data) {
          if (result.data.errorMessage) {
              setLoading(false);
              setErrorMessage(result.data.errorMessage);
          } else if (result.data.message) {
              setLoading(false);
              setSubmitted(true);
          }
      } else {
          // Handle unexpected structure
          setLoading(false);
          setErrorMessage("Unexpected response from the server.");
      }
  } catch (error) {
      // Handle any errors from the request
      console.error("Error during form submission:", error);
      setLoading(false);
      setErrorMessage("An error occurred during submission. Please try again.");
  }
};


  return (
    <div className="p-4 bg-white dark:bg-brown-800 rounded-lg shadow">
     { !submitted && <h2 className="text-lg font-bold text-brown-800 dark:text-brown-200 mb-4">Create New Ticket</h2>}
     { errorMessage && (
    <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-4">
        {errorMessage}
    </p>
)}      {(submitted && (!errorMessage)) ? (
        <p className="text-green-500">Your ticket has been submitted successfully!<br/><br/>You will receive an email shortly with the ticket number for reference</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Ticket Title"
            className={theme.input}
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            className={theme.input}
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Information (Email or Phone)"
            className={theme.input}
            value={formData.contact}
            onChange={handleChange}
            required
          />
          <button type="submit" className={theme.button} disabled={loading}>
            {loading ? (
              <ClipLoader size={20} color="#b57214" loading={loading} />
            ) : (
              'Submit Ticket'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateTicket;
