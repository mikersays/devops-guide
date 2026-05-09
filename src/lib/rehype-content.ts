// Rehype plugin: tags the "Alternatives" blockquote with data-callout, and the
// list following "## Quick checklist" with class="quick-checklist". Runs at
// build time so the markup is correct on first paint with no JS flash.

import type { Element, Root, Text, ElementContent } from 'hast';
import { visit } from 'unist-util-visit';

function getText(node: ElementContent | Element): string {
  if (!node) return '';
  if ((node as Text).type === 'text') return (node as Text).value;
  const el = node as Element;
  if (!el.children) return '';
  return el.children.map((c) => getText(c as ElementContent)).join('');
}

export default function rehypeContent() {
  return (tree: Root) => {
    // H1 stripping is handled in CSS via `.md-body > h1:first-child { display:none }`
    // — that approach also runs in dev mode without depending on Astro's
    // content-pipeline cache invalidation.

    visit(tree, 'element', (node: Element, index, parent) => {
      // 1. Mark `> **Alternatives:**` blockquotes
      if (node.tagName === 'blockquote') {
        // First non-whitespace child is typically a <p>
        const firstP = node.children.find(
          (c) => (c as Element).type === 'element' && (c as Element).tagName === 'p'
        ) as Element | undefined;
        if (firstP) {
          const firstStrong = firstP.children.find(
            (c) => (c as Element).type === 'element' && (c as Element).tagName === 'strong'
          ) as Element | undefined;
          if (firstStrong) {
            const text = getText(firstStrong).trim().toLowerCase();
            if (text.startsWith('alternatives')) {
              node.properties = node.properties ?? {};
              (node.properties as Record<string, unknown>)['dataCallout'] = 'alternatives';
            }
          }
        }
      }

      // 2. After `## Quick checklist`, find the next sibling list and tag it.
      if (
        node.tagName === 'h2' &&
        node.properties &&
        (node.properties as Record<string, unknown>)['id'] === 'quick-checklist' &&
        parent &&
        typeof index === 'number'
      ) {
        // Walk forward through siblings to find the next list element.
        const siblings = (parent as Element).children;
        for (let i = index + 1; i < siblings.length; i++) {
          const s = siblings[i] as Element;
          if (s.type !== 'element') continue;
          if (s.tagName === 'ul' || s.tagName === 'ol') {
            const props = (s.properties = s.properties ?? {});
            const cls = (props['className'] as string[] | undefined) ?? [];
            if (!cls.includes('quick-checklist')) cls.push('quick-checklist');
            props['className'] = cls;
            break;
          }
          // Stop scanning at next heading
          if (/^h[1-6]$/.test(s.tagName)) break;
        }
      }
    });
  };
}
