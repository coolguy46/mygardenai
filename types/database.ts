export interface Plant {
  id: string;
  user_id: string;
  name: string;
  description: string;
  care_instructions: string;
  image_url: string;
  created_at: string;
}

export interface Garden {
  id: string;
  user_id: string;
  plant_id: string;
  nickname?: string;
  created_at: string;
}

export interface CareSchedule {
  id: string;
  plant_id: string;
  garden_id: string;
  water_frequency: number;
  sunlight_needs: string;
  next_water_date: string;
  created_at: string;
}

export interface GardenPlant {
  id: string;
  user_id: string;
  plant_id: string;
  nickname?: string;
  plant: {
    id: string;
    name: string;
    description: string;
    care_instructions: string;
    image_url: string;
  };
  care_schedule: {
    id: string;
    water_frequency: number;
    sunlight_needs: string;
    next_water_date: string;
  };
}
