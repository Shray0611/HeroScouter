export interface Role {
  id: string;
  title: string;
  company: string;
  industry: string | null;
  fundingStage: string | null;
  companySize: string | null;
  companyWebsite: string;
  companyLogoUrl: string | null;
  status: "Active" | "Inactive";
  workLocation: "Remote" | "In-person" | "Hybrid";
  location: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  equityMin: number | null;
  equityMax: number | null;
  jobCategory: string | null;
  employmentType: string;
  yoe: string;
  positions: number;
  h1bSponsorship: boolean;
  interviewStages: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  responsibilitiesHtml: string;
  requirementsHtml: string;
  benefitsHtml: string;
}

export const roles: Role[] = [];

export function formatSalary(role: Partial<Role>): string {
  const sym = role.currency || '$';
  const min = typeof role.salaryMin === 'number' && Number.isFinite(role.salaryMin) ? role.salaryMin : 0;
  const max = typeof role.salaryMax === 'number' && Number.isFinite(role.salaryMax) ? role.salaryMax : 0;

  if (min <= 0 && max <= 0) return 'Competitive Salary';

  const formatK = (val: number) => {
    return val >= 1000 ? `${(val / 1000).toFixed(0)}K` : `${val}`;
  };

  if (min > 0 && max > 0) {
    if (min === max) return `${sym}${formatK(min)}`;
    return `${sym}${formatK(min)} – ${sym}${formatK(max)}`;
  }
  if (min > 0) return `${sym}${formatK(min)}+`;
  return `Up to ${sym}${formatK(max)}`;
}
