import React from 'react';
import logo from '../../../public/bronco.png'; // Make sure to replace with the path to your logo

const Navbar = () => {
  return (
    <nav className="bg-brown text-gold p-4">
      <div className="container mx-auto flex items-center justify-between">
        <img src={logo} alt="WMU Logo" className="h-12" />
        <span className="text-xl font-bold">Sathyabama  University</span>
      </div>
    </nav>
  );
};

export default Navbar;
