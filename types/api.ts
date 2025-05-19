export interface PlantIdentification {
  name: string;
  summary: string;
  description: string;
  careInstructions: string;
}

export type APIResponse<T> = {
  data: T;
  error?: string;
};
