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
      
      // Make sure careInstructions is accessible in the identified plant
      setIdentifiedPlant({
        ...data.data,
        careInstructions: data.data.care_instructions || null
      });
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
      if (confirm('Are you sure you want to remove this plant from your garden?')) {
        await removeFromGarden(gardenId);
        setGardenPlants(prev => prev.filter(plant => plant.id !== gardenId));
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800">My Plant Dashboard</h1>
        <p className="text-gray-600">Manage your plants and identify new ones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side - Identification Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Identify New Plant
            </h2>
            <ImageUpload onUpload={handleUpload} isLoading={isLoading} />
          </div>

          {isLoading && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Identifying plant...</p>
              </div>
            </div>
          )}

          {identifiedPlant && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-green-700">Identified Plant</h2>
              <PlantCard
                {...identifiedPlant}
                onAddToGarden={handleAddToGarden}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>

        {/* Right side - Garden View */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-green-700 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
                My Garden
              </h2>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {gardenPlants.length} Plants
              </span>
            </div>

            {gardenPlants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <p className="text-gray-500 mb-2">Your garden is empty</p>
                <p className="text-gray-400 text-sm">Identify a plant to add it to your garden</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </div>
    </div>
  );
}