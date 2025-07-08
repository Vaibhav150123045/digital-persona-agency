
import { useState } from "react";
import type { CastingOpportunity } from "@/types/casting";

interface OpportunityFilters {
  roleType: string;
  location: string;
  compensation: string;
}

export const useOpportunityFilters = (opportunities: CastingOpportunity[]) => {
  const [filters, setFilters] = useState<OpportunityFilters>({
    roleType: '',
    location: '',
    compensation: ''
  });

  const filteredOpportunities = opportunities.filter(opportunity => {
    if (filters.roleType && opportunity.role_type !== filters.roleType) return false;
    if (filters.location && !opportunity.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.compensation && !opportunity.compensation_range?.toLowerCase().includes(filters.compensation.toLowerCase())) return false;
    return true;
  });

  return {
    filters,
    setFilters,
    filteredOpportunities
  };
};
