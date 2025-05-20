"use client"

import React from 'react';
import { useState, useEffect } from 'react';
import ImageUpload from '@/components/upload/ImageUpload';
import PlantCard from '@/components/plants/PlantCard';
import { getGardenPlants, addToGarden, removeFromGarden } from '@/lib/supabase/garden';
import type { GardenPlant, Plant } from '@/types/database';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [identifiedPlant, setIdentifiedPlant] = useState<Plant | null>(null);
  const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>([]);

  useEffect(() => {
    loadGardenPlants();
  }, []);

  const loadGardenPlants = async () => {
    try {
      const plants = await getGardenPlants();
      setGardenPlants(plants);
    } catch (error) {
      console.error('Failed to load garden:', error);
    }
  };

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/plants', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to identify plant');
      const data = await response.json();
      setIdentifiedPlant(data.data);
    } catch (error) {
      console.error('Error:', error);
      // TODO: Add error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToGarden = async () => {
    if (!identifiedPlant?.id) return;

    try {
      await addToGarden(identifiedPlant.id);
      await loadGardenPlants();
      setIdentifiedPlant(null);
    } catch (error) {
      console.error('Failed to add to garden:', error);
    }
  };

  const handleRemoveFromGarden = async (gardenId: string) => {
    try {
      console.log('Attempting to remove garden entry:', gardenId);
      if (confirm('Are you sure you want to remove this plant from your garden?')) {
        await removeFromGarden(gardenId);
        // Update local state to remove the plant
        setGardenPlants(prev => prev.filter(plant => plant.id !== gardenId));
        console.log('Plant removed successfully');
      }
    } catch (error) {
      console.error('Failed to remove from garden:', error);
      alert('Failed to remove plant from garden. Please try again.');
    }
  };

  const handleDelete = () => {
    setIdentifiedPlant(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Garden View */}
        <div className="lg:flex-1 w-full bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">My Garden</h2>
          {gardenPlants.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Your garden is empty. Identify a plant to add it to your garden.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gardenPlants.map((plant) => (
                <PlantCard
                  key={plant.id}
                  id={plant.id} 
                  name={plant.plant.name}
                  description={plant.plant.description}
                  imageUrl={plant.plant.image_url}
                  careInstructions={plant.plant.care_instructions}
                  nickname={plant.nickname}
                  nextWater={plant.care_schedule?.next_water_date}
                  isGardenPlant={true}
                  onRemoveFromGarden={handleRemoveFromGarden}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right side - Upload & Identification */}
        <div className="lg:w-[480px] w-full space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Identify Plant</h2>
            <ImageUpload onUpload={handleUpload} isLoading={isLoading} />
          </div>

          {isLoading && (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-600">Identifying plant...</p>
            </div>
          )}

          {identifiedPlant && (
            <PlantCard
              {...identifiedPlant}
              onAddToGarden={handleAddToGarden}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}