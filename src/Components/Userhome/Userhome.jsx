import React, { useState } from 'react';
import broncoLogo from '../../../public/bronco.png';
import MyTickets from './MyTickets';
import CreateTicket from './CreateTicket';
import axios from 'axios';
import BASE_URL from '../../../localhost';
import { useLoaderData } from 'react-router-dom';
const theme = {
  text: 'text-yellow-900 dark:text-brown-200',
  background: 'bg-brown-300 dark:bg-yellow-700',
  button: 'bg-yellow-300 dark:bg-brown-600 text-yellow-900 dark:text-brown-200 rounded-lg p-2 cursor-pointer',
  borderBottom: 'border-b-2 border-yellow-900 dark:border-brown-200',
};

const UserHomePage = () => {
  const loaderData=useLoaderData()
  if(loaderData.data.errorMessage)
  {
    e
  }
  const [activeTab, setActiveTab] = useState('myTickets');

  const handleTabClick = (tab) => setActiveTab(tab);
const user = JSON.parse(sessionStorage.getItem("user"))
  return (
    <div className={`h-screen flex flex-col ${theme.background}`}>
      {/* Navbar with logo */}
      <nav className="flex items-center justify-between p-4 bg-yellow-300 dark:bg-brown-800 border-b-2 border-yellow-900 dark:border-brown-700">
        <div className="flex items-center">
          <img src={broncoLogo} alt="Logo" className="h-10 w-10 mr-3" />
          <h1 className={`text-xl font-bold ${theme.text}`}>User Dashboard</h1>
        </div>
        <div className={theme.text}>Welcome,{user.UserName} !</div>
      </nav>

      {/* Tabs for My Tickets and Create New Ticket */}
      <div className="flex justify-center p-4">
        <button
          onClick={() => handleTabClick('myTickets')}
          className={`${theme.button} mr-4 ${activeTab === 'myTickets' ? theme.borderBottom : ''}`}
        >
          My Tickets
        </button>
        <button
          onClick={() => handleTabClick('createTicket')}
          className={`${theme.button} ${activeTab === 'createTicket' ? theme.borderBottom : ''}`}
        >
          Create New Ticket
        </button>
      </div>

      {/* Main content area with white background */}
      <main className="flex-grow p-6 bg-white">
        {activeTab === 'myTickets' ? <MyTickets /> : <CreateTicket />}
      </main>
    </div>
  );
};

export default UserHomePage;


export async function loader()
{
  try
  {

    const token=sessionStorage.getItem("token")
    let headers= {'Authorization': `Bearer ${token}`}

    const result = await axios.get(`${BASE_URL}/users/authenticate-loader`,{headers})
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
    console.log("The error is",error)
    throw new Response(JSON.stringify({message:"Unable to reach server", buttonText:"Go Home",title:"Server error",goToPath:"/"},{status:500}))
  }
  

}