'use client';

import React, { useEffect, useState } from 'react';
import { Property } from './PropertyCard';
import { generateAthensProperties } from '../lib/generateAthensProperties';
import '../styles/properties.css';

// Import Leaflet CSS globally
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
import L from 'leaflet';
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

const SimpleMap: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const generatedProperties = generateAthensProperties(200);
    setProperties(generatedProperties);
  }, []);

  useEffect(() => {
    if (!mounted || map) return;

    // Initialize map only once
    const mapInstance = L.map('map-container', {
      center: [37.9838, 23.7275],
      zoom: 12,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapInstance);

    // Add markers
    properties.forEach((property) => {
      const marker = L.marker([property.coordinates.lat, property.coordinates.lng])
        .addTo(mapInstance)
        .bindPopup(`
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
    });

    setMap(mapInstance);

    // Cleanup
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [mounted, properties]);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    if (map) {
      map.setView([property.coordinates.lat, property.coordinates.lng], 16);
    }
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

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
      {/* Header */}
      <nav className="nav-header">
        <h1>🏠 Real Estate Athens</h1>
        <div className="nav-controls">
          <span style={{ color: '#666' }}>Βρέθηκαν {properties.length} ακίνητα</span>
        </div>
      </nav>

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
            {properties.slice(0, 50).map(property => (
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
    </div>
  );
};

export default SimpleMap;