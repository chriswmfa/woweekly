import { Reputation } from '@/types/reputation'

// Interface for reputation method
export interface ReputationMethod {
  id: string
  name: string
  description: string
  type: 'daily' | 'weekly' | 'one-time' | 'repeatable'
  reputation: number
  wowheadLink?: string
}

// Interface for faction method mapping
export interface FactionMethods {
  id: number
  name: string
  methods: ReputationMethod[]
}

// Enhanced reputation with methods
export interface EnhancedReputation extends Reputation {
  methods?: ReputationMethod[]
}
