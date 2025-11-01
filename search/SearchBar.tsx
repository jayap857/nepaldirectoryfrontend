import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Star, Loader } from 'lucide-react';

interface Business {
  id: number;
  name: string;
  category: string;
  city: string;
  address: string;
  average_rating: number;
  review_count: number;
  image_url?: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelectBusiness?: (businessId: number) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onSelectBusiness,
  placeholder = "Search businesses, categories, locations...",
  showSuggestions = true
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions from API
  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim() || !showSuggestions) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/search/?q=${encodeURIComponent(searchQuery)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.slice(0, 5)); // Show top 5 results
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for suggestions
    if (value.trim()) {
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (business: Business) => {
    setQuery(business.name);
    setShowDropdown(false);
    if (onSelectBusiness) {
      onSelectBusiness(business.id);
    }
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={20} 
          />
          
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />

          {/* Loading or Clear Button */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {loading ? (
              <Loader className="animate-spin text-gray-400" size={20} />
            ) : query && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {suggestions.map((business) => (
            <button
              key={business.id}
              onClick={() => handleSuggestionClick(business)}
              className="w-full px-4 py-3 hover:bg-gray-50 transition flex items-start gap-3 text-left border-b last:border-b-0"
            >
              {/* Business Image */}
              {business.image_url ? (
                <img
                  src={business.image_url}
                  alt={business.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <Search size={20} className="text-gray-400" />
                </div>
              )}

              {/* Business Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 truncate">
                  {business.name}
                </h4>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <span className="truncate">{business.category}</span>
                  {business.city && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin size={14} />
                        {business.city}
                      </span>
                    </>
                  )}
                </div>

                {/* Rating */}
                {business.average_rating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {business.average_rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({business.review_count})
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* View All Results */}
          {suggestions.length > 0 && (
            <button
              onClick={() => {
                onSearch(query);
                setShowDropdown(false);
              }}
              className="w-full px-4 py-3 text-center text-blue-600 hover:bg-blue-50 font-medium transition"
            >
              View all results for "{query}"
            </button>
          )}
        </div>
      )}

      {/* No Results */}
      {showDropdown && !loading && query.trim() && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-6 text-center">
          <Search size={48} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-600">No businesses found for "{query}"</p>
          <p className="text-sm text-gray-500 mt-1">
            Try different keywords or browse by category
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;