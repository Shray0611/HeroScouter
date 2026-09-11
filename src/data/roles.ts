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

export function parseSalaryNum(val: unknown): number {
  if (typeof val === 'number' && Number.isFinite(val)) {
    if (val > 0 && val < 1000) return val * 1000;
    return val;
  }
  if (typeof val === 'string' && val.trim() !== '') {
    const cleaned = val.trim().replace(/[\$,\s]/g, '');
    if (/k$/i.test(cleaned)) {
      const parsed = parseFloat(cleaned.replace(/k$/i, ''));
      return !isNaN(parsed) ? parsed * 1000 : 0;
    }
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed) && Number.isFinite(parsed)) {
      return parsed > 0 && parsed < 1000 ? parsed * 1000 : parsed;
    }
  }
  return 0;
}

export function formatSalary(role: Partial<Role> & Record<string, any>): string {
  if (!role) return 'Competitive Salary';

  const sym = role.currency || '$';
  let min = parseSalaryNum(role.salaryMin ?? role.salary_min ?? role['Salary Min'] ?? role.minSalary);
  let max = parseSalaryNum(role.salaryMax ?? role.salary_max ?? role['Salary Max'] ?? role.maxSalary);

  // If min and max are not set, attempt to extract from combined fields if available
  if (min <= 0 && max <= 0) {
    const rawSalary = role.salary || role.salaryRange || role.compensation || role.baseSalary || role['Salary'] || role['Salary Range'];
    if (typeof rawSalary === 'string' && rawSalary.trim() !== '') {
      const trimmed = rawSalary.trim();
      if (!/competitive|tbd|negotiable/i.test(trimmed)) {
        const parts = trimmed.match(/\$?\d+(?:,\d+)*(?:\.\d+)?\s*k?/gi);
        if (parts && parts.length > 0) {
          min = parseSalaryNum(parts[0]);
          if (parts.length > 1) {
            max = parseSalaryNum(parts[1]);
          }
        } else {
          return trimmed;
        }
      }
    }
  }

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

