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
          // The anchor is appended *inside* the heading. Previously its
          // `content` was a text node `§`, which leaked into Astro's heading
          // collector (right-rail TOC rendered "Why it matters§") and into
          // Pagefind search snippets. The fix: keep `behavior: 'append'` but
          // give the anchor empty text — the visible glyph is rendered via
          // CSS (`.heading-anchor::after`) so it never enters the DOM text.
          // `data-pagefind-ignore` is belt-and-suspenders.
          behavior: 'append',
          properties: {
            className: ['heading-anchor'],
            'aria-label': 'Permalink',
            'data-pagefind-ignore': '',
          },
          content: [],
        },
      ],
      rehypeContent,
    ],
  },
});
