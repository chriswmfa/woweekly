/* eslint-disable camelcase */
// Types for reputation data from Blizzard API
export interface Reputation {
  faction: {
    key: {
      href: string
    };
    name: string;
    id: number;
  };
  standing: {
    raw: number;
    value: number;
    max: number;
    tier?: number;
    name: string;
    renown_level?: number; // Using snake_case to match the API response
  };
  paragon?: {
    raw: number;
    value: number;
    max: number;
  };
}
