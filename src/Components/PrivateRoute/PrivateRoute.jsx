import React from 'react';
import { Navigate } from 'react-router-dom';
import NavigatePage from '../NavigatePage/NavigatePage';
const PrivateRoute = ({ element }) => {
  const token = sessionStorage.getItem('token');

  // Here you would typically check if the token is valid or expired.
  // For this example, we'll just check if the token exists.
  const isAuthenticated = !!token;

  return isAuthenticated ? element : <NavigatePage buttonText="Back to login" message="Authentication token not found. You might be logged out. Please login again" title="Oops!!"  goToPath="/"></NavigatePage>;
};

export default PrivateRoute;
