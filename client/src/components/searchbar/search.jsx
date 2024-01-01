import React, { useState } from 'react';

const SearchBar = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    const results = data.filter((item) =>
      item.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <ul className="list-none p-0">
        {searchResults.map((result, index) => (
          <li
            key={index}
            className="border border-gray-300 rounded-md p-2 mb-2"
          >
            {result}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
