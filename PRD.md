# Product Requirements Document (PRD): Food Vendor Brochure Page

**Summary (brochure page focus)**
- Convert current HTML/CSS/JS site to a fast, static brochure page with search. Keep existing logo and color palette.
- Host on iFastNet as static files. Upload to `htdocs`.
- Tech: Astro + Tailwind. React islands where needed. Pagefind for static search. Fuse.js for data search. Optional Firebase for menu/specials.

## Users and Jobs
- Visitors: view menu, photos, hours, location; call or message quickly.
- Owner/staff: optionally update menu or specials with minimal friction.

## Scope
**In**
- Port content to Astro.
- Keep logo and brand colors.
- Responsive layout and image gallery.
- Search: Pagefind (static pages). Optional Fuse.js (menu data).
- Basic analytics and SEO.
- No custom server.

**Out (for now)**
- Online ordering or payments.
- Full CMS dashboard.
- Multi‑language.

## Success Metrics (KPIs)
- Time to Interactive < 2s on a mid‑tier phone.
- Lighthouse Performance ≥ 90 on mobile.
- Lower bounce vs current site.
- Search usage ≥ 20% on menu‑heavy pages.
- Organic impressions and CTR rise month over month.

## Requirements
### Branding
- Use existing logo file.
- Lift hex colors from current CSS into Tailwind theme tokens.
- Consistent spacing, type scale, and accessible contrast.

### Information Architecture
- **Home**: hero with logo, tagline, CTA, hours, service area.
- **Menu**: cards with categories, tags, price.
- **Gallery**: fast images with lightbox.
- **Search**:
  - `/search` using Pagefind for static sections.
  - Optional in‑page Fuse.js for menu search and filters.
- **Contact**: tap‑to‑call, map link, email link.

### Search Behavior
- **Pagefind**: builds a static index after site build; highlights matches; paginates.
- **Fuse.js**: client‑side fuzzy search on menu array with weighted keys; debounced input; category filters.

### Data (Optional)
- **Firestore collections**
  - `menu_items`: {name, description, price, category, tags, imageUrl, isSpecial}
  - `settings`: hours, serviceAreaZipCodes, announcements
- Public site is read‑only. Writes limited to an owner‑auth admin page.

### Performance
- Keep most pages static. Hydrate only gallery and menu components.
- Compress images; correct sizes and `loading="lazy"` where appropriate.
- Tailwind with purge of unused styles.
- Preload hero image; defer non‑critical JS.

### Accessibility
- Keyboard‑friendly nav and gallery.
- AA color contrast.
- Alt text on all images.
- Visible focus styles.

### SEO
- Unique title and meta description per page.
- Open Graph tags.
- LocalBusiness structured data where it fits.

### Analytics
- GA4 or Plausible. Respect DNT.

### Security
- If admin page exists: Firebase Auth with email allowlist.
- Firestore rules: public read of menu; restricted writes.

### Browser Support
- Current evergreen desktop and mobile browsers (last 2 versions).

## Technical Decisions
### Stack
- Astro (Vite build) + Tailwind.
- React only for Gallery and Menu search components.
- Pagefind for static search; Fuse.js for data search.
- Optional Firebase Firestore and Storage for editable content.
- Deploy by uploading `/dist` to iFastNet `htdocs`.

### Project Structure
```
src/pages/index.astro
src/pages/menu.astro
src/pages/search.astro
src/pages/contact.astro
src/components/Gallery.tsx          # React island
src/components/MenuList.tsx         # React island + Fuse.js
public/_pagefind/*                  # generated bundle
public/assets/*                     # images, logo
```

## Content Migration
- Move all existing copy and images.
- Keep logo and palette.
- Normalize headings and body copy for Pagefind indexing.

## Constraints
- No backend server.
- iFastNet static hosting only.
- Brand parity with current site.

## Risks and Mitigations
- Too much JS slows pages → keep pages static; use small islands.
- Public Firestore writes → lock rules; owner‑only writes.
- Large images → compress; correct sizes; next‑gen formats.

## Acceptance Criteria
- Static build runs without a server; upload `/dist` to `htdocs` and site works.
- Brand logo and colors match the current site.
- Search:
  - Pagefind returns relevant results with titles and snippets.
  - If enabled, Fuse.js returns fuzzy matches on menu items with filters.
- Lighthouse mobile Performance ≥ 90.
- All images have alt text. Keyboard navigation works.

## Milestones
1) **Scaffold**: Astro project; Tailwind added; base layout and routing.
2) **Brand + Layout**: Tailwind theme with brand tokens; header, footer, hero.
3) **Content Migration**: copy, hours, service area, gallery images.
4) **Search**: add `/search` with Pagefind; optional Fuse.js on Menu page.
5) **Optional Data**: Firestore read path for menu/specials; locked rules.
6) **QA + Accessibility**: keyboard, contrast, alt text, responsive checks.
7) **Deploy**: build and upload `/dist` to iFastNet `htdocs`.

## VS Code + Claude Code + SuperClaude
- `\sc:design "Astro + Tailwind skeleton. Pages: /, /menu, /search, /contact. React islands: Gallery, MenuList."`
- `\sc:implement` to generate files and wiring.
- `\sc:implement "Integrate Pagefind. Add /search page and build step."`
- `\sc:implement "Add Fuse.js menu search with weighted keys."`
- `\sc:build` then upload `/dist`.

