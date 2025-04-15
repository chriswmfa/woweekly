import reputationMethodsData from '@/data/reputations.json'
import { Reputation } from '@/types/reputation'
import { ReputationMethod, FactionMethods, EnhancedReputation } from '@/types/reputationMethods'

export class ReputationMethodsService {
  /**
   * Gets all reputation methods data
   * @returns The complete reputation methods data
   */
  static getAllReputationMethods (): FactionMethods[] {
    return reputationMethodsData.factions as FactionMethods[]
  }

  /**
   * Gets methods for increasing a specific faction's reputation
   * @param factionId The faction ID
   * @returns Array of methods or undefined if no methods exist
   */
  static getMethodsForFaction (factionId: number): ReputationMethod[] | undefined {
    const faction = reputationMethodsData.factions.find(f => f.id === factionId)
    return faction?.methods as ReputationMethod[] | undefined
  }

  /**
   * Enhances reputation data from the API with methods from our mapping file
   * @param reputations Array of reputations from the API
   * @returns Enhanced reputations with methods attached
   */
  static enhanceReputationsWithMethods (reputations: Reputation[]): EnhancedReputation[] {
    return reputations.map(reputation => {
      const factionId = reputation.faction.id
      const methods = this.getMethodsForFaction(factionId)

      return {
        ...reputation,
        methods
      }
    })
  }
}
