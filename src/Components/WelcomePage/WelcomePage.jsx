import React from 'react';
import Layout from '../Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../localhost';
import NavigatePage from '../NavigatePage/NavigatePage';
const sharedClasses = {
  border: 'border border-brown-300 dark:border-yellow-700',
  textLight: 'text-yellow-900 dark:text-brown-200',
  textDark: 'text-brown-300 dark:text-yellow-700',
  bgLight: 'bg-brown-300 dark:bg-yellow-700',
  bgDark: 'bg-yellow-700 dark:bg-brown-300',
  p: 'p-2',
  button: 'bg-yellow-300 dark:bg-brown-600 text-yellow-900 dark:text-brown-200 p-2 rounded-lg w-full',
  list: 'list-disc pl-5 text-left',
};

const WelcomePage = () => {
const navigate=useNavigate()
  const loaderData=useLoaderData()

  if(loaderData && loaderData.data && loaderData.data.errorMessage)
  {
    return <NavigatePage   navbar ={false} buttonText="Back to login" message={loaderData.data.errorMessage} title="Oops!!"  goToPath="/"></NavigatePage>

  }
  if((!loaderData)||(!loaderData.data.message))
  {
    
    return <NavigatePage navbar ={false}  buttonText="Back to login" message="You might be logged out. Please login again" title="Oops!!"  goToPath="/" ></NavigatePage>
  }
  
  return (
    <Layout>
      <div className="w-full max-w-lg bg-gray-100 border border-gray-300 p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${sharedClasses.textLight}`}>Welcome to Our Application</h1>
          <ul className={`mt-6 ${sharedClasses.list}`}>
            <li>Explore the features of the application.</li>
            <li>Get familiar with the user interface.</li>
            <li>Ensure you have a stable internet connection.</li>
            <li style={{ color: 'red' }}>You cannot switch applications. If so will lead to forfeiting your exam.</li>
            <li>Enjoy your experience!</li>
          </ul>
          <button
            className={sharedClasses.button}
            onClick={()=>{navigate("/test-instructions")}}
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
};



export default WelcomePage;

export async function loader(){

  try
  {
    const token=sessionStorage.getItem("token")
    let headers= {'Authorization': `Bearer ${token}`}
    const result = await axios.get(`${BASE_URL}/user/authenticate-loader`,{headers})
  
    if(result.data.errorMessage || result.data.message)
        {
            return result
        }
    else
        {
            throw new Response(JSON.stringify({message:"Unable to reach server", buttonText:"Go Home",title:"Server error",goToPath:"/"},{status:500}))
        }

  }
  catch(error)
  {
    throw new Response(JSON.stringify({message:"Unable to reach server", buttonText:"Go Home",title:"Server error",goToPath:"/"},{status:500}))
  }
  



}
