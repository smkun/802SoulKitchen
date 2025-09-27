# 802 Soul Kitchen Website

A fast, static brochure website built with Astro, Tailwind CSS, and React islands for 802 Soul Kitchen.

## 🏗️ Project Structure

```text
802SoulKitchen/
├── apps/
│   └── web/                 # Main Astro application
├── packages/
│   └── shared-types/        # Shared TypeScript definitions
├── tools/
│   └── eslint-config/       # Shared ESLint configuration
├── scripts/                 # Development and deployment scripts
└── .github/workflows/       # CI/CD workflows
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or later
- npm (comes with Node.js)

### Development

```bash
# Clone and setup
git clone <repository-url>
cd 802SoulKitchen

# Start development server
./scripts/dev.sh

# Or manually:
npm install
npm run setup
npm run dev
```

The site will be available at `http://localhost:4321`

### Building for Production

```bash
# Build the entire project
./scripts/build.sh

# Or manually:
npm run build
```

### Deployment

```bash
# Create deployment package
./scripts/deploy.sh

# Then upload the generated .tar.gz file to iFastNet htdocs
```

## 📦 Available Scripts

| Script               | Description               |
| -------------------- | ------------------------- |
| `npm run dev`        | Start development server  |
| `npm run build`      | Build for production      |
| `npm run test`       | Run tests                 |
| `npm run lint`       | Run ESLint                |
| `npm run format`     | Format code with Prettier |
| `npm run type-check` | Check TypeScript types    |

## 🏛️ Architecture

### Tech Stack

- **Framework**: Astro 4.x with static site generation
- **Styling**: Tailwind CSS with custom brand tokens
- **Islands**: React 18.x for interactive components
- **Search**: Pagefind for static content search, Fuse.js for menu search
- **Types**: Shared TypeScript definitions across packages
- **Deployment**: Static files to iFastNet hosting

### Key Features

- 🎨 **Brand Consistency**: Preserves existing logo and color palette
- ⚡ **Performance**: Lighthouse score ≥90 on mobile
- 🔍 **Search**: Static search with Pagefind + dynamic menu search
- 📱 **Responsive**: Mobile-first design with Tailwind
- ♿ **Accessible**: WCAG AA compliance
- 🔧 **Developer Experience**: TypeScript, ESLint, Prettier, CI/CD

### Brand Colors

```css
--brand-white: #fdfcfd --brand-red: #da2c2b --brand-orange: #f38c2c --brand-dark: #060b22;
```

## 📄 Pages

- **Home** (`/`): Hero, features, hours, location
- **Menu** (`/menu`): Food categories with search
- **Gallery** (`/gallery`): Photo showcase
- **Search** (`/search`): Site-wide search interface
- **Contact** (`/contact`): Contact form and information

## 🧩 Components

### Astro Components

- `Layout.astro`: Base page layout
- `Header.astro`: Navigation and logo
- `Footer.astro`: Contact info and links

### React Islands (Future)

- `Gallery.tsx`: Interactive photo gallery
- `MenuList.tsx`: Searchable menu with Fuse.js
- `SearchBar.tsx`: Pagefind search interface

## 🌍 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Analytics (Optional)
PUBLIC_GA_MEASUREMENT_ID=
PUBLIC_PLAUSIBLE_DOMAIN=

# Firebase (Optional)
PUBLIC_FIREBASE_API_KEY=
PUBLIC_FIREBASE_AUTH_DOMAIN=
PUBLIC_FIREBASE_PROJECT_ID=
```

## 🚀 Deployment

### iFastNet Static Hosting

1. Run `npm run build` to generate static files
2. Upload contents of `apps/web/dist/` to iFastNet `htdocs` directory
3. Ensure file permissions: 644 for files, 755 for directories

### CI/CD

GitHub Actions automatically:

- Runs tests and quality checks on PRs
- Builds deployment packages on main branch
- Runs Lighthouse performance audits

## 🔧 Development

### Adding New Pages

1. Create `.astro` file in `apps/web/src/pages/`
2. Use Layout component for consistency
3. Add navigation links in Header component

### Adding React Components

1. Create `.tsx` file in `apps/web/src/components/react/`
2. Import in Astro page with `client:load` directive
3. Use shared types from `@802sk/shared-types`

### Styling

- Use Tailwind classes with brand color tokens
- Custom components in `apps/web/src/styles/global.css`
- Follow existing patterns for consistency

## 📊 Performance Targets

- Lighthouse Performance ≥90 (mobile)
- Time to Interactive <2s
- First Contentful Paint <1.5s
- Cumulative Layout Shift <0.1

## 🤝 Contributing

1. Create feature branch from `develop`
2. Make changes with proper TypeScript types
3. Run tests and quality checks: `npm run test && npm run lint`
4. Submit PR to `develop` branch

## 📝 License

ISC - Copyright 802 Soul Kitchen
