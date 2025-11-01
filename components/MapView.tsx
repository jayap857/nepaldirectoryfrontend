import React, { useEffect, useRef } from 'react';

interface MapViewProps {
  latitude: number;
  longitude: number;
  businessName?: string;
  address?: string;
  zoom?: number;
  height?: string;
}

const MapView: React.FC<MapViewProps> = ({
  latitude,
  longitude,
  businessName = 'Business Location',
  address,
  zoom = 15,
  height = '400px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // This is a placeholder for map integration
    // You can integrate with Google Maps, Leaflet, or Mapbox
    initializeMap();

    return () => {
      // Cleanup if needed
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude]);

  const initializeMap = () => {
    // Example: Using Leaflet (you need to install: npm install leaflet)
    // import L from 'leaflet';
    // if (mapRef.current && !mapInstanceRef.current) {
    //   mapInstanceRef.current = L.map(mapRef.current).setView([latitude, longitude], zoom);
    //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstanceRef.current);
    //   L.marker([latitude, longitude]).addTo(mapInstanceRef.current)
    //     .bindPopup(businessName)
    //     .openPopup();
    // }
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const openInAppleMaps = () => {
    const url = `https://maps.apple.com/?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-3">
      {/* Map Container - Static Image Fallback */}
      <div 
        ref={mapRef}
        className="relative rounded-lg overflow-hidden border border-gray-300 bg-gray-100"
        style={{ height }}
      >
        {/* Static Map using Google Maps Static API or similar */}
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=600x400&markers=color:red%7C${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`}
          alt="Map"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if static map fails
            e.currentTarget.style.display = 'none';
          }}
        />
        
        {/* Fallback content when image fails */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-600 font-semibold mb-1">{businessName}</p>
            {address && <p className="text-sm text-gray-500">{address}</p>}
          </div>
        </div>

        {/* Overlay with business name */}
        <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md">
          <p className="font-semibold text-gray-800">{businessName}</p>
          {address && <p className="text-sm text-gray-600">{address}</p>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={openInGoogleMaps}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Open in Google Maps
        </button>
        
        <button
          onClick={openInAppleMaps}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Apple Maps
        </button>
      </div>

      {/* Coordinates Display */}
      <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded border border-gray-200">
        <span className="font-semibold">Coordinates: </span>
        {latitude.toFixed(6)}, {longitude.toFixed(6)}
      </div>

      {/* Installation Instructions (Remove in production) */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
        <p className="font-semibold text-yellow-800 mb-2">🗺️ Map Integration Options:</p>
        <div className="text-yellow-700 space-y-1">
          <p><strong>Option 1 - Google Maps:</strong></p>
          <code className="text-xs bg-yellow-100 px-2 py-1 rounded">npm install @react-google-maps/api</code>
          
          <p className="pt-2"><strong>Option 2 - Leaflet (Free):</strong></p>
          <code className="text-xs bg-yellow-100 px-2 py-1 rounded">npm install leaflet react-leaflet</code>
          
          <p className="pt-2"><strong>Option 3 - Mapbox:</strong></p>
          <code className="text-xs bg-yellow-100 px-2 py-1 rounded">npm install mapbox-gl</code>
        </div>
      </div>
    </div>
  );
};

export default MapView;

// EXAMPLE USAGE:
// 
// <MapView 
//   latitude={27.7172} 
//   longitude={85.3240}
//   businessName="Nepal Restaurant"
//   address="Kathmandu, Nepal"
//   zoom={15}
//   height="500px"
// />