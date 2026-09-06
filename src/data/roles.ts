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
