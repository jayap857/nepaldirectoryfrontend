import React from 'react';

interface Category {
  id: number;
  name: string;
}

interface CategorySelectProps {
  value: number | null;
  onChange: (categoryId: number) => void;
  categories?: Category[];
  error?: string;
}

const defaultCategories: Category[] = [
  { id: 1, name: 'Restaurant' },
  { id: 2, name: 'Hotel' },
  { id: 3, name: 'Cafe' },
  // Add more default categories or fetch dynamically
];

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange, categories = defaultCategories, error }) => {
  return (
    <div>
      <select
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'}`}
        value={value ?? ''}
        onChange={e => onChange(Number(e.target.value))}
      >
        <option value="">Select a category</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CategorySelect;
