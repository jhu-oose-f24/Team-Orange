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

  const handleSearch = () => {
    const searchParams: { title: string; startDate?: string; endDate?: string } = {
      title: searchTitle,
    };

    if (startDate) {
      searchParams.startDate = startDate.toISOString().split('T')[0];
    }
    if (endDate) {
      searchParams.endDate = endDate.toISOString().split('T')[0];
    }

    onSearch(searchParams);
  };

  return (
    <div className="search-bar">
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
    </div>
  );
};

export default SearchBar;


