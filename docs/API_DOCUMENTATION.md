# API Documentation

## Overview
The Real Estate Athens API provides RESTful endpoints for property searches, street autocomplete, and geocoding services. All endpoints return JSON responses and support CORS for cross-origin requests.

## Base URL
```
Development: http://localhost:3000/api
Production: https://real-estate-athens.com/api
```

## Authentication
Currently, the API is public and does not require authentication. Future versions may implement API keys for rate limiting.

## Rate Limiting
- Development: No rate limiting
- Production: 100 requests per minute per IP

## Endpoints

### 1. Get Properties
Retrieve a list of properties with optional filtering.

**Endpoint:** `GET /api/properties`

**Query Parameters:**
| Parameter | Type | Description | Default | Example |
|-----------|------|-------------|---------|---------|
| type | string | Filter by rent or sale | all | `rent` |
| minPrice | number | Minimum price in EUR | 0 | `500` |
| maxPrice | number | Maximum price in EUR | ∞ | `2000` |
| bedrooms | number | Minimum bedrooms | 0 | `2` |
| bathrooms | number | Minimum bathrooms | 0 | `1` |
| minSqm | number | Minimum square meters | 0 | `50` |
| maxSqm | number | Maximum square meters | ∞ | `200` |
| municipality | string | Municipality name | all | `Κηφισιά` |
| search | string | Text search in title/address | - | `sea view` |
| bounds | string | Map bounds (SW_lat,SW_lng,NE_lat,NE_lng) | - | `37.9,23.7,38.0,23.8` |
| limit | number | Results per page | 50 | `20` |
| offset | number | Skip N results | 0 | `20` |
| sort | string | Sort field | `price_asc` | `price_desc` |

**Response:**
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": 1,
        "title": "Διαμέρισμα με θέα θάλασσα στη Γλυφάδα",
        "title_en": "Sea View Apartment in Glyfada",
        "price": 1200,
        "type": "rent",
        "bedrooms": 2,
        "bathrooms": 1,
        "sqm": 85,
        "location": {
          "address": "Λεωφόρος Ποσειδώνος 45, Γλυφάδα",
          "municipality": "Γλυφάδα",
          "lat": 37.8756,
          "lng": 23.7544
        },
        "features": ["Θέα θάλασσα", "Μπαλκόνι", "Parking", "Κλιματισμός"],
        "images": ["/images/properties/img_1.jpg"],
        "yearBuilt": 2010,
        "agent": {
          "name": "Μαρία Παπαδοπούλου",
          "phone": "+30 210 1234567",
          "email": "maria@realestate.gr"
        }
      }
    ],
    "total": 1000,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_BOUNDS",
    "message": "Invalid bounds format. Expected: SW_lat,SW_lng,NE_lat,NE_lng"
  }
}
```

**Example Request:**
```bash
curl "http://localhost:3000/api/properties?type=rent&minPrice=500&maxPrice=1500&bedrooms=2&municipality=Γλυφάδα"
```

### 2. Get Property by ID
Retrieve detailed information about a specific property.

**Endpoint:** `GET /api/properties/:id`

**Parameters:**
- `id` (required): Property ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Διαμέρισμα με θέα θάλασσα στη Γλυφάδα",
    "title_en": "Sea View Apartment in Glyfada",
    "price": 1200,
    "type": "rent",
    "bedrooms": 2,
    "bathrooms": 1,
    "sqm": 85,
    "yearBuilt": 2010,
    "description": "Πολυτελές διαμέρισμα 85τμ με εκπληκτική θέα στη θάλασσα...",
    "location": {
      "address": "Λεωφόρος Ποσειδώνος 45, Γλυφάδα",
      "municipality": "Γλυφάδα",
      "lat": 37.8756,
      "lng": 23.7544,
      "nearbyPlaces": [
        {"name": "Παραλία Γλυφάδας", "distance": 150},
        {"name": "Μετρό Ελληνικό", "distance": 2000}
      ]
    },
    "features": ["Θέα θάλασσα", "Μπαλκόνι", "Parking", "Κλιματισμός", "Αποθήκη"],
    "images": [
      "/images/properties/img_1.jpg",
      "/images/properties/img_2.jpg",
      "/images/properties/img_3.jpg"
    ],
    "agent": {
      "name": "Μαρία Παπαδοπούλου",
      "phone": "+30 210 1234567",
      "email": "maria@realestate.gr"
    },
    "createdAt": "2024-12-15T10:30:00Z",
    "updatedAt": "2024-12-15T10:30:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "PROPERTY_NOT_FOUND",
    "message": "Property with ID 999 not found"
  }
}
```

### 3. Street Autocomplete
Search for street names with autocomplete functionality.

**Endpoint:** `GET /api/streets/autocomplete`

**Query Parameters:**
| Parameter | Type | Description | Default | Example |
|-----------|------|-------------|---------|---------|
| q | string | Search query (min 2 chars) | required | `Βασιλ` |
| limit | number | Max results | 10 | `5` |
| municipality | string | Filter by municipality | all | `Αθήνα` |

**Response:**
```json
{
  "success": true,
  "data": {
    "streets": [
      {
        "id": 123,
        "name": "Βασιλίσσης Σοφίας",
        "name_en": "Vasilissis Sofias",
        "municipality": "Αθήνα",
        "matchedNumbers": ["1", "5", "10", "15", "20"]
      },
      {
        "id": 124,
        "name": "Βασιλέως Κωνσταντίνου",
        "name_en": "Vasileos Konstantinou",
        "municipality": "Αθήνα",
        "matchedNumbers": ["2", "8", "14", "22"]
      }
    ],
    "total": 2
  }
}
```

