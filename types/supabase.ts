export interface Database {
  public: {
    Tables: {
      plants: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          care_instructions: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['plants']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['plants']['Insert']>;
      };
      gardens: {
        Row: {
          id: string;
          user_id: string;
          plant_id: string;
          nickname: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['gardens']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['gardens']['Insert']>;
      };
      care_schedules: {
        Row: {
          id: string;
          plant_id: string;
          garden_id: string;
          water_frequency: number;
          sunlight_needs: string;
          next_water_date: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['care_schedules']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['care_schedules']['Insert']>;
      };
    };
  };
}
