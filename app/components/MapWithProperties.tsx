'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Property } from './PropertyCard';
import { generateAthensProperties, athensAreas } from '../lib/generateAthensProperties';
import '../styles/properties.css';

// Dynamic imports for Leaflet (no SSR)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const MapWithProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Generate properties
    const generatedProperties = generateAthensProperties(200);
    setProperties(generatedProperties);
    setLoading(false);
  }, []);

  // Fix Leaflet icon issue
  useEffect(() => {
    if (typeof window !== 'undefined' && !mapReady) {
      const L = require('leaflet');

      // Fix for map container already initialized error
      const container = L.DomUtil.get('map');
      if(container != null){
        container._leaflet_id = null;
      }

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });
      setMapReady(true);
    }
  }, [mapReady]);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    if (mapRef.current) {
      mapRef.current.setView([property.coordinates.lat, property.coordinates.lng], 16);
    }
  };

  if (loading) {
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
    <>
      {/* Import Leaflet CSS via link tag */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

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
            {mapReady && (
              <MapContainer
                ref={mapRef}
                center={[37.9838, 23.7275]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                id="map"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                
                {properties.map((property) => (
                  <Marker
                    key={property.id}
                    position={[property.coordinates.lat, property.coordinates.lng]}
                    eventHandlers={{
                      click: () => {
                        setSelectedProperty(property);
                        // Scroll to property in list
                        const element = document.getElementById(`property-${property.id}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      },
                    }}
                  >
                    <Popup>
                      <div className="map-popup">
                        <h4>{property.title}</h4>
                        <div className="price">
                          €{property.price.toLocaleString('el-GR')}
                          {property.type === 'rent' && '/μήνα'}
                        </div>
                        <p style={{ margin: '0 0 8px 0', color: '#666' }}>{property.address}</p>
                        <p style={{ margin: '0', fontSize: '14px', color: '#888' }}>
                          {property.bedrooms} υπν. | {property.sqm} τ.μ.
                        </p>
                        <div style={{ marginTop: '12px' }}>
                          <button 
                            style={{
                              background: '#e85a1b',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              width: '100%',
                              fontWeight: '500'
                            }}
                            onClick={() => alert(`Property ID: ${property.id}`)}
                          >
                            Περισσότερα
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>

        {/* Custom styles for this component */}
        <style jsx>{`
          .property-card {
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .property-card:hover {
            transform: translateY(-2px);
          }
          
          /* Scrollbar styling */
          div::-webkit-scrollbar {
            width: 8px;
          }
          
          div::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          
          div::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 4px;
          }
          
          div::-webkit-scrollbar-thumb:hover {
            background: #999;
          }
          
          @media (max-width: 1024px) {
            .property-card {
              min-width: 100%;
            }
          }
          
          @media (max-width: 768px) {
            /* Stack vertically on mobile */
            .split-container {
              flex-direction: column !important;
            }
            
            .properties-list, .map-container {
              width: 100% !important;
              height: 50% !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default MapWithProperties;