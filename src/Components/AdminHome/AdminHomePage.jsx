import React, { useState, useEffect } from 'react';
import axios from 'axios';
import broncoLogo from '../../../public/bronco.png';
import BASE_URL from '../../../localhost';
const AdminHome = () => {
  const [ticketsData, setTicketsData] = useState([]);
  const [activeView, setActiveView] = useState('activeTickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('title');
  const [statusFilter, setStatusFilter] = useState('');
  const [assignedTeamFilter, setAssignedTeamFilter] = useState('');
  const [assignedTechnicianFilter, setAssignedTechnicianFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.post(
          `${BASE_URL}/users/get-tickets-admin`,
          {}, // POST body if needed; empty object if not
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setTicketsData(response.data.ticket || []);
      } catch (err) {
        console.error('Error fetching tickets:', err);
      }
    };

    fetchTickets();
  }, []);

  const getFilteredTickets = () => {
    let filtered = ticketsData;

    if (searchTerm) {
      filtered = filtered.filter(ticket => {
        const value = searchCriteria === 'id' ? ticket.TicketID.toString()
                    : searchCriteria === 'title' ? ticket.Title.toLowerCase()
                    : ticket.Description.toLowerCase();
        return value.includes(searchTerm.toLowerCase());
      });
    }

    if (activeView === 'activeTickets') {
      return filtered.filter(t => t.TicketStatus !== 'Closed');
    }
    if (activeView === 'openTickets') {
      return filtered.filter(t => !t.AssignedToAdmin);
    }

    // All tickets + filters
    if (activeView === 'allTickets') {
      if (statusFilter) filtered = filtered.filter(t => t.TicketStatus === statusFilter);
      if (assignedTeamFilter) filtered = filtered.filter(t => t.AssignedGroup === assignedTeamFilter);
      if (assignedTechnicianFilter) filtered = filtered.filter(t => t.AssignedToAdmin === assignedTechnicianFilter);
    }

    return filtered;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSearchCriteria('title');
    setStatusFilter('');
    setAssignedTeamFilter('');
    setAssignedTechnicianFilter('');
  };

  const filteredTickets = getFilteredTickets();

  // Pagination logic (for activeTickets only)
  const paginatedTickets =
    activeView === 'activeTickets'
      ? filteredTickets.slice((currentPage - 1) * ticketsPerPage, currentPage * ticketsPerPage)
      : filteredTickets;

  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const exportToCSV = () => {
    const csvRows = [
      ['TicketID', 'Title', 'Description', 'Status', 'Assigned Group', 'Assigned Admin', 'User Name', 'User Email'],
      ...filteredTickets.map(t => [
        t.TicketID,
        t.Title,
        t.Description,
        t.TicketStatus,
        t.AssignedGroup,
        t.AssignedToAdmin || 'Unassigned',
        t.user?.UserName,
        t.user?.UserEmail,
      ]),
    ];
    const blob = new Blob([csvRows.map(row => row.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tickets.csv';
    a.click();
  };

  return (
    <div className="h-screen flex flex-col bg-brown-300 dark:bg-yellow-700">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-yellow-300 dark:bg-brown-800 border-b-2 border-yellow-900 dark:border-brown-700">
        <div className="flex items-center">
          <img src={broncoLogo} alt="Logo" className="h-10 w-10 mr-3" />
          <h1 className="text-xl font-bold text-yellow-900 dark:text-brown-200">Admin Dashboard</h1>
        </div>
        <div className="text-yellow-900 dark:text-brown-200">Welcome, Admin!</div>
      </nav>

      {/* Tabs */}
      <div className="flex justify-center p-4">
        {['activeTickets', 'openTickets', 'allTickets'].map(view => (
          <button
            key={view}
            onClick={() => {
              setActiveView(view);
              setCurrentPage(1);
            }}
            className={`bg-yellow-300 dark:bg-brown-600 text-yellow-900 dark:text-brown-200 rounded-lg p-2 mx-2 ${
              activeView === view ? 'border-b-2 border-yellow-900 dark:border-brown-200' : ''
            }`}
          >
            {view === 'activeTickets' ? 'My Team Active Tickets'
             : view === 'openTickets' ? 'My Team Open Tickets' : 'All Tickets'}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex px-6 space-x-2 mb-4">
        <select className="p-1 rounded-lg" value={searchCriteria} onChange={e => setSearchCriteria(e.target.value)}>
          <option value="id">Ticket ID</option>
          <option value="title">Title</option>
          <option value="description">Description</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          className="p-1 rounded-lg flex-1"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Conditional filters for "All Tickets" */}
      {activeView === 'allTickets' && (
        <div className="flex px-6 space-x-2 mb-4">
          <select className="p-1 rounded-lg" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Select Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <input
            className="p-1 rounded-lg"
            placeholder="Assigned Team"
            value={assignedTeamFilter}
            onChange={e => setAssignedTeamFilter(e.target.value)}
          />
          <input
            className="p-1 rounded-lg"
            placeholder="Assigned Technician"
            value={assignedTechnicianFilter}
            onChange={e => setAssignedTechnicianFilter(e.target.value)}
          />
        </div>
      )}

      {/* Filter Actions */}
      <div className="flex justify-start px-6 mb-4 space-x-4">
        <button onClick={clearFilters} className="bg-yellow-300 p-2 rounded-lg">Clear Filters</button>
        <button onClick={exportToCSV} className="bg-yellow-300 p-2 rounded-lg">Export to CSV</button>
      </div>

      {/* Tickets Table */}
      <main className="flex-grow p-6 bg-white overflow-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Ticket ID</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Assigned Group</th>
              <th className="border p-2">Assigned Admin</th>
              <th className="border p-2">User Name</th>
              <th className="border p-2">User Email</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTickets.length > 0 ? (
              paginatedTickets.map(ticket => (
                <tr key={ticket.TicketID}>
                  <td className="border p-2">{ticket.TicketID}</td>
                  <td className="border p-2">{ticket.Title}</td>
                  <td className="border p-2">{ticket.Description}</td>
                  <td className="border p-2">{ticket.TicketStatus}</td>
                  <td className="border p-2">{ticket.AssignedGroup || '—'}</td>
                  <td className="border p-2">{ticket.AssignedToAdmin || 'Unassigned'}</td>
                  <td className="border p-2">{ticket.user?.UserName}</td>
                  <td className="border p-2">{ticket.user?.UserEmail}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4">No tickets found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>

      {/* Pagination */}
      {activeView === 'activeTickets' && totalPages > 1 && (
        <div className="flex justify-center py-4">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1 ? 'bg-yellow-500' : 'bg-yellow-300'}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminHome;
