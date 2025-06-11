# Real Estate Athens 🏠

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)](https://getbootstrap.com/)

A modern real estate web application for Athens, Greece, featuring interactive maps, advanced search functionality, and real geocoded addresses from OpenStreetMap.

## 🌟 Features

- **Interactive Map**: Leaflet-based map with property markers and clustering
- **Advanced Search**: Filter by price, type, bedrooms, area, and more
- **Real Data**: 118,489 geocoded addresses from OpenStreetMap
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Performance Optimized**: <50ms query times, 95+ Lighthouse score
- **Bilingual Support**: Greek and English property listings

## 📊 Project Statistics

- **Dataset**: 118,489 geocoded addresses from OpenStreetMap
- **Coverage**: 22 municipalities in Attica region
- **Properties**: 1,000 listings with real addresses
- **Database Size**: 37.27 MB (SQLite)
- **Performance**: <50ms average query response time
- **Streets Processed**: 71,316 from OSM Overpass API

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/alexliak/athens-real-estate.git
cd real-estate-athens
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Architecture

The application follows a modern, scalable architecture:

```
Frontend (Next.js 14 + React 18)
    ↓
API Routes (Next.js API)
    ↓
Service Layer (TypeScript)
    ↓
Database (SQLite)
```

For detailed architecture documentation, see [docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md)

## 📁 Project Structure

```
real-estate-athens/
├── app/                    # Next.js 14 app directory
│   ├── components/        # React components
│   │   ├── map/          # Map-related components
│   │   ├── ui/           # UI components
│   │   └── modals/       # Modal components
│   ├── api/              # API routes
│   ├── lib/              # Utilities and services
│   └── data/             # Property data
├── public/               # Static assets
│   └── images/          # Property images
├── scripts/             # Data processing scripts
├── docs/                # Documentation
└── attica_master.db     # SQLite database
```

## 🗄️ Database Schema

The application uses SQLite with three main tables:

- **streets**: 71,316 streets from OpenStreetMap
- **addresses**: 118,489 geocoded address points
- **properties**: 1,000 property listings

See [docs/database/ERD.md](docs/database/ERD.md) for complete schema documentation.

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server

# Database
npm run db:stats    # Show database statistics
npm run db:init     # Initialize database

# Testing
npm test           # Run all tests
npm run test:e2e   # Run end-to-end tests

# Code Quality
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## 📡 API Documentation

The application provides RESTful API endpoints:

- `GET /api/properties` - Search and filter properties
- `GET /api/properties/:id` - Get property details
- `GET /api/streets/autocomplete` - Street name autocomplete
- `POST /api/geocode` - Geocode addresses
- `GET /api/municipalities` - List all municipalities

For complete API documentation, see [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/[your-username]/real-estate-athens)

### Traditional Hosting

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## 🧪 Testing

The project includes comprehensive tests:

- **Unit Tests**: Components and utilities
- **Integration Tests**: API endpoints and database
- **E2E Tests**: User workflows with Cypress

Run tests with:
```bash
npm test
```

## 📈 Performance

- **Lighthouse Score**: 95+ (Mobile & Desktop)
- **First Contentful Paint**: 1.2s
- **Time to Interactive**: 2.1s
- **Bundle Size**: 245KB gzipped

See [docs/PERFORMANCE_OPTIMIZATION.md](docs/PERFORMANCE_OPTIMIZATION.md) for optimization details.

## 🛠️ Built With

- [Next.js 14](https://nextjs.org/) - React framework
- [React 18](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Bootstrap 5](https://getbootstrap.com/) - CSS framework
- [Leaflet](https://leafletjs.com/) - Interactive maps
- [SQLite](https://www.sqlite.org/) - Database
- [OpenStreetMap](https://www.openstreetmap.org/) - Map data

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎓 Academic Project

This project was developed as part of the CLD6001 Undergraduate Research Project at New York College Greece / University of Bolton.

**Student**: Alexa  
**Academic Year**: 2024/2025  
**Supervisor**: Georgios Prokopakis

## 🙏 Acknowledgments

- OpenStreetMap contributors for street data
- Nominatim for geocoding services
- Bootstrap team for the UI framework
- Leaflet contributors for the mapping library

## 📞 Contact

For questions or feedback, please contact:
- Email: aliakopoulos@nyc.gr
- GitHub: https://github.com/alexliak/

---

Made with ❤️ in Athens, Greece