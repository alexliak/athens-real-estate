# System Architecture

## Overview
The Real Estate Athens application follows a modern, scalable architecture pattern using Next.js 14 for both frontend and backend, with SQLite as the database and Leaflet for mapping functionality.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client Browser                             │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    React 18 Frontend                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │  │
│  │  │   Bootstrap   │  │   Leaflet    │  │  React Hooks   │   │  │
│  │  │      UI       │  │     Map      │  │  State Mgmt    │   │  │
│  │  └──────────────┘  └──────────────┘  └────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │ HTTP/HTTPS
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Next.js 14 Server                           │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                     API Routes Layer                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │  │
│  │  │  Properties  │  │   Streets    │  │    Geocode     │   │  │
│  │  │     API      │  │     API      │  │      API       │   │  │
│  │  └──────────────┘  └──────────────┘  └────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    Service Layer                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │  │
│  │  │   Property   │  │   Database   │  │    Search      │   │  │
│  │  │   Service    │  │   Service    │  │   Service      │   │  │
│  │  └──────────────┘  └──────────────┘  └────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          Data Layer                                 │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    SQLite Database                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │  │
│  │  │   Streets    │  │  Addresses   │  │  Properties    │   │  │
│  │  │   (71,316)   │  │  (118,489)   │  │   (1,000)     │   │  │
│  │  └──────────────┘  └──────────────┘  └────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components
```
app/
├── components/
│   ├── ui/                     # UI Components
│   │   ├── Navbar.tsx         # Navigation bar
│   │   ├── PropertyCard.tsx   # Property display card
│   │   ├── PropertyList.tsx   # Property list container
│   │   └── PropertySearch.tsx # Search interface
│   │
│   ├── map/                   # Map Components
│   │   ├── DynamicMap.tsx    # Dynamic import wrapper
│   │   ├── SimpleLeafletMap.tsx # Main map component
│   │   └── PropertyMarker.tsx # Custom property markers
│   │
│   └── modals/               # Modal Components
│       └── PropertyDetailModal.tsx # Property details popup
```

### API Architecture
```
app/api/
├── properties/
│   ├── route.ts              # GET /api/properties
│   └── [id]/
│       └── route.ts          # GET /api/properties/:id
│
├── streets/
│   └── autocomplete/
│       └── route.ts          # GET /api/streets/autocomplete
│
└── geocode/
    └── route.ts              # POST /api/geocode
```

### Service Layer
```
app/lib/
├── services/
│   ├── propertyDataService.ts  # Property data operations
│   ├── db.ts                   # Database connection
│   └── searchUtils.ts          # Search algorithms
│
└── utils/
    ├── formatters.ts           # Data formatting
    └── validators.ts           # Input validation
```

## Data Flow

### 1. Property Search Flow
```
User Input (Search Form)
    ↓
PropertySearch Component
    ↓
API Call: GET /api/properties?filters
    ↓
Property Service
    ↓
SQLite Query (with indexes)
    ↓
Results Processing
    ↓
Update State
    ↓
Re-render PropertyList & Map
```

### 2. Map Interaction Flow
```
Map Pan/Zoom Event
    ↓
Calculate Visible Bounds
    ↓
API Call: GET /api/properties?bounds
    ↓
Filter Properties in Bounds
    ↓
Update Map Markers
    ↓
Cluster if > 50 markers
```

### 3. Street Autocomplete Flow
```
User Types in Search
    ↓
Debounce Input (300ms)
    ↓
API Call: GET /api/streets/autocomplete?q=
    ↓
Query Streets Table
    ↓
Return Top 10 Matches
    ↓
Display Dropdown
```

## Database Design

### Schema Overview
```sql
-- Core Tables
streets (71,316 rows)
  ├── id (PK)
  ├── osm_id (Unique)
  ├── name
  ├── name_en
  └── geometry

addresses (118,489 rows)
  ├── id (PK)
  ├── street_id (FK)
  ├── lat, lng (indexed)
  ├── street_number
  └── municipality

properties (1,000 rows)
  ├── id (PK)
  ├── address_id (FK)
  ├── price (indexed)
  ├── type (indexed)
  └── features (JSON)
```

