// src/components/Spinner.js
import React from 'react';
import { ClipLoader } from 'react-spinners';

const Spinner = ({ loading }) => {
  return (
    <div>
      {loading && <ClipLoader color="#fff" size={24} />}
    </div>
  );
};

export default Spinner;
