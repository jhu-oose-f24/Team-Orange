import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface SearchBarProps {
  onSearch: (params: { title: string; startDate?: string; endDate?: string }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    setError(null);

    if (!searchTitle) {
      setError('Title is required for searching.');
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      setError('Start date cannot be after end date.');
      return;
    }

    const searchParams: { title: string; startDate?: string; endDate?: string } = {
      title: searchTitle,
    };

    if (startDate) {
      const startDateWithTime = new Date(startDate);
      startDateWithTime.setHours(0, 0, 0, 0);
      searchParams.startDate = startDateWithTime.toISOString();
    }

    if (endDate) {
      const endDateWithTime = new Date(endDate);
      endDateWithTime.setHours(23, 59, 59, 999);
      searchParams.endDate = endDateWithTime.toISOString();
    }

    onSearch(searchParams);
  };

  const handleClearSearch = () => {
    setSearchTitle('');
    setStartDate(null);
    setEndDate(null);
    onSearch({ title: '', startDate: undefined, endDate: undefined });
  };


  return (
    <div className="search-bar">
      {error && <div className="error">{error}</div>}
      <h3>Search for Ticket</h3>
      <input
        type="text"
        placeholder="Search by Title"
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
      />
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        placeholderText="Start Date"
        dateFormat="yyyy-MM-dd"
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        placeholderText="End Date"
        dateFormat="yyyy-MM-dd"
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleClearSearch}>Clear Search</button>
    </div>
  );
};

export default SearchBar;


