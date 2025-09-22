# 802 Soul Kitchen Website

A modern, responsive website for 802 Soul Kitchen - a pop-up food vendor specializing in soul food at festivals, markets, and special events throughout Vermont.

🌐 **Live Site**: <https://www.802soulkitchen.com>

## Features

### 🎨 Modern Three-Column Layout

- **Left Sidebar**: Fixed logo, contact information, and next upcoming event
- **Middle Content**: Scrollable sections with Who We Are, Menu, Catering, and Events
- **Right Sidebar**: Automated photo gallery with cinematic crossfade transitions

### 🔐 Secure Admin Panel

- **Google Authentication**: No hardcoded passwords, secure email-based authorization
- **Real-time Management**: Add, edit, and delete events and menu items
- **Multi-day Event Support**: Handle events spanning multiple days with different times
- **Structured Time Inputs**: Professional time selection with start/end times

### 📸 Dynamic Photo Gallery

- **Auto-cycling**: Smoothly transitions through photos every 8 seconds
- **Cinematic Crossfade**: Professional-quality transitions with blur and scaling effects
- **Responsive**: Displays 6 photos at a time, automatically detects new images
- **File Support**: JPG, JPEG, PNG, WebP formats

### 🗄️ Firebase Integration

- **Real-time Database**: Firestore for events and menu management
- **Automatic Filtering**: Only shows upcoming/active events
- **Secure Rules**: Read access for all, write access for authorized admins only

### 📱 Responsive Design

- **Mobile-First**: Stacks to single column on smaller screens
- **Brand Colors**: Consistent orange (#f38c2c) and red (#da2c2b) highlights
- **Smooth Animations**: Glassmorphism effects, hover states, and transitions

## Tech Stack

- **Frontend**: HTML5, CSS3 (TailwindCSS), Vanilla JavaScript (ES6+)
- **Backend**: Firebase (Firestore Database, Authentication)
- **Hosting**: Static hosting (compatible with any provider)
- **Icons**: Heroicons SVG icons
- **Fonts**: Inter (Google Fonts)

## Project Structure

```text
802SoulKitchen/
├── index.html              # Main website page
├── styles.css              # Custom CSS and animations
├── script.js               # Main JavaScript functionality
├── 802Logo.png             # Restaurant logo
├── PHOTOS/                 # Photo gallery images (1.jpg, 2.jpg, etc.)
├── quick-menu-setup.html   # Database population utility
├── debug-menu.html         # Development debugging tool
├── menu-populator.html     # Alternative menu setup tool
└── README.md              # This file
```

## Setup Instructions

### 1. Firebase Configuration

The site is pre-configured with Firebase. To modify or set up your own:

1. Create a Firebase project at <https://console.firebase.google.com>
2. Enable Firestore Database and Authentication
3. Update the Firebase config in `script.js` lines 6-14
4. Set up Firestore security rules (see below)

### 2. Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.token.email in [
          "80n2soulkitche@gmail.com",
          "your-admin@email.com"
        ];
    }
  }
}
```

### 3. Admin Access

Add authorized admin email addresses to:

- Firebase Security Rules (above)
- `script.js` AUTHORIZED_ADMINS array (lines 22-25)

### 4. Photo Gallery

Add photos to the `PHOTOS/` directory with naming pattern:

- `1.jpg`, `2.jpg`, `3.jpg`, etc.
- Supports up to 50 photos
- Automatically detected and displayed

## Admin Features

### Event Management

- **Multi-day Events**: Support for events spanning multiple days
- **Structured Times**: Start/end time inputs with automatic formatting
- **Real-time Updates**: Changes appear immediately on the live site
- **Automatic Filtering**: Past events are automatically hidden

### Menu Management

- **Category Organization**: Mains, Combos, Sides, Drinks, Dessert
- **Dynamic Ordering**: Custom sort order within categories
- **Description Support**: Optional descriptions for menu items
- **Live Updates**: Menu changes reflect immediately

### Security

- **Google Authentication**: Secure, professional login system
- **Email Authorization**: Only specific Gmail accounts can access admin features
- **Firebase Security**: Database protected by server-side rules

## Development

### Local Development

1. Clone the repository
2. Serve files through a local server (VS Code Live Server, Python SimpleHTTPServer, etc.)
3. Access via `localhost` for Firebase authentication to work

### Adding Features

- **Events**: Modify `renderEvents()` function in `script.js`
- **Menu**: Update `renderMenu()` function in `script.js`
- **Styling**: Add custom CSS to `styles.css`
- **Photos**: Simply add numbered images to `PHOTOS/` folder

## Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 60+, Safari 12+, Edge 79+
- **Mobile**: iOS Safari 12+, Chrome Mobile 60+
- **Features Used**: ES6 modules, CSS Grid, Flexbox, CSS Variables

## Contributing

This is a custom website for 802 Soul Kitchen. For modifications or improvements:

1. Test changes locally
2. Ensure mobile responsiveness
3. Verify Firebase security rules
4. Test admin functionality

## License

Custom website for 802 Soul Kitchen. All rights reserved.

## Contact

For technical support or questions about this website:

- **Developer**: <scottkunian@gmail.com>
- **Business**: <802soulkitchen@gmail.com>

---

*Built with ❤️ for 802 Soul Kitchen - Bringing soul food to Vermont, one event at a time.*
