import axios from 'axios';

export const examStatusLoader = async () => {
  const token = localStorage.getItem('token');
  try {
    console.log("Hey going to hit api",token)

    const response = await axios.get('http://localhost:3001/user/get-exam-status', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

console.log("The response is",response)
  return response.data.status


  } catch (error) {
    console.error('Error fetching exam status:', error);
    return { redirect: '/test-instructions' }; // Default redirection in case of an error
  }
};
