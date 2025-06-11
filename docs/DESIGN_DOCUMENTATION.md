# 🎨 Real Estate Athens - Design Documentation

## 📐 Design System

### Brand Identity

**Logo**: 🏠 Real Estate Athens  
**Tagline**: "Βρείτε το σπίτι των ονείρων σας στην Αθήνα"  
**Brand Colors**: Warm orange palette inspired by Mediterranean architecture

### Color Palette

```css
/* Primary Colors */
--primary-orange: #e85a1b;      /* Main brand color */
--primary-hover: #d64a0b;       /* Darker orange for hover */

/* Secondary Colors */
--success-green: #28a745;       /* For rent badges */
--info-blue: #17a2b8;          /* Information alerts */
--warning-yellow: #ffc107;      /* Warnings */
--danger-red: #dc3545;         /* Errors */

/* Neutral Colors */
--text-dark: #2c3e50;          /* Main text */
--text-light: #666666;         /* Secondary text */
--text-muted: #888888;         /* Muted text */
--border-color: #e0e0e0;       /* Borders */
--background: #f5f5f5;         /* Page background */
--white: #ffffff;              /* Cards, panels */

/* Shadows */
--shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
--shadow-hover: 0 4px 16px rgba(0, 0, 0, 0.15);
```

### Typography

```css
/* Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;

/* Font Weights */
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Font Sizes */
--text-xs: 12px;     /* Badges, captions */
--text-sm: 14px;     /* Secondary text */
--text-base: 16px;   /* Body text */
--text-lg: 18px;     /* Property titles */
--text-xl: 20px;     /* Section headers */
--text-2xl: 24px;    /* Page titles */
--text-3xl: 32px;    /* Hero text */
```

## 🖼️ UI Components

### Property Card Design

```
┌─────────────────────────────┐
│      [Property Image]       │ ← 220px height
│                            │
├─────────────────────────────┤
│ Διαμέρισμα 75τμ στο        │ ← Title (18px, semibold)
│ Κολωνάκι                   │
│                            │
│ €450,000                   │ ← Price (24px, bold, orange)
│                            │
│ Ακαδημίας 45               │ ← Address (14px, light gray)
│                            │
│ 3 υπν. | 2 μπ. | 75 τ.μ.  │ ← Specs (14px, muted)
│                            │
│ [Πώληση]                   │ ← Badge (12px, white on orange)
└─────────────────────────────┘
```

**States**:
- Default: White background, subtle shadow
- Hover: Translate up 4px, deeper shadow
- Selected: 2px orange border

### Map Popup Design

```
┌─────────────────────────────┐
│ Διαμέρισμα 68τμ στο Ψυρρή  │ ← Title (16px, semibold)
│                            │
│ €308,250                   │ ← Price (18px, bold, orange)
│                            │
│ Πλουτάρχου 42              │ ← Address (14px, gray)
│ 3 υπν. | 137 τ.μ.         │ ← Specs (14px, muted)
│                            │
│ [    Περισσότερα    ]      │ ← Button (orange, full width)
└─────────────────────────────┘
```

### Navigation Header

```
┌──────────────────────────────────────────────────────────┐
│ 🏠 Real Estate Athens          Βρέθηκαν 200 ακίνητα    │
└──────────────────────────────────────────────────────────┘
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
--mobile: 320px;     /* Minimum supported */
--tablet: 768px;     /* iPad portrait */
--desktop: 1024px;   /* Desktop screens */
--wide: 1440px;      /* Wide screens */

/* Grid Adjustments */
@media (max-width: 768px) {
  /* Stack layout vertically */
  /* Single column property grid */
  /* Full-width map below list */
}

@media (min-width: 769px) and (max-width: 1024px) {
  /* 2 column property grid */
  /* Side-by-side layout maintained */
}

@media (min-width: 1025px) {
  /* 3+ column property grid */
  /* Optimal split-screen experience */
}
```

## 🎯 User Interface Patterns

