import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

import type { FilterOptions } from '../types';

interface SearchFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  companies: string[];
}

const SearchFilters = ({ filters, onFilterChange, companies }: SearchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'attended', label: 'Attended' },
    { value: 'pending', label: 'Pending' },
    { value: 'absent', label: 'Absent' }
  ];

  const companyOptions = [
    { value: '', label: 'All Companies' },
    ...companies.map(company => ({ value: company, label: company }))
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, statusFilter: value as FilterOptions['statusFilter'] });
  };

  const handleCompanyChange = (value: string) => {
    onFilterChange({ ...filters, companyFilter: value });
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    onFilterChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [type]: value ? new Date(value) : null
      }
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      searchQuery: '',
      statusFilter: 'all',
      companyFilter: '',
      dateRange: { start: null, end: null }
    });
    setIsExpanded(false);
  };

  const hasActiveFilters = filters.statusFilter !== 'all' || 
    filters.companyFilter !== '' || 
    filters.dateRange.start !== null || 
    filters.dateRange.end !== null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by name, email, or company..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Advanced Filters
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              iconName="X"
              iconPosition="left"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
          <Select
            label="Status"
            options={statusOptions}
            value={filters.statusFilter}
            onChange={handleStatusChange}
          />

          <Select
            label="Company"
            options={companyOptions}
            value={filters.companyFilter}
            onChange={handleCompanyChange}
            searchable
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="Start date"
                value={filters.dateRange.start ? filters.dateRange.start.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
              />
              <Input
                type="date"
                placeholder="End date"
                value={filters.dateRange.end ? filters.dateRange.end.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;