export type Todo = {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
  completedAt?: number;
};

export type EnergyState = {
  value: number;
  threshold: number;
  perCompletion: number;
};
