# 802 Soul Kitchen Website - Technical Documentation

**Version:** 2025.1
**Last Updated:** September 2025
**Target Audience:** Web developers and business owners

## Table of Contents

1. [Project Overview](#project-overview)
2. [Deployment Guide](#deployment-guide)
3. [Development Workflow](#development-workflow)
4. [Technical Architecture](#technical-architecture)
5. [Image Optimization System](#image-optimization-system)
6. [Performance Optimizations](#performance-optimizations)
7. [Maintenance Guide](#maintenance-guide)
8. [Troubleshooting](#troubleshooting)
9. [Security Considerations](#security-considerations)

---

## Project Overview

The 802 Soul Kitchen website is a modern, responsive single-page application built for a Vermont-based soul food pop-up restaurant. The site features dynamic content management, optimized image delivery, and mobile-first design principles.

### Key Business Features

- **Dynamic Event Management**: Real-time event posting and management
- **Menu Management**: Live menu updates with category organization
- **Photo Gallery**: Auto-cycling gallery with professional transitions
- **Contact Integration**: Direct links to social media and ordering platforms
- **Mobile Optimization**: Responsive design for on-site customer access

### Technical Highlights

- **Performance-First**: Optimized image delivery system with WebP support
- **Modern Architecture**: ES6 modules, Firebase integration, component-based JavaScript
- **Admin Authentication**: Google OAuth with role-based access control
- **Progressive Enhancement**: Graceful fallbacks for older browsers
- **SEO Optimization**: Complete meta tags, structured data, and social sharing

---

## Deployment Guide

### Prerequisites

- Web hosting account with static file support
- Domain name (optional but recommended)
- FTP/SFTP client or web hosting control panel access

### Step 1: Prepare Deployment Files

The project separates deployment files from development tools. **Only upload these files:**

```text
DEPLOYMENT FILES (Upload these):
├── index.html (42KB) - Main website
├── script.js (49KB) - JavaScript functionality
├── styles.css (7KB) - Custom styling
├── 802Logo.png (232KB) - Restaurant logo
├── optimized/ - Optimized image directory
│   ├── webp/ - WebP format images (20-35% smaller)
│   ├── medium/ - 800px max dimension versions
│   ├── thumbnails/ - 300x300px versions
│   └── *.jpg - Optimized JPEG versions (85% quality)
└── PHOTOS/ - Original images (fallback only)
```

### Step 2: Upload Process

#### Option A: FTP/SFTP Upload

1. Connect to your web hosting account via FTP/SFTP
2. Navigate to your public web directory (usually `public_html/` or `www/`)
3. Upload all files and folders from the DEPLOYMENT FILES section
4. Preserve directory structure exactly as shown above

#### Option B: Control Panel Upload

1. Log into your hosting control panel
2. Open File Manager or similar tool
3. Navigate to public web directory
4. Upload files using the control panel's upload feature
5. Extract if uploaded as a ZIP file, maintaining folder structure

### Step 3: Verify Deployment

After uploading, test the following:

1. **Basic Functionality**
   - Visit your domain/subdomain
   - Verify the logo loads correctly
   - Check that all sections display properly
   - Test mobile responsiveness

2. **Image Gallery**
   - Confirm photos display and cycle automatically
   - Verify WebP images load on supported browsers
   - Test fallback to JPEG on older browsers

3. **Admin Panel**
   - Click the admin FAB (floating action button)
   - Test Google authentication (admin emails only)
   - Verify event and menu management functions

### Step 4: Domain Configuration

If using a custom domain:

1. Update DNS A records to point to your hosting server
2. Update Firebase authentication domains (see Firebase Setup section)
3. Update canonical URLs in `index.html` if needed

### Deployment Checklist

- [ ] All deployment files uploaded with correct structure
- [ ] Website loads without errors
- [ ] Images display correctly (both WebP and JPEG fallbacks)
- [ ] Photo gallery cycles automatically
- [ ] Admin authentication works for authorized emails
- [ ] Mobile layout displays correctly
- [ ] Social media links function properly
- [ ] Google authentication domain configured

---

## Development Workflow

### Adding New Photos

#### Method 1: Automatic Optimization (Recommended)

1. Add new photos to `PHOTOS/` directory
2. Name them sequentially: `16.jpg`, `17.jpg`, etc.
3. Run the optimization script:

   ```bash
   # On Windows (Git Bash or WSL)
   cd /path/to/802SoulKitchen
   bash tools/scripts/optimize_images.sh

   # On Windows (Command Prompt)
   tools/scripts/optimize_images.bat
   ```

4. Upload new optimized images to your web server
5. Photos appear automatically in the gallery

#### Method 2: Manual Process

1. Add photos to `PHOTOS/` directory with sequential naming
2. Manually create optimized versions (see Image Optimization section)
3. Upload all versions to the appropriate directories

### Updating Content

#### Events Management

Events are managed through the admin panel:

1. Access admin panel with authorized Google account
2. Use Events tab to add/edit/delete events
3. Changes appear immediately on the live site
4. Past events are automatically filtered out

#### Menu Management

Menu items are managed through the admin panel:

1. Access Menu tab in admin panel
2. Organize items by categories: Mains, Combos, Sides, Drinks, Dessert
3. Set custom order within categories
4. Add descriptions as needed

#### Static Content Updates

To modify static content (About, Contact info):

1. Edit `index.html` directly
2. Locate the relevant section
3. Update text while preserving HTML structure
4. Re-deploy the modified file

### Adding New Features

#### CSS Modifications

1. Edit `styles.css` for custom styling
2. The file includes:
   - CSS custom properties for brand colors
   - Animation keyframes
   - Component-specific styles
   - Responsive design overrides

#### JavaScript Enhancements

1. Edit `script.js` for functionality changes
2. Key areas:
   - Firebase configuration (lines 6-14)
   - Admin authorization (lines 22-25)
   - Event rendering (renderEvents function)
   - Menu rendering (renderMenu function)
   - Photo gallery logic (photoGallery object)

### Development Environment Setup

1. **Local Server Required**
   - Use VS Code Live Server, Python SimpleHTTPServer, or similar
   - Firebase authentication requires `localhost` or authorized domain

2. **Firebase Development**
   - Create separate Firebase project for development
   - Update config in development version of `script.js`
   - Test admin functionality with development database

3. **Image Testing**
   - Test optimization scripts on sample images first
   - Verify WebP support detection works correctly
   - Check responsive image loading

---

## Technical Architecture

### Frontend Architecture

**Framework:** Vanilla JavaScript with ES6 modules
**Styling:** TailwindCSS + Custom CSS
**Build Process:** No build step required (static files)

#### Core Components

1. **Authentication System**
   - Google OAuth integration via Firebase Auth
   - Role-based access control with email whitelist
   - Session management with real-time auth state

2. **Data Management**
   - Firebase Firestore for events and menu data
   - Real-time listeners for live updates
   - Client-side filtering and sorting

3. **Image Gallery System**
   - Dynamic photo detection and loading
   - Auto-cycling with cinematic transitions
   - Format detection and progressive enhancement

4. **Responsive Layout**
   - CSS Grid for main layout structure
   - Flexbox for component arrangements
   - Mobile-first responsive design

### Backend Services

**Database:** Firebase Firestore
**Authentication:** Firebase Auth with Google OAuth
**Hosting:** Static file hosting (no server-side processing)

#### Data Structure

```javascript
// Events Collection
{
  id: "auto-generated",
  title: "Festival Name",
  location: "Event Location",
  startDate: "YYYY-MM-DD",
  endDate: "YYYY-MM-DD", // optional for multi-day
  startTime: "HH:mm",
  endTime: "HH:mm",
  description: "Event details",
  isActive: true,
  createdAt: timestamp,
  updatedAt: timestamp
}

// Menu Collection
{
  id: "auto-generated",
  name: "Item Name",
  category: "Mains|Combos|Sides|Drinks|Dessert",
  price: "$X.XX",
  description: "Optional description",
  order: 1, // for sorting within category
  isActive: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Security Model

1. **Firebase Security Rules**
   - Public read access for all data
   - Write access restricted to authorized admin emails
   - Email-based authorization list

2. **Client-Side Validation**
   - Admin email verification before UI access
   - Form validation for data integrity
   - Error handling for failed operations

3. **Authentication Flow**
   - Google OAuth popup authentication
   - Real-time auth state monitoring
   - Automatic session management

---

## Image Optimization System

### Overview

The image optimization system automatically generates multiple formats and sizes from source images, providing the best performance for each user's device and browser capabilities.

### Optimization Process

#### Automated Script Features

- **WebP Generation**: Creates modern WebP format (20-35% smaller)
- **JPEG Optimization**: Reduces file size with 85% quality setting
- **Thumbnail Creation**: 300x300px versions for previews
- **Medium Sizing**: 800px maximum dimension for responsive loading
- **Metadata Stripping**: Removes EXIF data for privacy and size reduction

#### Generated File Structure

```text
optimized/
├── webp/               # WebP format (best compression)
│   ├── 1.webp
│   ├── 2.webp
│   └── ...
├── thumbnails/         # 300x300px square thumbnails
│   ├── 1.jpg
│   ├── 2.jpg
│   └── ...
├── medium/            # 800px max dimension
│   ├── 1.jpg
│   ├── 2.jpg
│   └── ...
└── [name].jpg         # Optimized JPEG (85% quality)
```

### Image Loading Strategy

The website uses a sophisticated fallback system:

1. **WebP Detection**: Browser capability detection
2. **Format Selection**: WebP for supported browsers, JPEG otherwise
3. **Lazy Loading**: Native browser lazy loading with intersection observer fallback
4. **Progressive Enhancement**: Graceful degradation for older browsers

#### Implementation Details

```javascript
// WebP support detection
const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Dynamic image source selection
const getOptimizedImagePath = (imageNumber, useWebP = false) => {
    const ext = useWebP ? 'webp' : 'jpg';
    const folder = useWebP ? 'optimized/webp/' : 'optimized/';
    return `${folder}${imageNumber}.${ext}`;
};
```

### Performance Benefits

- **File Size Reduction**: 25-50% smaller files compared to originals
- **Format Optimization**: WebP support provides additional 20-35% savings
- **Responsive Loading**: Appropriate image sizes for different screen sizes
- **Bandwidth Savings**: Reduced data usage, especially on mobile

### Running Optimization Scripts

#### Windows (Git Bash/WSL)

```bash
cd /path/to/802SoulKitchen
bash tools/scripts/optimize_images.sh
```

#### Windows (Command Prompt)

```cmd
cd C:\path\to\802SoulKitchen
tools\scripts\optimize_images.bat
```

#### Script Requirements

- **ImageMagick**: For JPEG optimization and resizing
- **WebP Tools**: For WebP format generation
- **Bash Environment**: Git Bash or WSL on Windows

---

## Performance Optimizations

### Implemented Optimizations

#### Image Performance

1. **Format Optimization**: Automatic WebP/JPEG selection
2. **Lazy Loading**: Native browser support with fallbacks
3. **Progressive Enhancement**: Multiple format/size options
4. **Async Decoding**: Non-blocking image rendering
5. **Preload Optimization**: Critical images loaded first

#### JavaScript Performance

1. **ES6 Modules**: Efficient loading and caching
2. **Event Delegation**: Efficient event handling
3. **Debounced Operations**: Optimized real-time updates
4. **Memory Management**: Proper cleanup of listeners
5. **Async Operations**: Non-blocking Firebase operations

#### CSS Performance

1. **Critical CSS Inline**: Above-the-fold styles in head
2. **Font Optimization**: Google Fonts with display=swap
3. **Animation Optimization**: GPU-accelerated transforms
4. **Selector Efficiency**: Optimized CSS selectors
5. **Media Query Organization**: Mobile-first approach

#### Network Performance

1. **CDN Usage**: TailwindCSS and Google Fonts via CDN
2. **HTTP/2 Optimization**: Multiple small files benefit from multiplexing
3. **Caching Headers**: Static assets with long-term caching
4. **Compression**: Gzip/Brotli compression for text assets

### Performance Metrics

#### Expected Performance

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

#### File Size Targets

- **HTML**: ~42KB (includes inline critical CSS)
- **JavaScript**: ~49KB (modular, cacheable)
- **CSS**: ~7KB (custom styles only)
- **Images**: 25-50% reduction from originals

### Monitoring Performance

#### Browser DevTools

1. **Network Tab**: Monitor loading times and file sizes
2. **Lighthouse**: Run performance audits
3. **Performance Tab**: Analyze runtime performance
4. **Coverage Tab**: Identify unused code

#### Real-World Testing

1. **Mobile Testing**: Test on actual mobile devices
2. **Network Throttling**: Test on slower connections
3. **WebP Support Testing**: Verify fallback behavior
4. **Cross-Browser Testing**: Ensure consistent experience

---

## Maintenance Guide

### Regular Maintenance Tasks

#### Weekly Tasks

- [ ] Check admin panel functionality
- [ ] Verify image gallery is cycling correctly
- [ ] Test Google authentication
- [ ] Review and update events as needed
- [ ] Check mobile responsiveness

#### Monthly Tasks

- [ ] Review Firebase usage and quotas
- [ ] Update menu items and pricing
- [ ] Add new photos if available
- [ ] Check for broken links or features
- [ ] Review site analytics (if implemented)

#### Quarterly Tasks

- [ ] Update dependencies (TailwindCSS CDN)
- [ ] Review and optimize image collection
- [ ] Performance audit with Lighthouse
- [ ] Security review of Firebase rules
- [ ] Backup current site version

### Content Management

#### Adding New Events

1. Use admin panel for routine events
2. For special events, consider updating static content
3. Ensure dates are accurate and formatted consistently
4. Test display on mobile devices

#### Menu Updates

1. Regular price updates through admin panel
2. Seasonal menu changes via admin interface
3. Category reorganization if menu structure changes
4. Photo updates for new menu items

#### Photo Gallery Management

1. **Adding Photos**: Use optimization script for new images
2. **Removing Photos**: Delete from all optimized folders
3. **Reorganizing**: Renumber files if needed (update all formats)
4. **Quality Control**: Ensure consistent lighting and composition

### Technical Maintenance

#### Firebase Management

1. **Database Cleanup**: Remove old events periodically
2. **User Management**: Review authorized admin list
3. **Usage Monitoring**: Check quotas and billing
4. **Security Rules**: Review and update as needed

#### Performance Monitoring

1. **Load Time Testing**: Regular speed tests
2. **Image Optimization**: Re-run scripts for new photos
3. **Code Review**: Check for unused code or features
4. **Mobile Testing**: Ensure responsive design integrity

### Backup Procedures

#### Critical Files to Backup

- `index.html` - Main website file
- `script.js` - Core functionality
- `styles.css` - Custom styling
- `PHOTOS/` - Original image files
- Firebase project configuration

#### Backup Schedule

- **Before Updates**: Always backup before changes
- **Weekly**: Automated backup of current state
- **Before Deployment**: Full project backup
- **Quarterly**: Archive complete project versions

---

## Troubleshooting

### Common Issues and Solutions

#### Image Gallery Not Working

**Symptom**: Photos not loading or cycling
**Causes & Solutions**:

1. **Missing optimized images**: Run optimization script
2. **Incorrect file paths**: Check folder structure matches expected
3. **JavaScript errors**: Check browser console for errors
4. **Network issues**: Verify all image files uploaded correctly

**Debug Steps**:

```javascript
// Check photo detection in browser console
console.log('Detected photos:', photoGallery.photos);
```

#### Admin Panel Access Issues

**Symptom**: Cannot access admin features after login
**Causes & Solutions**:

1. **Email not authorized**: Check AUTHORIZED_ADMINS array in script.js
2. **Firebase rules**: Verify security rules include admin email
3. **Authentication state**: Check browser network tab for auth errors
4. **Browser cache**: Clear cache and cookies for the site

**Debug Steps**:

```javascript
// Check authentication state in browser console
console.log('Current user:', auth.currentUser);
console.log('Is authorized:', isAuthorizedAdmin(auth.currentUser));
```

#### Performance Issues

**Symptom**: Slow loading or poor performance
**Causes & Solutions**:

1. **Large images**: Re-run optimization script with correct settings
2. **Missing WebP**: Ensure WebP files generated and uploaded
3. **CDN issues**: Check TailwindCSS and Google Fonts loading
4. **JavaScript errors**: Check console for blocking errors

**Debug Steps**:

1. Run Lighthouse audit in Chrome DevTools
2. Check Network tab for large files or failed requests
3. Use Performance tab to identify bottlenecks

#### Firebase Connection Issues

**Symptom**: Events/menu not loading or updating
**Causes & Solutions**:

1. **Network connectivity**: Check internet connection
2. **Firebase project issues**: Verify project status in Firebase console
3. **API key problems**: Confirm Firebase config is correct
4. **Security rules**: Ensure read access is enabled

**Debug Steps**:

```javascript
// Test Firebase connection in browser console
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
console.log('Firebase initialized:', !!getFirestore());
```

### Error Logging

#### Client-Side Errors

The site includes error handling for:

- Firebase operation failures
- Image loading failures
- Authentication errors
- Network connectivity issues

#### Monitoring Setup

Consider implementing:

- Error tracking service (Sentry, LogRocket)
- Performance monitoring (Google Analytics)
- Uptime monitoring for the website
- Firebase project monitoring

### Emergency Procedures

#### Site Down/Broken

1. **Immediate**: Restore from most recent backup
2. **Investigation**: Check hosting provider status
3. **Communication**: Update social media about issues
4. **Resolution**: Fix underlying issue and test thoroughly

#### Admin Access Lost

1. **Verify Email**: Ensure admin email hasn't changed
2. **Firebase Console**: Check user authentication in Firebase
3. **Code Update**: Add new admin email to authorized list if needed
4. **Redeploy**: Update and deploy script.js with new admin list

---

## Security Considerations

### Current Security Measures

#### Authentication Security

1. **Google OAuth**: Industry-standard authentication
2. **Email Whitelist**: Restricted admin access
3. **Session Management**: Automatic timeout handling
4. **No Password Storage**: No custom password implementation

#### Data Security

1. **Firebase Rules**: Server-side data protection
2. **HTTPS Only**: Encrypted data transmission
3. **No Sensitive Data**: No payment or personal information stored
4. **Public Read Access**: Appropriate for business information

#### Client-Side Security

1. **Input Validation**: Form data validation
2. **XSS Prevention**: Proper data sanitization
3. **Error Handling**: No sensitive information in error messages
4. **API Key Security**: Public API keys (appropriate for client-side)

### Security Best Practices

#### Firebase Security Configuration

- Keep Firebase API keys public-facing (they're designed for this)
- Implement proper Firestore security rules
- Regularly review user access permissions
- Monitor Firebase project for unusual activity

#### Admin Account Management

- Use strong Google account passwords
- Enable 2FA on admin Google accounts
- Regularly review authorized admin list
- Remove inactive admin accounts promptly

#### Code Security

- Avoid storing sensitive data in client-side code
- Validate all user inputs before processing
- Use HTTPS for all external resources
- Keep dependencies updated

### Recommended Security Enhancements

#### Additional Measures

1. **Content Security Policy**: Implement CSP headers
2. **Subresource Integrity**: Add integrity checks for CDN resources
3. **Access Logging**: Monitor admin panel usage
4. **Regular Security Audits**: Quarterly security reviews

#### Monitoring

1. **Firebase Monitoring**: Set up alerts for unusual database activity
2. **Error Tracking**: Implement error monitoring service
3. **Performance Monitoring**: Track for potential security-related slowdowns
4. **Uptime Monitoring**: Ensure site availability

---

## Appendices

### A. File Reference

#### Deployment Files (Upload Required)

- `index.html` (42KB) - Main website with responsive design
- `script.js` (49KB) - JavaScript with Firebase and gallery logic
- `styles.css` (7KB) - Custom CSS with animations and responsive design
- `802Logo.png` (232KB) - Restaurant logo
- `optimized/` - Optimized images directory with subfolders
- `PHOTOS/` - Original images for fallback

#### Development Tools (Do Not Upload)

- `tools/scripts/optimize_images.sh` - Image optimization script
- `tools/scripts/optimize_images.bat` - Windows batch version
- `tools/docs/` - Documentation directory
- `tools/backups/` - Backup versions of files

### B. Dependencies

#### External Dependencies

- **TailwindCSS**: [CDN](https://cdn.tailwindcss.com)
- **Google Fonts**: Inter font family
- **Firebase**: Authentication and Firestore database
- **Heroicons**: SVG icons (inline in HTML)

#### Tool Dependencies

- **ImageMagick**: Image processing and optimization
- **WebP Tools**: WebP format conversion
- **Bash**: Script execution environment

### C. Configuration Reference

#### Firebase Configuration

Located in `script.js` lines 6-14:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDvGG5PnYpksQRzk8RvZ7Lyc8FaxwM-kG4",
  authDomain: "soulkitchen-9e6b2.firebaseapp.com",
  projectId: "soulkitchen-9e6b2",
  // ... other config
};
```

#### Admin Authorization

Located in `script.js` lines 22-25:

```javascript
const AUTHORIZED_ADMINS = [
  "802soulkitchen@gmail.com",
  "scottkunian@gmail.com"
];
```

#### Brand Colors

Located in `styles.css` and `index.html`:

```css
:root {
    --brand-white: #fdfcfd;
    --brand-red: #da2c2b;
    --brand-orange: #f38c2c;
    --brand-dark: #060b22;
}
```

### D. Support Contact

#### Technical Support

- **Developer**: [scottkunian@gmail.com](mailto:scottkunian@gmail.com)
- **Documentation**: This guide and inline code comments
- **Issues**: Check troubleshooting section first

#### Business Contact

- **Business Owner**: [802soulkitchen@gmail.com](mailto:802soulkitchen@gmail.com)
- **Website**: [802soulkitchen.com](https://www.802soulkitchen.com)
- **Social Media**: Links available on website

---

*This documentation was created for 802 Soul Kitchen website maintenance and development. Last updated September 2025.*
