import React, { useState } from 'react';
import { Input, Button, Alert, Select } from 'antd';

interface SearchBarProps {
  onSearch: (params: {
    title?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
    minPayment?: string;
    maxPayment?: string;
  }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [minPayment, setMinPayment] = useState('');
  const [maxPayment, setMaxPayment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    setError(null);
    const trimmedTitle = searchTitle.trim();

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.');
      return;
    }

    const searchParams: {
      title?: string;
      startDate?: string;
      endDate?: string;
      category?: string;
      minPayment?: string;
      maxPayment?: string;
    } = { title: trimmedTitle };

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

    if (maxPayment) {
      searchParams.maxPayment = maxPayment;
    }

    onSearch(searchParams);
  };

  const handleClearSearch = () => {
    setSearchTitle('');
    setStartDate(null);
    setEndDate(null);
    setCategory(null);
    setMinPayment('');
    setMaxPayment('');
    onSearch({});
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', border: '1px solid #d9d9d9', padding: '8px', borderRadius: '4px' }}>
      {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: '8px' }} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
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
          style={{ width: '120px' }}
          value={endDate ? new Date(endDate).toISOString().slice(0, 16) : ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
          placeholder="End Date"
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <Select
          placeholder="Select Category"
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
        <Input
          type="number"
          placeholder="Max Payment"
          style={{ width: '100px' }}
          value={maxPayment}
          onChange={(e) => setMaxPayment(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button type="primary" onClick={handleSearch} style={{ marginRight: '4px' }}>
          Search
        </Button>
        <Button onClick={handleClearSearch}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;


