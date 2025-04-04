export const enum Expansion {
  tww = 'The War Within',
  df = 'Dragonflight',
  bfa = 'Battle for Azeroth',
}

export interface Task {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  icon: string;
  completed: boolean;
  isCountable?: boolean; // Whether this task has multiple steps to complete (e.g. "Complete 3 Delves")
  currentCount?: number; // Current progress (e.g. 1, 2)
  targetCount?: number; // Target count needed to complete the task (e.g. 3)
  notes?: string; // User's personal notes for this task
}

export interface ExpansionData {
  name: string;
  daily: Task[];
  weekly: Task[];
}

export interface TasksData {
  expansions: {
    [key: string]: ExpansionData;
  }
}

// Define the structure of the saved task state
export interface SavedTaskState {
  completed: boolean;
  currentCount?: number;
  notes?: string; // User's notes for this task
}

// Define the structure of all saved task states
export interface SavedTasksState {
  [taskId: string]: SavedTaskState;
}

export const enum TaskTag {
  reputation = 'Reputation',
  cofferKeys = 'Coffer Keys',
  veteranGear = 'Veteran Gear',
  pinnacleChest = 'Pinnacle Chest'
}
