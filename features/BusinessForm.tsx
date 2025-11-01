import React, { useState, useEffect } from 'react';
import { Save, X, MapPin, Phone, Mail, Globe, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import CategorySelect from '../components/CategorySelect';
import BusinessHoursEditor from './BusinessHoursEditor';
import ImageUpload from '@/components/ImageUpload';

interface BusinessFormProps {
  businessId?: number | null; // If editing, pass business ID
  initialData?: any; // If editing, pass existing business data
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  name: string;
  category_id: number | null;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  contact_number: string;
  email: string;
  website: string;
  opening_hours: any;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  linkedin_url: string;
  image: File | null;
}

const BusinessForm: React.FC<BusinessFormProps> = ({
  businessId,
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category_id: null,
    description: '',
    address: '',
    city: '',
    state: '',
    country: 'Nepal',
    postal_code: '',
    latitude: '',
    longitude: '',
    contact_number: '',
    email: '',
    website: '',
    opening_hours: null,
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    linkedin_url: '',
    image: null
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showSocialMedia, setShowSocialMedia] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category_id: initialData.category?.id || null,
        description: initialData.description || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        country: initialData.country || 'Nepal',
        postal_code: initialData.postal_code || '',
        latitude: initialData.latitude?.toString() || '',
        longitude: initialData.longitude?.toString() || '',
        contact_number: initialData.contact_number || '',
        email: initialData.email || '',
        website: initialData.website || '',
        opening_hours: initialData.opening_hours || null,
        facebook_url: initialData.facebook_url || '',
        instagram_url: initialData.instagram_url || '',
        twitter_url: initialData.twitter_url || '',
        linkedin_url: initialData.linkedin_url || '',
        image: null
      });
      
      if (initialData.facebook_url || initialData.instagram_url || 
          initialData.twitter_url || initialData.linkedin_url) {
        setShowSocialMedia(true);
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: null }));
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData(prev => ({ ...prev, category_id: categoryId }));
    if (errors.category_id) {
      setErrors((prev: any) => ({ ...prev, category_id: null }));
    }
  };

  const handleHoursChange = (hours: any) => {
    setFormData(prev => ({ ...prev, opening_hours: hours }));
  };

  const handleImageChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, image: file }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    } else if (!/^[+\d\s\-()]+$/.test(formData.contact_number)) {
      newErrors.contact_number = 'Invalid phone number format';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.latitude && (isNaN(Number(formData.latitude)) || 
        Number(formData.latitude) < -90 || Number(formData.latitude) > 90)) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }

    if (formData.longitude && (isNaN(Number(formData.longitude)) || 
        Number(formData.longitude) < -180 || Number(formData.longitude) > 180)) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare form data for multipart/form-data
      const submitData = new FormData();
      
      // Add all text fields
      submitData.append('name', formData.name);
      submitData.append('category_id', formData.category_id?.toString() || '');
      submitData.append('description', formData.description);
      submitData.append('address', formData.address);
      submitData.append('city', formData.city);
      submitData.append('state', formData.state);
      submitData.append('country', formData.country);
      submitData.append('postal_code', formData.postal_code);
      submitData.append('contact_number', formData.contact_number);
      
      if (formData.email) submitData.append('email', formData.email);
      if (formData.website) submitData.append('website', formData.website);
      if (formData.latitude) submitData.append('latitude', formData.latitude);
      if (formData.longitude) submitData.append('longitude', formData.longitude);
      
      // Add opening hours as JSON string
      if (formData.opening_hours) {
        submitData.append('opening_hours', JSON.stringify(formData.opening_hours));
      }
      
      // Add social media URLs
      if (formData.facebook_url) submitData.append('facebook_url', formData.facebook_url);
      if (formData.instagram_url) submitData.append('instagram_url', formData.instagram_url);
      if (formData.twitter_url) submitData.append('twitter_url', formData.twitter_url);
      if (formData.linkedin_url) submitData.append('linkedin_url', formData.linkedin_url);
      
      // Add image if provided
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      await onSubmit(submitData);
    } catch (error: any) {
      if (error.response?.data) {
        setErrors(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {businessId ? 'Edit Business' : 'Add New Business'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter business name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <CategorySelect
            value={formData.category_id}
            onChange={handleCategoryChange}
            error={errors.category_id}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your business..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Image
          </label>
          <ImageUpload
            currentImage={initialData?.image_url}
            onImageSelect={handleImageChange}
          />
        </div>
      </div>

      {/* Location Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <MapPin size={20} />
          Location Information
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Street address"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="State/Province"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Postal code"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.latitude ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="27.7172"
            />
            {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.longitude ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="85.3240"
            />
            {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Phone size={20} />
          Contact Information
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number *
          </label>
          <input
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.contact_number ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+977-1-4123456"
          />
          {errors.contact_number && (
            <p className="text-red-500 text-sm mt-1">{errors.contact_number}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Mail size={16} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="business@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Globe size={16} />
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Business Hours</h3>
        <BusinessHoursEditor
          value={formData.opening_hours}
          onChange={handleHoursChange}
        />
      </div>

      {/* Social Media (Optional) */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setShowSocialMedia(!showSocialMedia)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          {showSocialMedia ? '− Hide' : '+ Add'} Social Media Links
        </button>

        {showSocialMedia && (
          <div className="space-y-3 pl-4 border-l-2 border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Facebook size={16} className="text-blue-600" />
                Facebook
              </label>
              <input
                type="url"
                name="facebook_url"
                value={formData.facebook_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Instagram size={16} className="text-pink-600" />
                Instagram
              </label>
              <input
                type="url"
                name="instagram_url"
                value={formData.instagram_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://instagram.com/yourpage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Twitter size={16} className="text-blue-400" />
                Twitter
              </label>
              <input
                type="url"
                name="twitter_url"
                value={formData.twitter_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://twitter.com/yourpage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Linkedin size={16} className="text-blue-700" />
                LinkedIn
              </label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://linkedin.com/company/yourpage"
              />
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {loading ? 'Saving...' : businessId ? 'Update Business' : 'Create Business'}
        </button>
      </div>
    </form>
  );
};

export default BusinessForm;