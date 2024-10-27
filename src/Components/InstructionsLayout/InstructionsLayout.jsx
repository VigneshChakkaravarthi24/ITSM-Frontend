import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'; // Adjust the path as needed

const InstructionsLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default InstructionsLayout;