**Example Request:**
```bash
curl "http://localhost:3000/api/streets/autocomplete?q=Βασιλ&limit=5"
```

### 4. Geocode Address
Convert an address string to coordinates.

**Endpoint:** `POST /api/geocode`

**Request Body:**
```json
{
  "address": "Βασιλίσσης Σοφίας 45, Αθήνα",
  "municipality": "Αθήνα"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "Βασιλίσσης Σοφίας 45, Αθήνα",
    "coordinates": {
      "lat": 37.9756,
      "lng": 23.7456
    },
    "confidence": 0.95,
    "source": "database"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "GEOCODING_FAILED",
    "message": "Unable to geocode the provided address"
  }
}
```

### 5. Get Municipalities
Retrieve list of all municipalities with property counts.

**Endpoint:** `GET /api/municipalities`

**Response:**
```json
{
  "success": true,
  "data": {
    "municipalities": [
      {
        "name": "Αθήνα",
        "name_en": "Athens",
        "propertyCount": 150,
        "center": {
          "lat": 37.9838,
          "lng": 23.7275
        }
      },
      {
        "name": "Γλυφάδα",
        "name_en": "Glyfada",
        "propertyCount": 89,
        "center": {
          "lat": 37.8756,
          "lng": 23.7544
        }
      }
    ],
    "total": 22
  }
}
```

### 6. Property Statistics
Get aggregated statistics about properties.

**Endpoint:** `GET /api/statistics`

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| municipality | string | Filter by municipality | all |
| type | string | Filter by rent/sale | all |

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProperties": 1000,
    "byType": {
      "rent": 600,
      "sale": 400
    },
    "priceRange": {
      "rent": {
        "min": 350,
        "max": 5000,
        "avg": 1250,
        "median": 1100
      },
      "sale": {
        "min": 85000,
        "max": 2500000,
        "avg": 380000,
        "median": 320000
      }
    },
    "byBedrooms": {
      "0": 50,
      "1": 200,
      "2": 400,
      "3": 250,
      "4+": 100
    },
    "averageSqm": 95,
    "municipalities": [
      {
        "name": "Αθήνα",
        "count": 150,
        "avgPrice": 1100
      }
    ]
  }
}
```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional information
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_PARAMETERS | 400 | Missing or invalid query parameters |
| PROPERTY_NOT_FOUND | 404 | Property ID does not exist |
| GEOCODING_FAILED | 422 | Unable to geocode address |
| DATABASE_ERROR | 500 | Internal database error |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |

## Response Headers

All responses include the following headers:

```
Content-Type: application/json
X-Total-Count: 1000  // Total items for paginated endpoints
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 95
X-Rate-Limit-Reset: 1640995200
```

## CORS Configuration

The API supports CORS with the following configuration:

```javascript
{
  origin: ['http://localhost:3000', 'https://real-estate-athens.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}
```

## Database Query Examples

### Finding Properties in Area
```sql
SELECT p.*, a.lat, a.lng, a.full_address
FROM properties p
JOIN addresses a ON p.address_id = a.id
WHERE a.municipality = ?
  AND p.type = ?
  AND p.price BETWEEN ? AND ?
  AND p.bedrooms >= ?
ORDER BY p.price ASC
LIMIT ? OFFSET ?;
```

### Street Autocomplete Query
```sql
SELECT DISTINCT s.id, s.name, s.name_en, s.municipality,
       GROUP_CONCAT(a.street_number) as numbers
FROM streets s
LEFT JOIN addresses a ON s.id = a.street_id
WHERE s.name LIKE ? || '%'
  OR s.name_en LIKE ? || '%'
GROUP BY s.id
LIMIT ?;
```

## Performance Considerations

1. **Pagination**: Always use limit/offset for large result sets
2. **Indexing**: All search fields are indexed in the database
3. **Caching**: Street autocomplete results are cached for 1 hour
4. **Connection Pooling**: Database uses connection pooling (max 10 connections)

## Future Enhancements

1. **GraphQL API**: Alternative to REST for flexible queries
2. **WebSocket Support**: Real-time property updates
3. **Batch Operations**: Get multiple properties by IDs
4. **Saved Searches**: Store and retrieve search preferences
5. **Image Upload**: API for property image management
6. **User Authentication**: OAuth2 for user accounts

## SDK Examples

### JavaScript/TypeScript
```typescript
class RealEstateAPI {
  private baseURL = 'http://localhost:3000/api';
  
  async getProperties(filters: PropertyFilters): Promise<PropertyResponse> {
    const params = new URLSearchParams(filters as any);
    const response = await fetch(`${this.baseURL}/properties?${params}`);
    return response.json();
  }
  
  async getPropertyById(id: number): Promise<Property> {
    const response = await fetch(`${this.baseURL}/properties/${id}`);
    if (!response.ok) throw new Error('Property not found');
    return response.json();
  }
}
```

### Python
```python
import requests

class RealEstateAPI:
    def __init__(self, base_url="http://localhost:3000/api"):
        self.base_url = base_url
    
    def get_properties(self, **filters):
        response = requests.get(f"{self.base_url}/properties", params=filters)
        response.raise_for_status()
        return response.json()
    
    def search_streets(self, query, limit=10):
        params = {"q": query, "limit": limit}
        response = requests.get(f"{self.base_url}/streets/autocomplete", params=params)
        return response.json()
```