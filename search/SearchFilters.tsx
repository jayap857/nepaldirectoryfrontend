import React, { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
  business_count: number;
}

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export interface FilterState {
  category?: number;
  city?: string;
  min_rating?: number;
  max_rating?: number;
  search?: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilterChange, initialFilters }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilters || {});
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public-categories/`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {};
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof FilterState]);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Search
        </label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Business name, description..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Category
        </label>
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading categories...</div>
        ) : (
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.business_count})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          City
        </label>
        <input
          type="text"
          value={filters.city || ''}
          onChange={(e) => handleFilterChange('city', e.target.value)}
          placeholder="e.g., Kathmandu"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Rating Range */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Minimum Rating
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.min_rating || 0}
            onChange={(e) => handleFilterChange('min_rating', e.target.value ? Number(e.target.value) : undefined)}
            className="flex-1"
          />
          <span className="text-sm font-medium text-gray-700 w-12 text-right">
            {filters.min_rating ? `${filters.min_rating}★` : 'Any'}
          </span>
        </div>
      </div>

      {/* Star Rating Quick Filters */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Quick Filter
        </label>
        <div className="flex flex-wrap gap-2">
          {[5, 4, 3].map((rating) => (
            <button
              key={rating}
              onClick={() => handleFilterChange('min_rating', filters.min_rating === rating ? undefined : rating)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.min_rating === rating
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {rating}★ & up
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Clear All Filters
        </button>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm font-semibold text-gray-700 mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Category: {categories.find(c => c.id === filters.category)?.name}
              </span>
            )}
            {filters.city && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                City: {filters.city}
              </span>
            )}
            {filters.min_rating && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Rating: {filters.min_rating}★+
              </span>
            )}
            {filters.search && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Search: {filters.search}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md p-6 sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Filters</h2>
          {hasActiveFilters && (
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
              {Object.keys(filters).filter(k => filters[k as keyof FilterState]).length}
            </span>
          )}
        </div>
        <FilterContent />
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg font-semibold flex items-center gap-2 hover:bg-blue-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
              {Object.keys(filters).filter(k => filters[k as keyof FilterState]).length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
          <div className="relative min-h-screen flex items-end">
            <div className="relative bg-white w-full rounded-t-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <FilterContent />
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchFilters;