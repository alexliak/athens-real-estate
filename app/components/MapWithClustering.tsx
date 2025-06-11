'use client';

import React, { useEffect, useState } from 'react';
import { Property } from './PropertyCard';
import { generateAthensProperties } from '../lib/generateAthensProperties';
import '../styles/properties.css';

// Import Leaflet and plugins
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import L from 'leaflet';
import 'leaflet.markercluster';

// Fix Leaflet default icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src || '/leaflet/marker-icon.png',
  iconRetinaUrl: markerIcon2x.src || '/leaflet/marker-icon-2x.png',
  shadowUrl: markerShadow.src || '/leaflet/marker-shadow.png',
});

const MapWithClustering: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000000 });
  const [bedroomFilter, setBedroomFilter] = useState('all');

  useEffect(() => {
    setMounted(true);
    const generatedProperties = generateAthensProperties(500);
    setProperties(generatedProperties);
  }, []);

  // Filter properties
  const filteredProperties = properties.filter(property => {
    if (searchTerm && !property.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !property.address.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedArea !== 'all' && property.area !== selectedArea) {
      return false;
    }
    if (selectedType !== 'all' && property.type !== selectedType) {
      return false;
    }
    if (property.price < priceRange.min || property.price > priceRange.max) {
      return false;
    }
    if (bedroomFilter !== 'all' && property.bedrooms.toString() !== bedroomFilter) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    if (!mounted || map || filteredProperties.length === 0) return;

    // Initialize map
    const mapInstance = L.map('map-container', {
      center: [37.9838, 23.7275],
      zoom: 12,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapInstance);

    // Create marker cluster group
    // @ts-ignore
    const markers = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      iconCreateFunction: function(cluster: any) {
        const count = cluster.getChildCount();
        let size = 'small';
        let className = 'marker-cluster-small';
        
        if (count > 50) {
          size = 'large';
          className = 'marker-cluster-large';
        } else if (count > 20) {
          size = 'medium';
          className = 'marker-cluster-medium';
        }
        
        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: `marker-cluster ${className}`,
          iconSize: L.point(40, 40)
        });
      }
    });

    // Add markers to cluster group
    filteredProperties.forEach((property) => {
      const marker = L.marker([property.coordinates.lat, property.coordinates.lng]);
      
      marker.bindPopup(`
        <div class="map-popup">
          <h4>${property.title}</h4>
          <div class="price">€${property.price.toLocaleString('el-GR')}${property.type === 'rent' ? '/μήνα' : ''}</div>
          <p style="margin: 0 0 8px 0; color: #666">${property.address}</p>
          <p style="margin: 0; font-size: 14px; color: #888">${property.bedrooms} υπν. | ${property.sqm} τ.μ.</p>
        </div>
      `);
      
      marker.on('click', () => {
        setSelectedProperty(property);
        const element = document.getElementById(`property-${property.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      markers.addLayer(marker);
    });

    // Add cluster group to map
    mapInstance.addLayer(markers);
    setMap(mapInstance);

    // Cleanup
    return () => {
      if (mapInstance) {
        mapInstance.remove();
        setMap(null);
      }
    };
  }, [mounted, filteredProperties]);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    if (map) {
      map.setView([property.coordinates.lat, property.coordinates.lng], 16);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedArea('all');
    setSelectedType('all');
    setBedroomFilter('all');
    setPriceRange({ min: 0, max: 2000000 });
  };

  if (!mounted) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f5f5f5'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '40px', 
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          <h2>Loading properties...</h2>
        </div>
      </div>
    );
  }

  const athensAreas = [
    { name: 'Kolonaki', nameGr: 'Κολωνάκι' },
    { name: 'Exarchia', nameGr: 'Εξάρχεια' },
    { name: 'Plaka', nameGr: 'Πλάκα' },
    { name: 'Glyfada', nameGr: 'Γλυφάδα' },
    { name: 'Kifisia', nameGr: 'Κηφισιά' },
    { name: 'Marousi', nameGr: 'Μαρούσι' },
    { name: 'Pagrati', nameGr: 'Παγκράτι' },
    { name: 'Psiri', nameGr: 'Ψυρρή' },
    { name: 'Koukaki', nameGr: 'Κουκάκι' },
    { name: 'Nea Smyrni', nameGr: 'Νέα Σμύρνη' },
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
      {/* Header */}
      <nav className="nav-header">
        <h1>🏠 Real Estate Athens</h1>
        <div className="nav-controls">
          <span style={{ color: '#666' }}>
            Βρέθηκαν {filteredProperties.length} από {properties.length} ακίνητα
          </span>
        </div>
      </nav>

      {/* Filters Bar */}
      <div style={{
        background: 'white',
        padding: '15px 20px',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Αναζήτηση..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            width: '200px'
          }}
        />

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px'
          }}
        >
          <option value="all">Όλες οι περιοχές</option>
          {athensAreas.map(area => (
            <option key={area.name} value={area.name}>{area.nameGr}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px'
          }}
        >
          <option value="all">Όλοι οι τύποι</option>
          <option value="sale">Πώληση</option>
          <option value="rent">Ενοικίαση</option>
        </select>

        <select
          value={bedroomFilter}
          onChange={(e) => setBedroomFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px'
          }}
        >
          <option value="all">Όλα τα υπνοδωμάτια</option>
          <option value="1">1 υπν.</option>
          <option value="2">2 υπν.</option>
          <option value="3">3 υπν.</option>
          <option value="4">4+ υπν.</option>
        </select>

        <button
          onClick={clearFilters}
          style={{
            padding: '8px 16px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Καθαρισμός
        </button>
      </div>

      {/* Split View Container */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        overflow: 'hidden',
        gap: '0'
      }}>
        {/* Left Side - Properties List */}
        <div style={{ 
          width: '50%',
          overflowY: 'auto',
          background: '#f5f5f5',
          padding: '20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {filteredProperties.slice(0, 50).map(property => (
              <div 
                key={property.id} 
                id={`property-${property.id}`}
                className="property-card"
                onClick={() => handlePropertyClick(property)}
                style={{
                  border: selectedProperty?.id === property.id ? '2px solid #e85a1b' : '1px solid #e0e0e0'
                }}
              >
                <div className="property-image">
                  {property.image ? (
                    <img src={property.image} alt={property.title} />
                  ) : (
                    <span>📷 Property Image</span>
                  )}
                </div>
                <div className="property-content">
                  <h3 className="property-title">{property.title}</h3>
                  <div className="property-price">
                    €{property.price.toLocaleString('el-GR')}
                    {property.type === 'rent' && '/μήνα'}
                  </div>
                  <p className="property-address">{property.address}</p>
                  <p className="property-specs">
                    {property.bedrooms} υπν. | {property.bathrooms} μπ. | {property.sqm} τ.μ.
                  </p>
                  <span className={`property-badge badge-${property.type}`}>
                    {property.type === 'sale' ? 'Πώληση' : 'Ενοικίαση'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Map */}
        <div style={{ 
          width: '50%',
          position: 'relative',
          borderLeft: '1px solid #ddd'
        }}>
          <div 
            id="map-container" 
            style={{ 
              height: '100%', 
              width: '100%',
              position: 'relative',
              zIndex: 1
            }} 
          />
        </div>
      </div>

      {/* Custom cluster styles */}
      <style jsx global>{`
        .marker-cluster {
          background-clip: padding-box;
          border-radius: 20px;
        }
        
        .marker-cluster div {
          width: 30px;
          height: 30px;
          margin-left: 5px;
          margin-top: 5px;
          text-align: center;
          border-radius: 15px;
          font: 12px "Helvetica Neue", Arial, Helvetica, sans-serif;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .marker-cluster-small {
          background-color: rgba(181, 226, 140, 0.6);
        }
        
        .marker-cluster-small div {
          background-color: rgba(110, 204, 57, 0.6);
        }
        
        .marker-cluster-medium {
          background-color: rgba(241, 211, 87, 0.6);
        }
        
        .marker-cluster-medium div {
          background-color: rgba(240, 194, 12, 0.6);
        }
        
        .marker-cluster-large {
          background-color: rgba(253, 156, 115, 0.6);
        }
        
        .marker-cluster-large div {
          background-color: rgba(241, 128, 23, 0.6);
        }
      `}</style>
    </div>
  );
};

export default MapWithClustering;