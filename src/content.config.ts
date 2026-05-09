import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Track sections (12 per track × 3 tracks = 36 entries)
const tracks = defineCollection({
  loader: glob({ pattern: '{generic,saas,enterprise}/*.md', base: './content' }),
  schema: z.object({
    title: z.string(),
    track: z.enum(['generic', 'saas', 'enterprise']),
    order: z.number().int().min(0).max(11),
    summary: z.string(),
  }),
});

// Shared pages (landing, glossary, maturity, choose-your-track, contributing).
// Base is the shared/ folder directly so IDs are bare basenames
// (e.g. 'glossary' rather than 'shared/glossary') for cleaner getEntry calls.
const shared = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/shared' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['landing', 'navigator', 'reference', 'assessment', 'meta']),
    summary: z.string(),
  }),
});

export const collections = { tracks, shared };
