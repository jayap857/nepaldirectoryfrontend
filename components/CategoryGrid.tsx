// components/CategoryGrid.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import api from '@/services/api';

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  business_count: number;
  is_active: boolean;
}

interface CategoryGridProps {
  limit?: number;
  showAll?: boolean;
  className?: string;
}

export default function CategoryGrid({ 
  limit, 
  showAll = false,
  className = '' 
}: CategoryGridProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/public-categories/');
      let data = response.data;

      // Apply limit if specified
      if (limit && !showAll) {
        data = data.slice(0, limit);
      }

      setCategories(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Default icon mapping for categories
  const getIconForCategory = (categoryName: string, icon?: string) => {
    if (icon) return icon;

    const iconMap: { [key: string]: string } = {
      restaurant: '🍽️',
      hotel: '🏨',
      cafe: '☕',
      shopping: '🛍️',
      hospital: '🏥',
      school: '🎓',
      gym: '💪',
      salon: '💇',
      bank: '🏦',
      pharmacy: '💊',
      transport: '🚗',
      travel: '✈️',
      entertainment: '🎬',
      technology: '💻',
      automotive: '🚙',
      real_estate: '🏠',
      default: '🏢'
    };

    const key = categoryName.toLowerCase().replace(/\s+/g, '_');
    return iconMap[key] || iconMap.default;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
  <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchCategories}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No categories available</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/businesses?category=${category.id}`}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center border border-gray-100 hover:border-blue-300 transform hover:-translate-y-1">
              {/* Icon */}
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {getIconForCategory(category.name, category.icon)}
              </div>

              {/* Category Name */}
              <h3 className="font-semibold text-gray-800 mb-1 text-sm group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>

              {/* Business Count */}
              <p className="text-xs text-gray-500">
                {category.business_count} {category.business_count === 1 ? 'business' : 'businesses'}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      {!showAll && categories.length >= (limit || 0) && (
        <div className="text-center mt-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View All Categories
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}