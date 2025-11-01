'use client';
import { useState, useEffect } from 'react';
import SearchFilters, { FilterState } from '@/search/SearchFilters';
import BusinessCard from '@/features/BusinessCard';

export default function SearchPage() {
  const [businesses, setBusinesses] = useState([]);
  const [filters, setFilters] = useState<FilterState>({});
  const [loading, setLoading] = useState(false);

  const fetchBusinesses = async (newFilters: FilterState) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (newFilters.category) params.append('category', String(newFilters.category));
      if (newFilters.city) params.append('city', newFilters.city);
      if (newFilters.min_rating) params.append('min_rating', String(newFilters.min_rating));
      if (newFilters.search) params.append('search', newFilters.search);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/businesses/?${params}`
      );
      const data = await response.json();
      setBusinesses(data.results || data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses(filters);
  }, []);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    fetchBusinesses(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Businesses</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SearchFilters 
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : businesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {businesses.map((business: any) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No businesses found. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}