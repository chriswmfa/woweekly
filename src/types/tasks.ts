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

/**
 * Unified TaskType enum serving as the single source of truth
 * These are string-based for backward compatibility with existing code
 */
export const enum TaskType {
  // Primary task types (previously in TaskTypeData)
  RAID = 'raid',
  DUNGEON = 'dungeon',
  DELVE = 'delve',
  QUEST = 'quest',
  COLLECTION = 'collection',
  REPUTATION = 'reputation',
  CRAFTING = 'crafting',
  PVP = 'pvp',
  PROFESSION = 'profession',
  ACTIVITY = 'activity',

  // Additional types (previously only in TaskTag)
  COFFER_KEYS = 'cofferKeys',
  VETERAN_GEAR = 'veteranGear',
  LOOT = 'loot',
  CACHE = 'cache'
}

/**
 * Interface for task type metadata
 */
export interface TaskTypeInfo {
  id: TaskType; // The enum value (which is the same as the key in the TaskTypeData)
  name: string; // Display name
  icon?: string; // Icon identifier (for types that have icons)
  color: string; // Color for UI display
}

/**
 * Map of task types to their metadata
 * This is the single source of truth for all task type information
 */
export const TaskTypeData: Record<string, TaskTypeInfo> = {
  // Primary task types
  [TaskType.RAID]: {
    id: TaskType.RAID,
    name: 'Raid',
    icon: 'mdi-sword-cross',
    color: 'deep-purple'
  },
  [TaskType.DUNGEON]: {
    id: TaskType.DUNGEON,
    name: 'Dungeon',
    icon: 'mdi-gate',
    color: 'grey'
  },
  [TaskType.DELVE]: {
    id: TaskType.DELVE,
    name: 'Delve',
    icon: 'mdi-mine',
    color: 'brown'
  },
  [TaskType.QUEST]: {
    id: TaskType.QUEST,
    name: 'Quest',
    icon: 'mdi-book-open-variant',
    color: 'indigo'
  },
  [TaskType.COLLECTION]: {
    id: TaskType.COLLECTION,
    name: 'Collection',
    icon: 'mdi-package-variant-closed',
    color: 'teal'
  },
  [TaskType.REPUTATION]: {
    id: TaskType.REPUTATION,
    name: 'Reputation',
    icon: 'mdi-account-group',
    color: 'blue'
  },
  [TaskType.CRAFTING]: {
    id: TaskType.CRAFTING,
    name: 'Crafting',
    icon: 'mdi-hammer',
    color: 'orange'
  },
  [TaskType.PVP]: {
    id: TaskType.PVP,
    name: 'PvP',
    icon: 'mdi-sword',
    color: 'red'
  },
  [TaskType.PROFESSION]: {
    id: TaskType.PROFESSION,
    name: 'Profession',
    icon: 'mdi-anvil',
    color: 'brown'
  },
  [TaskType.ACTIVITY]: {
    id: TaskType.ACTIVITY,
    name: 'Activity',
    icon: 'mdi-map-marker',
    color: 'light-blue'
  },

  // Additional types (previously only in TaskTag)
  [TaskType.COFFER_KEYS]: {
    id: TaskType.COFFER_KEYS,
    name: 'Coffer Keys',
    color: 'amber'
  },
  [TaskType.VETERAN_GEAR]: {
    id: TaskType.VETERAN_GEAR,
    name: 'Veteran Gear',
    color: 'green'
  },
  [TaskType.LOOT]: {
    id: TaskType.LOOT,
    name: 'Loot',
    color: 'purple'
  },
  [TaskType.CACHE]: {
    id: TaskType.CACHE,
    name: 'Cache',
    color: 'purple'
  }
}

// Helper function to get all task types as an array
export const getAllTaskTypes = (): string[] => {
  return Object.keys(TaskTypeData)
}

// Helper function to get primary task types (those with icons)
export const getPrimaryTaskTypes = (): string[] => {
  return Object.entries(TaskTypeData)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, info]) => !!info.icon)
    .map(([key]) => key)
}