### Index Strategy
```sql
-- Performance indexes
CREATE INDEX idx_addresses_coords ON addresses(lat, lng);
CREATE INDEX idx_addresses_street ON addresses(street_name);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_type ON properties(type);
```

## Security Architecture

### API Security
- Input validation on all endpoints
- SQL injection prevention via parameterized queries
- Rate limiting (100 req/min in production)
- CORS configuration for trusted domains

### Frontend Security
- XSS prevention via React's built-in escaping
- Content Security Policy headers
- Secure image loading from local sources only
- No external API keys exposed

## Performance Optimizations

### Frontend
1. **Code Splitting**
   - Dynamic imports for Leaflet (195KB saved from initial bundle)
   - Route-based code splitting

2. **Image Optimization**
   - Local images only (no external requests)
   - Lazy loading for property images
   - Responsive image sizes

3. **State Management**
   - React hooks for local state
   - Memoization for expensive calculations
   - Debounced search inputs

### Backend
1. **Database**
   - SQLite with WAL mode for concurrent reads
   - Strategic indexes on search fields
   - Connection pooling (max 10 connections)

2. **API**
   - Response caching for autocomplete
   - Pagination (50 items default)
   - Efficient SQL queries with limits

3. **Build Optimizations**
   - Static generation where possible
   - API routes optimized with minimal dependencies
   - Production builds with tree shaking

## Scalability Considerations

### Horizontal Scaling
```
Load Balancer (Nginx)
      ↓
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Node 1  │  │ Node 2  │  │ Node 3  │
└─────────┘  └─────────┘  └─────────┘
      ↓           ↓           ↓
      └───────────┴───────────┘
                  ↓
           Shared SQLite
          (or PostgreSQL)
```

### Caching Strategy
1. **CDN** for static assets
2. **Redis** for API response caching
3. **Browser caching** for images and CSS
4. **Service Worker** for offline support

## Monitoring & Logging

### Application Metrics
- Response times per endpoint
- Error rates and types
- Database query performance
- Memory and CPU usage

### Logging Strategy
```
Request → Morgan Logger → Log File
           ↓
        Log Levels:
        - ERROR: System errors
        - WARN: Performance issues
        - INFO: API requests
        - DEBUG: Development only
```

## Development Workflow

### Local Development
```
Developer Machine
    ↓
git clone → npm install → npm run dev
    ↓
Local SQLite Database
    ↓
Hot Module Replacement
```

### CI/CD Pipeline
```
GitHub Push
    ↓
GitHub Actions
    ├── Lint & Type Check
    ├── Run Tests
    ├── Build Application
    └── Deploy to Vercel/VPS
```

## Technology Decisions

### Why Next.js 14?
- Full-stack framework (frontend + API)
- Excellent performance out of the box
- Built-in optimization features
- Great developer experience
- TypeScript support

### Why SQLite?
- Perfect for read-heavy workloads
- No separate database server needed
- Excellent query performance with indexes
- Portable (single file)
- Sufficient for 1000 properties

### Why Leaflet?
- Open source (no API key required)
- Lightweight (38KB gzipped)
- Mobile friendly
- Extensive plugin ecosystem
- Good React integration

### Why Bootstrap 5?
- Rapid development
- Responsive by default
- Well-documented
- No jQuery dependency
- Customizable via SCSS

## Future Architecture Enhancements

1. **Microservices**
   - Separate geocoding service
   - Independent image service
   - Search service with Elasticsearch

2. **Real-time Features**
   - WebSocket for live updates
   - Push notifications
   - Real-time chat with agents

3. **Advanced Features**
   - AI-powered property recommendations
   - Virtual property tours
   - Blockchain for property transactions

## Conclusion

The architecture is designed to be:
- **Performant**: Fast queries and responsive UI
- **Scalable**: Can grow with demand
- **Maintainable**: Clean code structure
- **Secure**: Following best practices
- **Cost-effective**: Minimal infrastructure needs