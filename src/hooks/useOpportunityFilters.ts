import { useState, useEffect } from "react";
import type { CastingOpportunity } from "@/types/casting";
import { getBertSimilarity } from "@/services/bertSimilarity"; // import the helper

interface OpportunityFilters {
  roleType: string;
  location: string;
  compensation: string;
}

export const useOpportunityFilters = (opportunities: CastingOpportunity[], userProfile: any) => {
  const [filters, setFilters] = useState<OpportunityFilters>({
    roleType: '',
    location: '',
    compensation: ''
  });

  const [scoredOpportunities, setScoredOpportunities] = useState<CastingOpportunity[]>([]);

  // Step 1: Build userProfile text once
  const userProfileText = [
    userProfile.role,
    userProfile.actorType,
    userProfile.favoriteGenres?.join(" "),
    userProfile.location
  ].filter(Boolean).join(" ").toLowerCase();

  // Step 2: Calculate similarity scores (async)
  useEffect(() => {
    const runSimilarityScoring = async () => {
      const scored = await Promise.all(
        opportunities.map(async (opportunity) => {
          const opportunityText = [
            opportunity.title,
            opportunity.project_name,
            opportunity.description,
            opportunity.requirements,
            opportunity.genres?.join(" "),
            opportunity.role_type
          ].filter(Boolean).join(" ").toLowerCase();

          const similarity = await getBertSimilarity(opportunityText, userProfileText);
          opportunity.similarity = similarity
          return opportunity;
        })
      );

      setScoredOpportunities(scored);
    };

    runSimilarityScoring();
  }, [opportunities, userProfile]);

  // Step 3: Apply filters + threshold
  const filteredOpportunities = scoredOpportunities
    .filter(opportunity => {
      if (filters.roleType && opportunity.role_type !== filters.roleType) return false;
      if (filters.location && !opportunity.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.compensation && !opportunity.compensation_range?.toLowerCase().includes(filters.compensation.toLowerCase())) return false;
      return true;
    })
    .filter(op => op.similarity > 0.2) // Apply threshold
    .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0)); // sort best matches first

  return {
    filters,
    setFilters,
    filteredOpportunities
  };
};