import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams for dynamic route parameters
import broncoLogo from '../../../public/bronco.png'; // Import the logo

const teams = ['Support', 'Billing', 'Development']; // Example teams
const teamMembers = {
  Support: ['Alice Johnson', 'Bob Smith'],
  Billing: ['Charlie Brown', 'Diana Prince'],
  Development: ['Eve Adams', 'Frank Castle'],
}; // Example team members
const statuses = ['Open', 'In Progress', 'Closed']; // Example statuses

// Sample ticket data for demonstration purposes
const sampleTicketData = {
  id: 1,
  creator: 'Admin',
  createdDate: '2024-10-01',
  contact: 'user@example.com',
  title: 'Issue with Login',
  ticketNumber: 'TCK-001',
  assignedTeam: 'Support',
  assignedTechnician: 'Alice Johnson',
  comments: [
    { date: '2024-10-02', by: 'Admin', comment: 'Initial report of the issue.' },
    { date: '2024-10-03', by: 'Alice Johnson', comment: 'Investigating the issue.' },
  ],
  status: 'Open',
};

const TicketPage = () => {
  const { id } = useParams(); // Get the ticket ID from the URL
  const [ticketData, setTicketData] = useState(sampleTicketData); // State to hold ticket data
  const [newComment, setNewComment] = useState(''); // State to hold new comment
  const [loadingSave, setLoadingSave] = useState(false); // Loader for save button
  const [loadingComment, setLoadingComment] = useState(false); // Loader for comment submission

  const handleTeamChange = (e) => {
    const selectedTeam = e.target.value;
    setTicketData((prevData) => ({
      ...prevData,
      assignedTeam: selectedTeam,
      assignedTechnician: teamMembers[selectedTeam][0], // Set to the first technician of the selected team
    }));
  };

  const handleTechnicianChange = (e) => {
    const selectedTechnician = e.target.value;
    setTicketData((prevData) => ({
      ...prevData,
      assignedTechnician: selectedTechnician,
    }));
  };

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setTicketData((prevData) => ({
      ...prevData,
      status: selectedStatus,
    }));
  };

  const handleSave = async () => {
    setLoadingSave(true);
    // Simulate API call to save ticket data
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating a delay
    console.log('Ticket data saved:', ticketData);
    setLoadingSave(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Prevent empty comments
    setLoadingComment(true);
    // Simulate API call to save comment
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating a delay
    const newCommentData = {
      date: new Date().toLocaleDateString(),
      by: 'Admin', // You can modify this to reflect the actual user
      comment: newComment,
    };
    setTicketData((prevData) => ({
      ...prevData,
      comments: [...prevData.comments, newCommentData],
    }));
    setNewComment(''); // Clear the input
    setLoadingComment(false);
  };

  return (
    <div className="h-screen flex flex-col bg-brown-300 dark:bg-yellow-700">
      {/* Navbar with logo */}
      <nav className="flex items-center justify-between p-4 bg-yellow-300 dark:bg-brown-800 border-b-2 border-yellow-900 dark:border-brown-700">
        <div className="flex items-center">
          <img src={broncoLogo} alt="Logo" className="h-10 w-10 mr-3" />
          <h1 className="text-xl font-bold text-yellow-900 dark:text-brown-200">Ticket Details</h1>
        </div>
      </nav>

      {/* Ticket Information and Comments Section */}
      <div className="flex flex-row p-6 bg-white shadow-md rounded-lg">
        {/* Ticket Information */}
        <div className="flex-1 pr-4">
          <h2 className="text-lg font-bold mb-4">Ticket Information</h2>
          <div className="mb-4">
            <span className="font-semibold">Ticket Created By:</span> {ticketData.creator}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Created Date:</span> {ticketData.createdDate}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Contact:</span> {ticketData.contact}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Title:</span> {ticketData.title}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Ticket Number:</span> {ticketData.ticketNumber}
          </div>

          {/* Assigned Team Dropdown */}
          <div className="mb-4">
            <label className="font-semibold">Assigned Team:</label>
            <select
              value={ticketData.assignedTeam}
              onChange={handleTeamChange}
              className="border border-yellow-900 dark:border-brown-200 p-2 rounded-lg w-full"
            >
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Technician Dropdown */}
          <div className="mb-4">
            <label className="font-semibold">Assigned Technician:</label>
            <select
              value={ticketData.assignedTechnician}
              onChange={handleTechnicianChange}
              className="border border-yellow-900 dark:border-brown-200 p-2 rounded-lg w-full"
            >
              {teamMembers[ticketData.assignedTeam].map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="mb-4">
            <label className="font-semibold">Status:</label>
            <select
              value={ticketData.status}
              onChange={handleStatusChange}
              className="border border-yellow-900 dark:border-brown-200 p-2 rounded-lg w-full"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <button onClick={handleSave} className="bg-yellow-300 dark:bg-brown-600 text-yellow-900 dark:text-brown-200 rounded-lg p-2 mt-4" disabled={loadingSave}>
            {loadingSave ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Comments Section */}
        <div className="flex-1 pl-4">
          <h3 className="font-semibold mb-2">Comments:</h3>
          <ul className="list-disc pl-5 mb-4">
            {ticketData.comments.map((comment, index) => (
              <li key={index} className="mb-2">
                <span className="font-semibold">{comment.date} - {comment.by}:</span> {comment.comment}
              </li>
            ))}
          </ul>

          {/* Add Comment Section */}
          <div className="flex flex-col mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="border border-yellow-900 dark:border-brown-200 p-2 rounded-lg w-full"
              rows="3"
              placeholder="Add a comment..."
            />
            <button onClick={handleAddComment} className="bg-yellow-300 dark:bg-brown-600 text-yellow-900 dark:text-brown-200 rounded-lg p-2 mt-2" disabled={loadingComment}>
              {loadingComment ? 'Adding...' : 'Add Comment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
