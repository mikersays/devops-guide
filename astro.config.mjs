import { defineConfig } from 'astro/config';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeContent from './src/lib/rehype-content.ts';

// Site URL — override at deploy time via SITE env var if your Pages URL differs.
// Example for a project page: https://<user>.github.io/devops-guide
const SITE = process.env.SITE ?? 'https://example.github.io';
const BASE = process.env.BASE ?? '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
      wrap: false,
    },
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['heading-anchor'], 'aria-label': 'Permalink' },
          content: { type: 'text', value: '§' },
        },
      ],
      rehypeContent,
    ],
  },
});