### Interaction Patterns

1. **Property Selection Flow**
   ```
   User clicks property card → 
   Card highlights with border → 
   Map pans and zooms to marker → 
   Popup opens automatically
   ```

2. **Map Marker Interaction**
   ```
   User clicks marker → 
   Popup appears → 
   Corresponding card scrolls into view → 
   Card highlights temporarily
   ```

3. **Search & Filter Flow** (Planned)
   ```
   User types in search → 
   Real-time filtering → 
   Both list and map update → 
   Result count updates
   ```

### Animation & Transitions

```css
/* Smooth transitions for better UX */
transition: all 0.3s ease;        /* Property cards */
transition: transform 0.2s;        /* Hover effects */
transition: border-color 0.3s;     /* Selection states */

/* Map animations */
map.setView(coords, zoom, {
  animate: true,
  duration: 0.5
});

/* Scroll behavior */
scrollIntoView({ 
  behavior: 'smooth', 
  block: 'center' 
});
```

## 🗺️ Map Design Guidelines

### Map Styling
- **Base Map**: OpenStreetMap standard tiles
- **Initial Zoom**: Level 12 (neighborhood view)
- **Max Zoom**: Level 18 (building detail)
- **Min Zoom**: Level 10 (city overview)

### Marker Design
- **Default**: Blue Leaflet markers
- **Clustered**: Circular clusters with count (planned)
- **Selected**: Highlighted with animation

### Custom Map Controls (Planned)
```
┌────────────┐
│ [+]        │  ← Zoom in
│ [-]        │  ← Zoom out
│ [⌖]        │  ← Center on user location
│ [□]        │  ← Fullscreen toggle
└────────────┘
```

## 📊 Data Visualization

### Price Distribution Visualization (Planned)
- Heat map overlay showing price density
- Color gradient: Green (affordable) → Red (expensive)
- Toggle button to show/hide price heat map

### Property Type Icons (Planned)
- 🏢 Apartment
- 🏠 House
- 🏬 Commercial
- 🏭 Industrial

## 🌐 Localization Design

### Greek UI Elements
```
/* Property Specs */
υπν. → υπνοδωμάτια (bedrooms)
μπ.  → μπάνια (bathrooms)
τ.μ. → τετραγωνικά μέτρα (square meters)

/* Property Types */
Πώληση → Sale
Ενοικίαση → Rent

/* Actions */
Περισσότερα → More details
Αναζήτηση → Search
Φίλτρα → Filters
Καθαρισμός → Clear
```

### Number Formatting
```javascript
// Price formatting for Greece
new Intl.NumberFormat('el-GR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(price); // €450.000
```

## 🎭 Accessibility Considerations

### Color Contrast
- Text on white: Minimum 4.5:1 ratio
- Orange buttons: White text for contrast
- Error states: Red with icon support

### Keyboard Navigation
- Tab through property cards
- Enter to select property
- Arrow keys for map navigation
- Escape to close popups

### Screen Reader Support
```html
<div role="article" aria-label="Property listing">
  <h3>Διαμέρισμα 75τμ στο Κολωνάκι</h3>
  <span aria-label="Price">€450,000</span>
  <span aria-label="3 bedrooms, 2 bathrooms, 75 square meters">
    3 υπν. | 2 μπ. | 75 τ.μ.
  </span>
</div>
```

## 🔮 Future Design Enhancements

1. **Dark Mode**
   - Toggle in header
   - Preserve map visibility
   - Adjust property card colors

2. **Advanced Filters UI**
   - Price range slider
   - Multi-select neighborhoods
   - Property type toggles
   - Save filter presets

3. **Property Detail Modal**
   - Image gallery
   - Virtual tour embed
   - Contact form
   - Share functionality

4. **Mobile App Design**
   - Native feel on mobile web
   - Swipe gestures
   - Offline capabilities

---

*Design System Version: 1.0.0*  
*Last Updated: December 2024*