// Helper function to get task types that are meant to be used as tags
export const getTaskTags = (): string[] => {
  return Object.keys(TaskTypeData)
}

// Helper function to get task type metadata
export const getTaskTypeInfo = (type: string): TaskTypeInfo | undefined => {
  return TaskTypeData[type]
}

// Helper functions that are useful in components
export const getTaskTypeIcon = (type: string): string => {
  return TaskTypeData[type]?.icon || 'mdi-help-circle'
}

export const getTaskTypeColor = (type: string): string => {
  return TaskTypeData[type]?.color || 'grey'
}

export interface WowheadData {
  type: 'quest' | 'npc' | 'zone' | 'item' | 'spell' | 'achievement';
  id: number;
}

export interface Task {
  id: string;
  name: string;
  subtitle: string;
  type: string; // Keep as string for backward compatibility
  tags: string[]; // Keep as string[] for backward compatibility
  completed: boolean;
  completable?: boolean; // Whether this task can be completed with a checkbox (defaults to true)
  notes?: string; // User's personal notes for this task
  wowheadData?: WowheadData; // Data for linking to Wowhead
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
  notes?: string; // User's notes for this task
  deleted?: boolean; // Flag to indicate if this task has been deleted/hidden
}

// Define reputation settings
export interface ReputationSettings {
  showExalted: boolean;
  showParagon: boolean;
  // We can add more reputation-specific settings here
}

// Define the overall UI settings interface
export interface UISettings {
  reputationSettings: ReputationSettings;
  // We can add more UI category settings here in the future
}

// Define the structure of saved state
export interface SavedTasksState {
  [taskId: string]: SavedTaskState | unknown; // Using any for now to allow settings with a different type
  settings?: {
    tasks?: {
      [taskId: string]: SavedTaskState;
    };
    uiSettings?: UISettings;
  };
}

// Alternatively, you could restructure it completely:
export interface SavedTasksStateV2 {
  tasks: {
    [taskId: string]: SavedTaskState;
  };
  settings?: {
    uiSettings?: UISettings;
  };
}

/**
 * Interface for custom tasks storage
 */
export interface CustomTasksStorage {
  [expansionKey: string]: {
    weekly: Task[];
  };
}

// DEPRECATED - But kept in its original form for compatibility
export const enum TaskTag {
  reputation = 'Reputation',
  cofferKeys = 'Coffer Keys',
  veteranGear = 'Veteran Gear',
  loot = 'Loot',
  cache = 'Cache',
  crafting = 'Crafting',
  activity = 'Activity',
  collection = 'Collection',
  profession = 'Profession',
  pvp = 'PvP',
  quest = 'Quest',
  dungeon = 'Dungeon',
  raid = 'Raid'
}

// Interface for tag metadata - DEPRECATED but kept for compatibility
export interface TagInfo {
  label: string;
  color: string;
}

// Map of tag keys to their metadata - DEPRECATED but kept for compatibility
export const TagData: Record<string, TagInfo> = {
  reputation: { label: TaskTag.reputation, color: 'blue' },
  cofferKeys: { label: TaskTag.cofferKeys, color: 'amber' },
  veteranGear: { label: TaskTag.veteranGear, color: 'green' },
  loot: { label: TaskTag.loot, color: 'purple' },
  cache: { label: TaskTag.cache, color: 'purple' },
  crafting: { label: TaskTag.crafting, color: 'orange' },
  activity: { label: TaskTag.activity, color: 'light-blue' },
  collection: { label: TaskTag.collection, color: 'teal' },
  profession: { label: TaskTag.profession, color: 'brown' },
  pvp: { label: TaskTag.pvp, color: 'red' },
  quest: { label: TaskTag.quest, color: 'indigo' },
  dungeon: { label: TaskTag.dungeon, color: 'grey' },
  raid: { label: TaskTag.raid, color: 'deep-purple' }
}
