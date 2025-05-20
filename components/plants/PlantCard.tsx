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
      return <p className="text-sm text-gray-500">No care instructions available</p>;
    }
    
    // Format into key-value pairs based on the expected format from the API
    // Example: "Water: Keep submerged in water. Light: Full sun."
    const careItems = [];
    
    // First split by newlines
    const lines = careInstructions.split(/\n/).map(line => line.trim()).filter(Boolean);
    
    if (lines.length > 1) {
      // If we have multiple lines, use those
      return (
        <ul className="text-sm text-gray-600 space-y-2 list-none pl-0">
          {lines.map((line, index) => (
            <li key={index} className="pb-1">
              {line.includes(':') ? (
                <>
                  <span className="font-medium">{line.split(':')[0]}:</span>
                  {line.split(':').slice(1).join(':')}
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
                  <li key={index} className="pb-1">
                    <span className="font-medium">{key}:</span> {value}
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
    if (!id) {
      console.error('Cannot remove from garden: Missing garden ID');
      return;
    }
    
    if (!onRemoveFromGarden) {
      console.error('Cannot remove from garden: Missing callback function');
      return;
    }
    
    console.log('Removing plant from garden with ID:', id);
    onRemoveFromGarden(id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {imageUrl && (
        <div className="w-full h-48 relative bg-gray-100">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{name || 'Unknown Plant'}</h3>
          {nickname && (
            <p className="text-sm text-gray-500">Nickname: {nickname}</p>
          )}
          {description && <p className="mt-2 text-gray-600">{description}</p>}
          {nextWater && (
            <div className="mt-2 text-sm text-blue-600">
              Next watering: {new Date(nextWater).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Care Guide</h4>
          {renderCareInstructions()}
        </div>

        <div className="flex gap-3 pt-2">
          {isGardenPlant ? (
            <button
              onClick={handleRemove}
              className="w-full px-4 py-2 text-red-500 border border-red-300 rounded-md hover:bg-red-50 cursor-pointer active:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
              type="button"
              aria-label="Remove from Garden"
            >
              Remove from Garden
            </button>
          ) : (
            <>
              <button
                onClick={onAddToGarden}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Add to Garden
              </button>
              <button
                onClick={onDelete}
                className="flex-1 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Trash it
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}