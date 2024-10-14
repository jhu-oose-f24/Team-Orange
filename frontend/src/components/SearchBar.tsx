import React, { useState } from 'react';
import { Input, Button, Alert } from 'antd';

interface SearchBarProps {
  onSearch: (params: { title?: string; startDate?: string; endDate?: string }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    setError(null);
    const trimmedTitle = searchTitle.trim();

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.');
      return;
    }

    const searchParams: { title?: string; startDate?: string; endDate?: string } = {
      title: trimmedTitle,
    };

    if (startDate) {
      searchParams.startDate = new Date(startDate).toISOString();
    }

    if (endDate) {
      searchParams.endDate = new Date(endDate).toISOString();
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
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d9d9d9', padding: '8px', borderRadius: '4px', width: '100%', maxWidth: '600px' }}>
      {error && <Alert message={error} type="error" showIcon closable style={{ marginRight: '10px', flexGrow: 1 }} />}
      <Input
        style={{ flexGrow: 1, marginRight: '8px' }}
        placeholder="Search by Title"
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
      />
      <Input
        type="datetime-local"
        style={{ width: '120px', marginRight: '8px' }}
        value={startDate ? new Date(startDate).toISOString().slice(0, 16) : ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
        placeholder="Start Date"
      />
      <Input
        type="datetime-local"
        style={{ width: '120px', marginRight: '8px' }}
        value={endDate ? new Date(endDate).toISOString().slice(0, 16) : ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
        placeholder="End Date"
      />
      <Button type="primary" onClick={handleSearch} style={{ marginRight: '4px' }}>
        Search
      </Button>
      <Button onClick={handleClearSearch}>
        Clear
      </Button>
    </div>
  );
};

export default SearchBar;
