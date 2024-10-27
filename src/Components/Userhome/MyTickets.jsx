import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../localhost';

const MyTickets = () => {
  const [searchText, setSearchText] = useState('');
  const [filterOption, setFilterOption] = useState('TicketID');
  const [ticketsData, setTicketsData] = useState([]); // Store fetched ticket data here
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        const token = sessionStorage.getItem("token");
        const headers = { 'Authorization': `Bearer ${token}` };
        const body = { user: JSON.parse(sessionStorage.getItem('user')) };

        const result = await axios.post(`${BASE_URL}/users/get-tickets`, body, { headers });

        // Update the ticket data state with the array fetched
        setTicketsData(result.data.tickets || []); // Assuming result.data.tickets is the array of tickets
        setFilteredTickets(result.data.tickets || []); // Initialize filteredTickets with fetched data
      } catch (err) {
        setError('Failed to fetch tickets.');
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    // Whenever the ticketsData changes or the search/filter options change, update the filtered tickets
    const search = () => {
      const lowerCaseSearchText = searchText.toLowerCase();
      if (searchText.trim() === '') {
        // If the search text is empty, reset filteredTickets to the original ticket data
        setFilteredTickets(ticketsData);
      } else {
        const filtered = ticketsData.filter((ticket) =>
          ticket[filterOption]?.toString().toLowerCase().includes(lowerCaseSearchText)
        );
        setFilteredTickets(filtered);
      }
    };

    search();
  }, [searchText, filterOption, ticketsData]); // Include ticketsData in dependencies

  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const currentTickets = filteredTickets.slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
  );

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Tickets</h2>
      <div className="mb-4 flex">
        <select value={filterOption} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded-lg">
          <option value="TicketID">Ticket ID</option>
          <option value="Title">Title</option>
          <option value="Description">Description</option>
          <option value="TicketStatus">Status</option>
          <option value="AssignedToAdmin">Assigned To</option>
          <option value="DateCreated">Created Date</option>
        </select>
        <input
          type="text"
          value={searchText}
          onChange={handleSearch}
          placeholder="Search..."
          className="border border-gray-300 p-2 rounded-lg ml-2"
        />
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center">No records found</div>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Ticket ID</th>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Assigned To</th>
              <th className="border border-gray-300 p-2">Created Date</th>
            </tr>
          </thead>
          <tbody>
            {currentTickets.map((ticket) => (
              <tr key={ticket.TicketID} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{ticket.TicketID}</td>
                <td className="border border-gray-300 p-2">{ticket.Title}</td>
                <td className="border border-gray-300 p-2">{ticket.Description}</td>
                <td className="border border-gray-300 p-2">{ticket.TicketStatus}</td>
                <td className="border border-gray-300 p-2">{ticket.AssignedToAdmin || 'Unassigned'}</td>
                <td className="border border-gray-300 p-2">{new Date(ticket.DateCreated).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`border p-2 mx-1 ${currentPage === index + 1 ? 'bg-yellow-300' : 'bg-white'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;
