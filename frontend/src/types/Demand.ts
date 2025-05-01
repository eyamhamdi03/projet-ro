export interface Demand {
  id: string;
  name: string;
  required_capacity: number;
  duration: number;
  earliest_start: string;
  profit: number;
  incompatible_resources?: string[];
}
