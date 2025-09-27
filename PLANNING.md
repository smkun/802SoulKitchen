# PLANNING.md: 802 Soul Kitchen Brochure Site Migration

## Vision

Transform the current HTML/CSS/JS site into a fast, static brochure page using Astro and Tailwind that preserves the existing brand identity while delivering exceptional performance. Enable visitors to quickly find menu items, view photos, and contact the business through optimized search functionality and responsive design. Deploy as static files to iFastNet hosting for maximum reliability and minimal maintenance overhead.

## Tech Stack

- **Framework**: Astro 4.x (latest stable) with Vite build system
- **Styling**: Tailwind CSS 3.x with custom brand tokens
- **Search**: Pagefind 1.x for static content indexing, Fuse.js 7.x for client-side menu search
- **Islands**: React 18.x components for Gallery and MenuList interactivity
- **Optional Data**: Firebase Firestore 10.x and Storage for dynamic menu management
- **Analytics**: GA4 or Plausible (privacy-respecting)
- **Hosting**: iFastNet static file deployment to `htdocs`

## Components and Boundaries

### Core Pages (Astro Static)

- **Home** (`/`): Hero with logo, tagline, hours, service area CTA
- **Menu** (`/menu`): Menu cards with categories, pricing, optional Fuse.js search
- **Gallery** (`/gallery`): Image showcase with optimized loading
- **Search** (`/search`): Pagefind-powered static content search
- **Contact** (`/contact`): Tap-to-call, map integration, contact form

### React Islands (Client-side Hydration)

- **Gallery.tsx**: Interactive lightbox, lazy loading, keyboard navigation
- **MenuList.tsx**: Fuse.js fuzzy search, category filters, real-time results
- **SearchBar.tsx**: Pagefind integration with debounced input

### Static Assets

- Brand colors from existing CSS (PRD.md:18-24, styles.css:18-24)
- Logo file: `802Logo.png` (existing asset)
- Optimized images in `/public/assets/`
- Pagefind index in `/public/_pagefind/`

## External Services and Data Flow

### Required Services

- **iFastNet Hosting**: Static file serving from `htdocs` directory
- **Pagefind**: Build-time static search index generation

### Optional Services

- **Firebase Firestore**: Read-only menu data (`menu_items`, `settings` collections)
- **Firebase Storage**: Optimized image assets with CDN delivery
- **Analytics**: GA4/Plausible for visitor tracking (DNT-respecting)

### Data Flow

```text
Build Time: Astro → Tailwind purge → Pagefind index → /dist
Runtime: Static HTML → React island hydration → Optional Firestore reads
Admin: Firebase Auth → Firestore writes (owner-only)
```

## Key Technical Decisions

### Architecture Rationale

- **Astro over Next.js**: Static-first approach optimizes for performance and hosting constraints
- **React Islands over Full SPA**: Selective hydration maintains speed while enabling interactivity
- **Tailwind over Custom CSS**: Maintainable styling with existing brand token integration
- **Pagefind over Algolia**: Zero-cost static search without external dependencies

### Performance Strategy

- Static page generation with selective hydration (PRD.md:59)
- Image optimization with lazy loading and correct sizing (PRD.md:60-62)
- Tailwind purging for minimal CSS bundle
- Preload critical assets, defer non-essential JavaScript

### Brand Preservation

- Extract existing color palette to Tailwind theme tokens (styles.css:18-24)
- Maintain logo usage and visual hierarchy (802Logo.png)
- Preserve Inter font family and spacing patterns

## Open Questions and Risks

### Technical Risks

1. **Bundle Size Risk**: Too much JavaScript could impact performance targets
   - **Mitigation**: Strict island architecture, bundle analysis in CI
   - **Next Step**: Establish performance budgets and monitoring

2. **Search Index Size**: Large menu content could bloat Pagefind index
   - **Mitigation**: Content optimization, selective indexing
   - **Next Step**: Test with full menu content to validate index size

3. **Firestore Security**: Public read access requires careful rule configuration
   - **Mitigation**: Firestore rules testing, owner-only write permissions
   - **Next Step**: Security rule implementation and penetration testing

### Implementation Questions

1. **Image Optimization Strategy**: Manual compression vs build-time optimization?
   - **Next Step**: Evaluate Astro image optimization plugins vs manual workflow

2. **Menu Data Structure**: Static JSON vs Firestore for initial launch?
   - **Next Step**: Assess content update frequency to determine data strategy

3. **Analytics Implementation**: GA4 vs Plausible for privacy compliance?
   - **Next Step**: Define privacy requirements and select appropriate solution

### Migration Risks

1. **Content Loss**: Existing copy and images might be missed during migration
   - **Mitigation**: Content audit checklist and side-by-side comparison
   - **Next Step**: Complete content inventory from current site

2. **Brand Inconsistency**: Visual differences from current site could confuse users
   - **Mitigation**: Pixel-perfect brand token extraction and design review
   - **Next Step**: Visual regression testing setup

### Performance Validation

- **Target**: Lighthouse Performance ≥ 90 on mobile (PRD.md:28)
- **Risk**: React islands or large images could impact Core Web Vitals
- **Next Step**: Establish performance monitoring and testing pipeline

## Next Steps

1. **Project Setup**: Initialize Astro project with Tailwind and React integration
2. **Brand Migration**: Extract color tokens and implement Tailwind theme configuration
3. **Content Audit**: Catalog all existing copy, images, and functionality for migration
4. **Performance Baseline**: Establish current site metrics for improvement tracking
5. **Search Strategy**: Prototype Pagefind integration to validate approach
