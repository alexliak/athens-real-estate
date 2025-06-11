# 🏛️ Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Next.js App Router │ React Components │ Leaflet.js Map     │
├─────────────────────────────────────────────────────────────┤
│                         API LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  Next.js API Routes │ REST Endpoints │ Request Validation   │
├─────────────────────────────────────────────────────────────┤
│                        DATA LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  SQLite Database │ JSON Files │ Better-SQLite3 Driver       │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Page Components
```
app/
├── page.tsx              # Home page with map
├── layout.tsx            # Root layout
└── globals.css          # Global styles
```

### 2. UI Components
```
components/
├── Map/
│   ├── DynamicMap.tsx          # Dynamic import wrapper
│   └── SimpleLeafletMap.tsx    # Leaflet implementation
├── UI/
│   ├── PropertyCard.tsx        # Property display card
│   ├── PropertyList.tsx        # Property list container
│   └── PropertySearch.tsx      # Search interface
├── Navbar.tsx                  # Navigation
├── Footer.tsx                  # Footer
├── PropertyDetailModal.tsx     # Property details
└── ClientBootstrap.tsx         # Bootstrap loader
```

### 3. Data Flow
```
User Interaction
    ↓
React Component
    ↓
Service Layer (propertyDataService.ts)
    ↓
Data Source (JSON/SQLite)
    ↓
Response Processing
    ↓
UI Update
```

## Database Architecture

### SQLite Schema
```sql
-- Streets table
CREATE TABLE streets (
    id INTEGER PRIMARY KEY,
    osm_id TEXT UNIQUE,
    name TEXT NOT NULL,
    name_en TEXT,
    municipality TEXT,
    postal_code TEXT,
    geometry TEXT
);

-- Addresses table
CREATE TABLE addresses (
    id INTEGER PRIMARY KEY,
    street_id INTEGER,
    street_name TEXT NOT NULL,
    street_number TEXT,
    municipality TEXT,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    full_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (street_id) REFERENCES streets(id)
);

-- Performance indexes
CREATE INDEX idx_addresses_street ON addresses(street_name);
CREATE INDEX idx_addresses_municipality ON addresses(municipality);
CREATE INDEX idx_addresses_coords ON addresses(lat, lng);
CREATE INDEX idx_streets_name ON streets(name);
```

## API Architecture

### RESTful Endpoints
```
/api/streets/autocomplete
├── Method: GET
├── Query: q (search term)
├── Response: Array of matching streets
└── Cache: 5 minutes

/api/geocode
├── Method: GET
├── Query: address
├── Response: Coordinates
└── Cache: 1 hour

/api/properties
├── Method: GET
├── Query: filters (optional)
├── Response: Filtered properties
└── Cache: None (dynamic)
```

## Frontend Architecture

### State Management
```typescript
interface AppState {
    properties: Property[];
    filteredProperties: Property[];
    selectedProperty: Property | null;
    searchFilters: SearchFilters;
    mapBounds: MapBounds;
    viewMode: 'map' | 'list';
}
```

### Component Hierarchy
```
<HomePage>
    <Navbar />
    <HeroSection>
        <PropertySearch />
    </HeroSection>
    <MainContent>
        <PropertyList>
            <PropertyCard />
        </PropertyList>
        <DynamicMap>
            <SimpleLeafletMap />
        </DynamicMap>
    </MainContent>
    <PropertyDetailModal />
    <Footer />
</HomePage>
```

## Performance Optimizations

### 1. Database
- Spatial indexing for coordinate queries
- Compound indexes for complex queries
- Query result caching

### 2. Frontend
- Dynamic imports for code splitting
- Image lazy loading
- Virtual scrolling for large lists
- Debounced search inputs

### 3. API
- Response compression
- Query parameter validation
- Rate limiting protection

## Security Considerations

### 1. Input Validation
- SQL injection prevention via parameterized queries
- XSS protection through React's built-in escaping
- Input sanitization on API routes

### 2. Data Protection
- No sensitive user data stored
- Read-only database access
- Environment variables for configuration

## Deployment Architecture

### Production Setup
```
Vercel/Netlify
    ↓
Next.js Application
    ↓
Static Assets (CDN)
    ↓
API Routes (Serverless)
    ↓
SQLite Database (Read-only)
```

### Environment Variables
```env
NODE_ENV=production
DATABASE_PATH=./attica_master.db
NEXT_PUBLIC_MAP_API_KEY=your_key_here
```

## Monitoring & Logging

### Key Metrics
- API response times
- Database query performance
- Client-side errors
- Map tile loading times

### Error Handling
```typescript
try {
    // Database operation
} catch (error) {
    logger.error('Database error:', error);
    return errorResponse(500, 'Internal server error');
}
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Read-only database replicas
- CDN for static assets

### Vertical Scaling
- Database query optimization
- Caching strategies
- Connection pooling
