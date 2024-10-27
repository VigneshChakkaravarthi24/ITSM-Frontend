import React from 'react';

const Spinner = () => {
  return (
    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500 border-blue-500" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
