export type Product = {
  name: string;
  unit_profit: number;
  unit_cost: number;
  min_production: number;
  max_production: number;
};

export type ProductionResult = {
  name: string;
  quantity: number;
  unit_profit: number;
  max_production: number;
};

export type OptimizationResponse = {
  results: ProductionResult[];
  total_profit: number;
};
