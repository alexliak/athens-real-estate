# 🏠 Athens Real Estate Map Application

A modern real estate web application for Athens, Greece, featuring an interactive map with 1000 properties using real geocoded addresses from OpenStreetMap.

![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?style=flat-square&logo=bootstrap)
![SQLite](https://img.shields.io/badge/SQLite-3.0-blue?style=flat-square&logo=sqlite)

## 📋 Project Information

- **Course**: CLD6001 - Undergraduate Research Project
- **Institution**: New York College Greece / University of Bolton
- **Student**: 2121384
- **Academic Year**: 2024/2025

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/athens-real-estate.git
cd athens-real-estate
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

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Bootstrap 5** - CSS framework
- **Leaflet.js** - Interactive maps

### Backend
- **SQLite** - Database (37MB with 118,489 addresses)
- **Better-sqlite3** - Node.js SQLite driver
- **Next.js API Routes** - Backend endpoints

### Data Processing
- **OpenStreetMap** - Street data source
- **Nominatim** - Geocoding service
- **Node.js Scripts** - Data pipeline

## 📊 Key Features

- 🗺️ **Interactive Map** - Real-time property visualization
- 🏘️ **1000 Properties** - With real Athens addresses
- 🔍 **Advanced Search** - Filter by area, price, type
- 📍 **Street Autocomplete** - Real street names
- 📱 **Responsive Design** - Mobile & desktop
- ⚡ **High Performance** - Optimized queries

## 🗄️ Database Schema

The application uses `attica_master.db` (37.27 MB) containing:

- **23,258** unique streets
- **118,489** geocoded addresses
- **22** municipalities in Attica

Key tables:
- `streets` - Street information with geometry
- `addresses` - Geocoded addresses with coordinates
- Spatial indexes for performance

## 📁 Project Structure

```
athens-real-estate/
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── api/               # API routes
│   ├── lib/               # Utilities
│   ├── data/              # JSON data
│   └── styles/            # CSS files
├── public/                # Static assets
│   ├── images/            # Property images
│   └── leaflet/           # Map icons
├── scripts/               # Data processing scripts
├── docs/                  # Documentation
└── attica_master.db       # SQLite database
```

## 🔧 API Endpoints

- `GET /api/streets/autocomplete?q={query}` - Street name autocomplete
- `GET /api/geocode?address={address}` - Geocode an address
- `GET /api/properties` - Get properties (with filters)

## 📈 Performance

- Query response: <50ms average
- Page load: <2s
- Lighthouse score: 95+
- Database queries optimized with indexes

## 🚦 Development

### Run tests:
```bash
npm test
```

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

## 📄 License

This project is part of an undergraduate research project at New York College Greece.

## 👤 Author

**Alexa**
- BSc Computing with Foundation (Data Analyst, Application Development)
- New York College Greece / University of Bolton

## 🙏 Acknowledgments

- OpenStreetMap contributors for street data
- Nominatim for geocoding services
- Next.js team for the amazing framework
