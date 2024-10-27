import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import broncoLogo from '../../../public/bronco.png'; // Import the logo
import { Outlet } from 'react-router-dom';
// Sample tickets data
const ticketsData = [
  { id: 1, title: "Issue with Login", description: "Users are unable to log in to their accounts.", status: "Open", assignedTeam: "Support", assignedTechnician: null },
  { id: 2, title: "Payment Failure", description: "Payment processing is failing for some users.", status: "In Progress", assignedTeam: "Billing", assignedTechnician: "John Doe" },
  { id: 3, title: "Feature Request", description: "Request to add new feature X.", status: "Closed", assignedTeam: "Development", assignedTechnician: "Jane Smith" },
  // ... Add more ticket objects as needed
];

const theme = {
  text: 'text-yellow-900 dark:text-brown-200',
  background: 'bg-brown-300 dark:bg-yellow-700',
  button: 'bg-yellow-300 dark:bg-brown-600 text-yellow-900 dark:text-brown-200 rounded-lg p-2 cursor-pointer',
  borderBottom: 'border-b-2 border-yellow-900 dark:border-brown-200',
};

const AdminHome = () => {
  const [activeView, setActiveView] = useState('activeTickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('title'); // Default search by title
  const [statusFilter, setStatusFilter] = useState(''); // Status filter
  const [assignedTeamFilter, setAssignedTeamFilter] = useState(''); // Assigned Team filter
  const [assignedTechnicianFilter, setAssignedTechnicianFilter] = useState(''); // Assigned Technician filter

  // Function to filter tickets based on the selected view
  const getFilteredTickets = () => {
    let filteredTickets = ticketsData;

    // Search filtering
    if (searchTerm) {
      filteredTickets = filteredTickets.filter(ticket => {
        if (searchCriteria === 'id') {
          return ticket.id.toString().includes(searchTerm);
        }
        if (searchCriteria === 'title') {
          return ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (searchCriteria === 'description') {
          return ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
      });
    }

    // View filtering
    if (activeView === 'activeTickets') {
      return filteredTickets.filter(ticket => ticket.status !== 'Closed'); // Active tickets
    }
    if (activeView === 'openTickets') {
      return filteredTickets.filter(ticket => !ticket.assignedTechnician); // Open tickets
    }

    // Apply additional filters for "All Tickets" view
    if (activeView === 'allTickets') {
      if (statusFilter) {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === statusFilter);
      }
      if (assignedTeamFilter) {
        filteredTickets = filteredTickets.filter(ticket => ticket.assignedTeam === assignedTeamFilter);
      }
      if (assignedTechnicianFilter) {
        filteredTickets = filteredTickets.filter(ticket => ticket.assignedTechnician === assignedTechnicianFilter);
      }
    }

    return filteredTickets; // All tickets
  };

  const filteredTickets = getFilteredTickets();

  // Function to export tickets to CSV
  const exportToCSV = () => {
    const csvRows = [
      ['Ticket ID', 'Title', 'Description', 'Status', 'Assigned Team', 'Assigned Technician'],
      ...filteredTickets.map(ticket => [
        ticket.id,
        ticket.title,
        ticket.description,
        ticket.status,
        ticket.assignedTeam,
        ticket.assignedTechnician || 'Unassigned'
      ])
    ];
    const csvString = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'tickets.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSearchCriteria('title'); // Reset to default
    setStatusFilter('');
    setAssignedTeamFilter('');
    setAssignedTechnicianFilter('');
  };

  return (
    <div className={`h-screen flex flex-col ${theme.background}`}>
      {/* Navbar with logo */}
      <nav className="flex items-center justify-between p-4 bg-yellow-300 dark:bg-brown-800 border-b-2 border-yellow-900 dark:border-brown-700">
        <div className="flex items-center">
          <img src={broncoLogo} alt="Logo" className="h-10 w-10 mr-3" />
          <h1 className={`text-xl font-bold ${theme.text}`}>Admin Dashboard</h1>
        </div>
        <div className={theme.text}>Welcome, Admin!</div>
      </nav>

      {/* Tabs for Ticket Views */}
      <div className="flex justify-center p-4">
        <button
          onClick={() => setActiveView('activeTickets')}
          className={`${theme.button} mr-4 ${activeView === 'activeTickets' ? theme.borderBottom : ''}`}
        >
          My Team Active Tickets
        </button>
        <button
          onClick={() => setActiveView('openTickets')}
          className={`${theme.button} mr-4 ${activeView === 'openTickets' ? theme.borderBottom : ''}`}
        >
          My Team Open Tickets
        </button>
        <button
          onClick={() => setActiveView('allTickets')}
          className={`${theme.button} ${activeView === 'allTickets' ? theme.borderBottom : ''}`}
        >
          All Tickets
        </button>
      </div>

      {/* Search Area */}
      <div className="mb-4 flex justify-start px-6">
        <select
          className={`border border-yellow-900 dark:border-brown-200 p-1 rounded-lg mr-2 ${theme.text} text-sm`}
          value={searchCriteria}
          onChange={(e) => setSearchCriteria(e.target.value)}
        >
          <option value="id">Ticket ID</option>
          <option value="title">Title</option>
          <option value="description">Description</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          className={`border border-yellow-900 dark:border-brown-200 p-1 rounded-lg w-full text-sm ${theme.text}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Dropdown filters for All Tickets */}
      {activeView === 'allTickets' && (
        <div className="mb-4 flex justify-start px-6">
          <select
            className={`border border-yellow-900 dark:border-brown-200 p-1 rounded-lg mr-2 ${theme.text} text-sm`}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            className={`border border-yellow-900 dark:border-brown-200 p-1 rounded-lg mr-2 ${theme.text} text-sm`}
            value={assignedTeamFilter}
            onChange={(e) => setAssignedTeamFilter(e.target.value)}
          >
            <option value="">Select Assigned Team</option>
            <option value="Support">Support</option>
            <option value="Billing">Billing</option>
            <option value="Development">Development</option>
            {/* Add more teams as needed */}
          </select>

          <select
            className={`border border-yellow-900 dark:border-brown-200 p-1 rounded-lg ${theme.text} text-sm`}
            value={assignedTechnicianFilter}
            onChange={(e) => setAssignedTechnicianFilter(e.target.value)}
          >
            <option value="">Select Assigned Technician</option>
            <option value="John Doe">John Doe</option>
            <option value="Jane Smith">Jane Smith</option>
            {/* Add more technicians as needed */}
          </select>
        </div>
      )}

      {/* Filter Action Buttons */}
      <div className="flex justify-start px-6 mb-4">
        <button onClick={clearFilters} className={`${theme.button} mr-4`}>
          Clear All Filters
        </button>
        <button onClick={exportToCSV} className={`${theme.button}`}>
          Export to CSV
        </button>
      </div>

      {/* Tickets Table */}
      <main className="flex-grow p-6 bg-white">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border-b border-r p-2 text-left">Ticket ID</th>
              <th className="border-b border-r p-2 text-left">Title</th>
              <th className="border-b border-r p-2 text-left">Description</th>
              <th className="border-b border-r p-2 text-left">Status</th>
              <th className="border-b border-r p-2 text-left">Assigned Team</th>
              <th className="border-b p-2 text-left">Assigned Technician</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="border-b border-r p-2">
                    <a href={`/tickets/${ticket.id}`} className="text-blue-500 hover:underline">
                      {ticket.id}
                    </a>
                  </td>
                  <td className="border-b border-r p-2">{ticket.title}</td>
                  <td className="border-b border-r p-2">{ticket.description}</td>
                  <td className="border-b border-r p-2">{ticket.status}</td>
                  <td className="border-b border-r p-2">{ticket.assignedTeam}</td>
                  <td className="border-b p-2">{ticket.assignedTechnician || 'Unassigned'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">No tickets found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default AdminHome;
