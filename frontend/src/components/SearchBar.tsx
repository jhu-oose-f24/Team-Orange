import React, { useState } from 'react';
import { Input, Button, Alert, Select } from 'antd';

interface SearchBarProps {
  onSearch: (params: {
    title?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
    minPayment?: string;
  }) => void;
}

// Generate a search bar
const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTitle, setSearchTitle] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [minPayment, setMinPayment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    setError(null);
    const trimmedTitle = searchTitle.trim();

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date.");
      return;
    }

    const searchParams: {
      title?: string;
      startDate?: string;
      endDate?: string;
      category?: string;
      minPayment?: string;
    } = { title: trimmedTitle };


    // handle each search paramater
    if (startDate) {
      searchParams.startDate = new Date(startDate).toISOString();
    }

    if (endDate) {
      searchParams.endDate = new Date(endDate).toISOString();
    }

    if (category) {
      searchParams.category = category;
    }

    if (minPayment) {
      searchParams.minPayment = minPayment;
    }

    onSearch(searchParams);
  };

  // clear all info in the search bar back to empty
  const handleClearSearch = () => {
    setSearchTitle("");
    setStartDate(null);
    setEndDate(null);
    setCategory(null);
    setMinPayment('');
    setError(null);
    onSearch({});
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
      {error && <Alert message={error} type="error" showIcon closable style={{ marginRight: '8px' }} />}
      <Input
        style={{ flex: '1', marginRight: '8px' }}
        placeholder="Search by Title"
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
      />
      <Input
        type="datetime-local"
        style={{ width: '150px', marginRight: '8px' }}
        value={startDate ? new Date(startDate).toISOString().slice(0, 16) : ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
        placeholder="Start Date"
      />
      <Input
        type="datetime-local"
        style={{ width: '150px', marginRight: '8px' }}
        value={endDate ? new Date(endDate).toISOString().slice(0, 16) : ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
        placeholder="End Date"
      />
      <Select
        placeholder="Category"
        style={{ width: '120px', marginRight: '8px' }}
        value={category || undefined}
        onChange={(value) => setCategory(value)}
      >
        <Select.Option value="Errands">Errands</Select.Option>
        <Select.Option value="Landscaping">Landscaping</Select.Option>
        <Select.Option value="Delivery">Delivery</Select.Option>
        <Select.Option value="Pet Care">Pet Care</Select.Option>
        <Select.Option value="Cleaning">Cleaning</Select.Option>
        <Select.Option value="Gear Rental">Gear Rental</Select.Option>
        <Select.Option value="Other">Other</Select.Option>
      </Select>
      <Input
        type="number"
        placeholder="Min Payment"
        style={{ width: '100px', marginRight: '8px' }}
        value={minPayment}
        onChange={(e) => setMinPayment(e.target.value)}
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