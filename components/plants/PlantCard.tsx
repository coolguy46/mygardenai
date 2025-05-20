import React from 'react';

interface PlantCardProps {
  id?: string;  // This is the garden_id when isGardenPlant=true, or plant_id otherwise
  name: string;
  description?: string | null;
  careInstructions?: string | null;
  imageUrl?: string | null;
  nickname?: string | null;
  nextWater?: string;
  isGardenPlant?: boolean;
  onAddToGarden?: () => void;
  onRemoveFromGarden?: (id: string) => void;
  onDelete?: () => void;
}

export default function PlantCard({
  id,
  name,
  description,
  careInstructions,
  imageUrl,
  nickname,
  nextWater,
  isGardenPlant = false,
  onAddToGarden,
  onRemoveFromGarden,
  onDelete,
}: PlantCardProps) {
  // Process care instructions for proper display
  const renderCareInstructions = () => {
    if (!careInstructions) {
      return <p className="text-sm text-gray-500 italic">No care instructions available</p>;
    }
    
    // Format into key-value pairs based on the expected format from the API
    // First split by newlines
    const lines = careInstructions.split(/\n/).map(line => line.trim()).filter(Boolean);
    
    if (lines.length > 1) {
      // If we have multiple lines, use those
      return (
        <ul className="text-sm text-gray-600 space-y-2 list-none pl-0">
          {lines.map((line, index) => (
            <li key={index} className="pb-1 flex">
              {line.includes(':') ? (
                <>
                  <span className="font-medium min-w-16">{line.split(':')[0]}:</span>
                  <span className="ml-1">{line.split(':').slice(1).join(':')}</span>
                </>
              ) : line}
            </li>
          ))}
        </ul>
      );
    } else {
      // If it's all one line, try to split by category patterns
      const categories = careInstructions.split(/\.\s*(?=[A-Z][a-z]+:)|\.\s*$/);
      
      return (
        <ul className="text-sm text-gray-600 space-y-2 list-none pl-0">
          {categories
            .filter(item => item && item.trim().length > 0)
            .map((item, index) => {
              const trimmedItem = item.trim();
              // Check if this is a key-value pair (contains a colon)
              if (trimmedItem.includes(':')) {
                const [key, ...valueParts] = trimmedItem.split(':');
                const value = valueParts.join(':').trim();
                return (
                  <li key={index} className="pb-1 flex">
                    <span className="font-medium min-w-16">{key}:</span> 
                    <span className="ml-1">{value}</span>
                  </li>
                );
              } else {
                return <li key={index} className="pb-1">{trimmedItem}</li>;
              }
            })}
        </ul>
      );
    }
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent event bubbling
    e.preventDefault();
    e.stopPropagation();
    
    // Make sure we have both an id and a callback function
    if (!id || !onRemoveFromGarden) return;
    
    onRemoveFromGarden(id);
  };
  
  const formatWateringDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image section with optional gradient overlay */}
      {imageUrl ? (
        <div className="relative h-52">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
          {isGardenPlant && nickname && (
            <div className="absolute bottom-0 left-0 p-3 text-white">
              <span className="text-sm font-medium bg-green-600/80 px-2 py-1 rounded">
                {nickname}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-28 bg-gradient-to-r from-green-50 to-green-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
      )}

      {/* Content section */}
      <div className="p-5">
        {/* Plant name and description */}
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-800">{name || 'Unknown Plant'}</h3>
            {!isGardenPlant && nickname && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {nickname}
              </span>
            )}
          </div>
          
          {description && (
            <p className="mt-2 text-gray-600 text-sm line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Watering information if available */}
        {nextWater && (
          <div className="mb-4 flex items-center text-blue-600 bg-blue-50 p-2 rounded">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <span className="text-sm">Water on: {formatWateringDate(nextWater)}</span>
          </div>
        )}

        {/* Care instructions section */}
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
            </svg>
            Care Guide
          </h4>
          {renderCareInstructions()}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {isGardenPlant ? (
            <button
              onClick={handleRemove}
              className="w-full px-4 py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors duration-200 flex items-center justify-center"
              type="button"
              aria-label="Remove from Garden"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Remove from Garden
            </button>
          ) : (
            <>
              <button
                onClick={onAddToGarden}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add to Garden
              </button>
              <button
                onClick={onDelete}
                className="flex-1 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Discard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}