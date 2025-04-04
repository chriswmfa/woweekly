export const enum Expansion {
  tww = 'The War Within',
  df = 'Dragonflight',
  sl = 'Shadowlands',
  bfa = 'Battle for Azeroth',
  legion = 'Legion',
  wod = 'Warlords of Draenor',
  mop = 'Mists of Pandaria',
  cata = 'Cataclysm',
  wotlk = 'Wrath of the Lich King',
  tbc = 'The Burning Crusade',
  classic = 'Classic',
}

// Interface for expansion metadata
export interface ExpansionInfo {
  name: string;
  color: string;
  icon: string;
}

// Map of expansion keys to their metadata
export const ExpansionData: Record<keyof typeof Expansion, ExpansionInfo> = {
  tww: { name: Expansion.tww, color: 'blue', icon: 'mdi-pickaxe' },
  df: { name: Expansion.df, color: 'orange', icon: 'mdi-cloud' },
  sl: { name: Expansion.sl, color: 'indigo', icon: 'mdi-ghost' },
  bfa: { name: Expansion.bfa, color: 'red', icon: 'mdi-sword-cross' },
  legion: { name: Expansion.legion, color: 'green', icon: 'mdi-account-group' },
  wod: { name: Expansion.wod, color: 'brown', icon: 'mdi-castle' },
  mop: { name: Expansion.mop, color: 'green-darken-2', icon: 'mdi-panda' },
  cata: { name: Expansion.cata, color: 'orange-darken-3', icon: 'mdi-fire' },
  wotlk: { name: Expansion.wotlk, color: 'blue-lighten-1', icon: 'mdi-snowflake' },
  tbc: { name: Expansion.tbc, color: 'green-darken-4', icon: 'mdi-gate' },
  classic: { name: Expansion.classic, color: 'amber-darken-2', icon: 'mdi-shield' }
}

export const enum TaskTag {
  reputation = 'Reputation',
  cofferKeys = 'Coffer Keys',
  veteranGear = 'Veteran Gear',
  loot = 'Loot',
  pinnacleChest = 'Pinnacle Chest',
  crafting = 'Crafting',
  activity = 'Activity',
  collection = 'Collection',
  profession = 'Profession',
  pvp = 'PvP',
  quest = 'Quest',
  dungeon = 'Dungeon',
  raid = 'Raid'
}

// Interface for tag metadata
export interface TagInfo {
  label: string;
  color: string;
}

// Map of tag keys to their metadata
export const TagData: Record<string, TagInfo> = {
  reputation: { label: TaskTag.reputation, color: 'blue' },
  cofferKeys: { label: TaskTag.cofferKeys, color: 'amber' },
  veteranGear: { label: TaskTag.veteranGear, color: 'green' },
  loot: { label: TaskTag.loot, color: 'purple' },
  pinnacleChest: { label: TaskTag.pinnacleChest, color: 'purple' },
  crafting: { label: TaskTag.crafting, color: 'orange' },
  activity: { label: TaskTag.activity, color: 'light-blue' },
  collection: { label: TaskTag.collection, color: 'teal' },
  profession: { label: TaskTag.profession, color: 'brown' },
  pvp: { label: TaskTag.pvp, color: 'red' },
  quest: { label: TaskTag.quest, color: 'indigo' },
  dungeon: { label: TaskTag.dungeon, color: 'grey' },
  raid: { label: TaskTag.raid, color: 'deep-purple' }
}

// Interface for task type metadata
export interface TaskTypeInfo {
  name: string;
  icon: string;
  color: string;
}

// Map of task types to their metadata
export const TaskTypeData: Record<string, TaskTypeInfo> = {
  raid: { name: 'Raid', icon: 'mdi-sword-cross', color: 'deep-purple' },
  dungeon: { name: 'Dungeon', icon: 'mdi-gate', color: 'grey' },
  delve: { name: 'Delve', icon: 'mdi-mine', color: 'brown' },
  quest: { name: 'Quest', icon: 'mdi-book-open-variant', color: 'indigo' },
  collection: { name: 'Collection', icon: 'mdi-package-variant-closed', color: 'teal' },
  reputation: { name: 'Reputation', icon: 'mdi-account-group', color: 'blue' },
  crafting: { name: 'Crafting', icon: 'mdi-hammer', color: 'orange' },
  pvp: { name: 'PvP', icon: 'mdi-sword', color: 'red' },
  profession: { name: 'Profession', icon: 'mdi-anvil', color: 'brown' },
  activity: { name: 'Activity', icon: 'mdi-map-marker', color: 'light-blue' }
}

export interface Task {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  tags: TaskTag[];
  completed: boolean;
  isCountable?: boolean; // Whether this task has multiple steps to complete (e.g. "Complete 3 Delves")
  currentCount?: number; // Current progress (e.g. 1, 2)
  targetCount?: number; // Target count needed to complete the task (e.g. 3)
  notes?: string; // User's personal notes for this task
}

export interface ExpansionData {
  name: string;
  weekly: Task[];
}

export interface TasksData {
  expansions: {
    [key: string]: ExpansionData;
  };
}

// Define the structure of the saved task state
export interface SavedTaskState {
  completed: boolean;
  currentCount?: number;
  notes?: string; // User's notes for this task
  deleted?: boolean; // Flag to indicate if this task has been deleted/hidden
}

// Define the structure of all saved task states
export interface SavedTasksState {
  [taskId: string]: SavedTaskState;
}

/**
 * Interface for custom tasks storage
 */
export interface CustomTasksStorage {
  [expansionKey: string]: {
    weekly: Task[];
  };
}
