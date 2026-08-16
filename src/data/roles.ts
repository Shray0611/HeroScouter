import seedData from '../imports/hero_scouter_seed_15.json'

export interface Role {
  id: string
  title: string
  company: string
  industry: string | null
  fundingStage: string | null
  companySize: string | null
  companyWebsite: string
  companyLogoUrl: string | null
  status: 'Active' | 'Paused'
  workLocation: 'Remote' | 'In-person' | 'Hybrid'
  location: string
  salaryMin: number
  salaryMax: number
  currency: string
  equityMin: number | null
  equityMax: number | null
  jobCategory: string | null
  employmentType: string
  yoe: string
  positions: number
  h1bSponsorship: boolean
  interviewStages: string
  responsibilities: string
  requirements: string
  benefits: string
  responsibilitiesHtml: string
  requirementsHtml: string
  benefitsHtml: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const roles: Role[] = (seedData as any[]).map((r) => ({
  id: r.hsRoleId ?? '',
  title: r.title ?? '',
  company: r.company ?? '',
  industry: r.industry ?? null,
  fundingStage: r.fundingStage ?? null,
  companySize: r.companySize ?? null,
  companyWebsite: r.companyWebsite ?? '',
  companyLogoUrl: r.companyLogoUrl ?? null,
  status: (r.status ?? 'Active') as 'Active' | 'Paused',
  workLocation: (r.workLocationType ?? 'In-person') as 'Remote' | 'In-person' | 'Hybrid',
  location: r.location ?? '',
  salaryMin: r.salaryMin ?? 0,
  salaryMax: r.salaryMax ?? 0,
  currency: r.currency ?? '$',
  equityMin: r.equityMin ?? null,
  equityMax: r.equityMax ?? null,
  jobCategory: r.jobCategory ?? null,
  employmentType: r.employmentType ?? '',
  yoe: r.yoe ?? '',
  positions: r.positions ?? 1,
  h1bSponsorship: r.h1bSponsorship ?? false,
  interviewStages: r.interviewStages ?? '',
  responsibilities: r.responsibilities ?? '',
  requirements: r.requirements ?? '',
  benefits: r.benefits ?? '',
  responsibilitiesHtml: r.responsibilitiesHtml ?? '',
  requirementsHtml: r.requirementsHtml ?? '',
  benefitsHtml: r.benefitsHtml ?? '',
}))
