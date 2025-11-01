import Link from "next/link";

interface Business {
  id: number;
  name: string;
  category: string;
  city: string;
  image_url: string | null;
  average_rating: number;
  review_count: number;
  is_verified: boolean;
  description?: string;
}

interface BusinessCardProps {
  business: Business;
  layout?: "grid" | "list";
}

export default function BusinessCard({ business, layout = "grid" }: BusinessCardProps) {
  if (layout === "list") {
    return (
      <Link
        href={`/business/${business.id}`}
        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition flex"
      >
        <div className="w-48 h-48 bg-gray-200 flex-shrink-0">
          {business.image_url ? (
            <img
              src={business.image_url}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-6 flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {business.name}
              {business.is_verified && (
                <span className="text-blue-600 text-sm ml-2">✓</span>
              )}
            </h3>
          </div>
          <p className="text-gray-600 mb-2">
            {business.category} • {business.city}
          </p>
          {business.description && (
            <p className="text-gray-600 mb-3 line-clamp-2">{business.description}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">
              ⭐ {business.average_rating?.toFixed(1) || "N/A"}
            </span>
            <span className="text-gray-500 text-sm">
              ({business.review_count} reviews)
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Grid layout (default)
  return (
    <Link
      href={`/business/${business.id}`}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition block"
    >
      <div className="h-48 bg-gray-200">
        {business.image_url ? (
          <img
            src={business.image_url}
            alt={business.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {business.name}
          </h3>
          {business.is_verified && (
            <span className="text-blue-600 text-sm flex-shrink-0 ml-2">✓</span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {business.category} • {business.city}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">
            ⭐ {business.average_rating?.toFixed(1) || "N/A"}
          </span>
          <span className="text-gray-500 text-sm">
            ({business.review_count} reviews)
          </span>
        </div>
      </div>
    </Link>
  );
}