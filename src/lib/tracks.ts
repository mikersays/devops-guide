// Track metadata + helpers used across layouts and pages.

export type TrackId = 'generic' | 'saas' | 'enterprise';

export interface TrackMeta {
  id: TrackId;
  label: string;
  short: string;
  tagline: string;
  audience: string;
  accent: string; // CSS color value (light-mode anchor)
}

export const TRACKS: Record<TrackId, TrackMeta> = {
  generic: {
    id: 'generic',
    label: 'Generic',
    short: 'GEN',
    tagline: 'Industry-agnostic foundations',
    audience: 'Small-to-mid business, 5–50 engineers',
    accent: 'var(--track-generic)',
  },
  saas: {
    id: 'saas',
    label: 'Cloud-native SaaS',
    short: 'SAAS',
    tagline: 'Move fast, measure with DORA',
    audience: 'Series A–C, 20–200 engineers',
    accent: 'var(--track-saas)',
  },
  enterprise: {
    id: 'enterprise',
    label: 'Enterprise',
    short: 'ENT',
    tagline: 'Audit-ready by default',
    audience: 'Regulated, 200+ engineers',
    accent: 'var(--track-enterprise)',
  },
};

export const TRACK_ORDER: TrackId[] = ['generic', 'saas', 'enterprise'];

// Canonical 12-section layout shared by every track. We only carry the slug
// suffix (without the ordering prefix) so display layers can re-derive titles
// from the actual content collection rather than a hard-coded list.
export const SECTION_KEYS = [
  '00-overview',
  '01-team-structure',
  '02-source-control',
  '03-cicd',
  '04-iac',
  '05-cloud-platform',
  '06-observability',
  '07-incident-response',
  '08-security',
  '09-docs-knowledge',
  '10-cost',
  '11-roadmap-90day',
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export function isTrack(value: unknown): value is TrackId {
  return value === 'generic' || value === 'saas' || value === 'enterprise';
}

// Pretty-print a section key → e.g. '03-cicd' → 'CI / CD'
// Acronyms that should render with specific casing rather than Title-case.
const ACRONYMS: Record<string, string> = {
  cicd: 'CI / CD',
  iac: 'IaC',
  slo: 'SLO',
  slsa: 'SLSA',
  oidc: 'OIDC',
  otel: 'OTel',
  eks: 'EKS',
  aws: 'AWS',
  gcp: 'GCP',
  mttr: 'MTTR',
};

export function sectionDisplay(key: string): string {
  const s = key.replace(/^\d+-/, '');
  return s
    .split('-')
    .map((w) => {
      if (w in ACRONYMS) return ACRONYMS[w];
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');
}
