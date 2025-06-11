# 📚 Real Estate Athens - Project Documentation

## 🎯 Project Overview

**Project Name**: Real Estate Athens  
**Type**: Web-based Real Estate Map Application  
**Technology Stack**: Next.js 14, TypeScript, Leaflet.js, OpenStreetMap  
**Target Users**: Property seekers and real estate agencies in Athens, Greece  
**Language**: Greek (UI) / English (Code)

## 🏗️ Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Application                   │
├─────────────────────────────────────────────────────────┤
│                   Frontend Components                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  SimpleMap   │  │ PropertyCard │  │   Filters    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│                    Data Generation                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │        generateAthensProperties.ts               │   │
│  │  - 10 Athens neighborhoods with coordinates      │   │
│  │  - 20 Greek street names                         │   │
│  │  - Price calculation based on area multipliers   │   │
│  └──────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                 Geospatial Technologies                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐    │
│  │  Leaflet.js │  │OpenStreetMap│  │  WGS84 Coords│    │
│  └─────────────┘  └─────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Component Structure
```
app/
├── components/
│   ├── SimpleMap.tsx           # Main map component with vanilla Leaflet
│   ├── PropertyCard.tsx        # Property display component
│   ├── MapWithProperties.tsx   # Original react-leaflet version
│   └── MapWithPropertiesEnhanced.tsx # Version with filters
├── lib/
│   └── generateAthensProperties.ts # Mock data generator
├── map/
│   └── page.tsx               # Map page route
└── styles/
    └── properties.css         # Custom styling
```

## 🗺️ Geospatial Implementation

### Technologies Used

1. **Leaflet.js v1.9.4**
   - Open-source JavaScript library for mobile-friendly interactive maps
   - Lightweight (~42 KB of gzipped JS)
   - Extensive plugin ecosystem

2. **OpenStreetMap (OSM)**
   - Free, editable map of the world
   - Tile URL pattern: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
   - No API key required

3. **Geographic Coordinate System**
   - WGS84 (World Geodetic System 1984)
   - Decimal degrees format
   - Athens center: 37.9838°N, 23.7275°E

### Athens Neighborhoods Mapping

| Neighborhood | Greek Name | Latitude | Longitude | Price Multiplier |
|--------------|------------|----------|-----------|------------------|
| Kolonaki | Κολωνάκι | 37.9799 | 23.7444 | 1.5x |
| Exarchia | Εξάρχεια | 37.9861 | 23.7341 | 0.8x |
| Plaka | Πλάκα | 37.9725 | 23.7293 | 1.3x |
| Glyfada | Γλυφάδα | 37.8586 | 23.7529 | 1.4x |
| Kifisia | Κηφισιά | 38.0736 | 23.8103 | 1.6x |
| Marousi | Μαρούσι | 38.0495 | 23.8054 | 1.2x |
| Pagrati | Παγκράτι | 37.9681 | 23.7520 | 1.0x |
| Psiri | Ψυρρή | 37.9779 | 23.7230 | 0.9x |
| Koukaki | Κουκάκι | 37.9625 | 23.7279 | 1.1x |
| Nea Smyrni | Νέα Σμύρνη | 37.9470 | 23.7138 | 1.1x |

### Map Features

- **Initial View**: Center of Athens at zoom level 12
- **Zoom Levels**: 12 (city view) to 16 (building detail)
- **Markers**: Blue default Leaflet markers
- **Popups**: Property information on marker click
- **Interactivity**: Bidirectional sync between list and map

## 📊 Data Model

### Property Interface
```typescript
interface Property {
  id: number;
  title: string;              // e.g., "Διαμέρισμα 68τμ στο Εξάρχεια"
  price: number;              // In euros
  address: string;            // Greek street name + number
  city: string;               // Always "Αθήνα"
  area: string;               // Neighborhood name (English)
  type: 'sale' | 'rent';
  bedrooms: number;           // 1-4
  bathrooms: number;          // 1-2
  sqm: number;                // Square meters (40-150)
  image: string;              // Path to property image
  coordinates: {
    lat: number;              // Latitude
    lng: number;              // Longitude
  };
}
```

### Data Generation Algorithm
```typescript
// Base prices
const basePrice = forSale ? 250000 : 800;

// Price calculation
const price = basePrice * area.priceMultiplier * (sqm / 100);

// Coordinate randomization
const coordinates = {
  lat: area.coords.lat + (Math.random() - 0.5) * 0.01,
  lng: area.coords.lng + (Math.random() - 0.5) * 0.01
};
```

## 🎨 UI/UX Design

### Design System

**Colors**
- Primary: `#e85a1b` (Orange - from Property template)
- Secondary: `#28a745` (Green - for rent badges)
- Text Dark: `#2c3e50`
- Text Light: `#666`
- Background: `#f5f5f5`

**Typography**
- Font Family: Inter, -apple-system, BlinkMacSystemFont
- Headings: 600-700 weight
- Body: 400 weight

**Layout**
- Split Screen: 50% list / 50% map
- Grid: CSS Grid with auto-fill, minmax(280px, 1fr)
- Spacing: 20px padding, 20px gap

### Responsive Design
- **Desktop**: Side-by-side layout
- **Tablet**: Same as desktop
- **Mobile**: Stacked vertically (list on top, map below)

## 🚀 Features Implemented

### Current Features
1. ✅ Interactive map with 200 property markers
2. ✅ Property list with cards
3. ✅ Click synchronization (list ↔ map)
4. ✅ Property popups with details
5. ✅ Responsive design
6. ✅ Greek UI localization
7. ✅ Image display from local assets
8. ✅ Price formatting (€1,234 or €800/μήνα)

### Planned Features
1. ⏳ Marker clustering for performance
2. ⏳ Search and filtering
3. ⏳ Property detail pages
4. ⏳ Favorites system
5. ⏳ Export functionality
6. ⏳ Real API integration

## 🐛 Known Issues & Solutions

### Issue 1: Map Container Already Initialized
**Problem**: React-leaflet re-initialization on hot reload  
**Solution**: Switch to vanilla Leaflet with proper cleanup

### Issue 2: Chrome Extension Conflicts
**Problem**: Extensions interfering with map rendering  
**Solution**: Test in incognito mode or disable extensions

### Issue 3: Missing Leaflet CSS
**Problem**: Map tiles not displaying correctly  
**Solution**: Import Leaflet CSS directly in component

## 📝 Development Notes

### Environment Setup
```bash
# Dependencies
npm install leaflet@1.9.4
npm install --save-dev @types/leaflet

# Image assets
cp extracted/from-property/images/*.jpg public/images/

# Leaflet markers
mkdir -p public/leaflet
# Download marker icons to public/leaflet/
```

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Greek comments acceptable
- Component names in PascalCase
- Functions in camelCase

## 🔗 References

- [Leaflet Documentation](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Athens Coordinates](https://www.latlong.net/place/athens-greece-892.html)

---

*Last Updated: June 2025*  
*Version: 1.0.0*
