export interface Task {
  id: string;
  title: string;
  description: string;
  reward: string;
  worker: string | null;
  isCompleted: boolean;
}