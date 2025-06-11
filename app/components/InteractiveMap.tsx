'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Property } from './PropertyCard';
import { generateAthensProperties } from '../lib/generateAthensProperties';
import EnhancedPropertyCard from './EnhancedPropertyCard';
import MapFilters, { FilterState } from './MapFilters';
import '../styles/properties.css';

// Import Leaflet CSS only
import 'leaflet/dist/leaflet.css';

const InteractiveMap: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [visibleProperties, setVisibleProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: number]: any }>({});

  useEffect(() => {
    const generatedProperties = generateAthensProperties(1000);
    setProperties(generatedProperties);
    setFilteredProperties(generatedProperties);
    setVisibleProperties(generatedProperties);
  }, []);

  const updateVisibleProperties = useCallback(() => {
    if (!mapInstanceRef.current || !filteredProperties.length) return;

    const bounds = mapInstanceRef.current.getBounds();
    const visible = filteredProperties.filter(property => {
      const lat = property.coordinates.lat;
      const lng = property.coordinates.lng;
      return bounds.contains([lat, lng]);
    });

    setVisibleProperties(visible);
  }, [filteredProperties]);

  useEffect(() => {
    if (typeof window === 'undefined' || isMapReady || properties.length === 0) return;

    const initializeMap = async () => {
      try {
        // Dynamic import Leaflet
        const L = (await import('leaflet')).default;

        // Fix icon paths using CDN
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        // Check if container exists
        const container = document.getElementById('map-container');
        if (!container || container._leaflet_id) {
          console.log('Map already initialized or container not found');
          return;
        }

        // Create map
        const map = L.map('map-container', {
          center: [37.9838, 23.7275],
          zoom: 12,
        });

        // Add CartoDB tile layer (more reliable)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(map);

        // Add markers
        properties.forEach((property) => {
          const marker = L.marker([property.coordinates.lat, property.coordinates.lng])
            .addTo(map)
            .bindPopup(`
              <div class="map-popup" style="min-width: 250px">
                <h4 style="margin: 0 0 10px 0; color: #2c3e50">${property.title}</h4>
                <div class="price" style="font-size: 20px; font-weight: bold; color: #27ae60; margin-bottom: 10px">
                  €${property.price.toLocaleString('el-GR')}${property.type === 'rent' ? '/μήνα' : ''}
                </div>
                <div style="border-top: 1px solid #eee; padding-top: 10px">
                  <p style="margin: 0 0 5px 0; color: #555">
                    <strong>📍 Διεύθυνση:</strong> ${property.address}
                  </p>
                  <p style="margin: 0 0 5px 0; color: #555">
                    <strong>📌 Περιοχή:</strong> ${property.area}
                  </p>
                  <p style="margin: 0 0 5px 0; color: #555">
                    <strong>🛏️ Υπνοδωμάτια:</strong> ${property.bedrooms} | 
                    <strong>📐 Εμβαδόν:</strong> ${property.sqm} τ.μ.
                  </p>
                  <p style="margin: 0 0 5px 0; color: #555">
                    <strong>🏢 Όροφος:</strong> ${property.floor || 'Ισόγειο'} | 
                    <strong>📅 Έτος:</strong> ${property.yearBuilt || 'N/A'}
                  </p>
                </div>
                <div style="margin-top: 10px; text-align: center">
                  <span style="color: #3498db; cursor: pointer; text-decoration: underline">
                    Κλικ για λεπτομέρειες
                  </span>
                </div>
              </div>
            `);
          
          marker.on('click', () => {
            setSelectedProperty(property);
            setTimeout(() => {
              const element = document.getElementById(`property-${property.id}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 100);
          });

          markersRef.current[property.id] = marker;
        });

        // Listen to map events
        map.on('moveend', updateVisibleProperties);
        map.on('zoomend', updateVisibleProperties);

        mapInstanceRef.current = map;
        setIsMapReady(true);

        // Initial update
        setTimeout(updateVisibleProperties, 100);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(initializeMap, 100);
  }, [properties, isMapReady, updateVisibleProperties]);

  const handleFiltersChange = useCallback((filters: FilterState) => {
    let filtered = [...properties];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    // Filter by price
    filtered = filtered.filter(p => 
      p.price >= filters.priceMin && p.price <= filters.priceMax
    );

    // Filter by area size
    filtered = filtered.filter(p => 
      p.sqm >= filters.areaMin && p.sqm <= filters.areaMax
    );

    // Filter by bedrooms
    if (filters.bedrooms !== 'all') {
      if (filters.bedrooms === 0) {
        filtered = filtered.filter(p => p.bedrooms === 0);
      } else if (filters.bedrooms === 4) {
        filtered = filtered.filter(p => p.bedrooms >= 4);
      } else {
        filtered = filtered.filter(p => p.bedrooms === filters.bedrooms);
      }
    }

    // Filter by areas
    if (filters.areas.length > 0) {
      filtered = filtered.filter(p => filters.areas.includes(p.area));
    }

    // Filter by property types
    if (filters.propertyTypes.length > 0) {
      filtered = filtered.filter(p => 
        p.propertyType && filters.propertyTypes.includes(p.propertyType)
      );
    }

    setFilteredProperties(filtered);
    
    // Update map markers
    updateMapMarkers(filtered);
  }, [properties]);

  const updateMapMarkers = (propertiesToShow: Property[]) => {
    if (!mapInstanceRef.current) return;

    // Hide all markers first
    Object.values(markersRef.current).forEach(marker => {
      marker.setOpacity(0.3);
    });

    // Show filtered markers
    propertiesToShow.forEach(property => {
      if (markersRef.current[property.id]) {
        markersRef.current[property.id].setOpacity(1);
      }
    });
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    
    if (mapInstanceRef.current && markersRef.current[property.id]) {
      mapInstanceRef.current.setView([property.coordinates.lat, property.coordinates.lng], 16, {
        animate: true,
        duration: 0.5
      });
      
      markersRef.current[property.id].openPopup();
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 70px)', display: 'flex', background: '#f5f5f5' }}>
      {/* Remove the header since Layout provides it */}

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
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Property count header */}
          <div style={{
            background: 'white',
            padding: '15px 20px',
            borderBottom: '1px solid #e0e0e0',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ 
                color: '#2c3e50',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                Διαθέσιμα Ακίνητα ({visibleProperties.length})
              </span>
              <span style={{ 
                fontSize: '14px', 
                color: '#666'
              }}>
                από {properties.length} συνολικά
              </span>
            </div>
          </div>

          {/* Properties Grid */}
          <div style={{ padding: '20px' }}>
            {visibleProperties.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'white',
                borderRadius: '12px',
                margin: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🗺️</div>
                <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>
                  Δεν βρέθηκαν ακίνητα σε αυτή την περιοχή
                </h3>
                <p style={{ color: '#666' }}>
                  Μετακινήστε τον χάρτη για να δείτε ακίνητα σε άλλες περιοχές
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
              }}>
              {visibleProperties.map(property => (
                <EnhancedPropertyCard
                  key={property.id}
                  property={property}
                  selected={selectedProperty?.id === property.id}
                  onViewDetails={handlePropertyClick}
                />
              ))}
              </div>
            )}
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
          
          {/* Map Filters */}
          <MapFilters
            onFiltersChange={handleFiltersChange}
            propertyCount={filteredProperties.length}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
          />
          
          {!isMapReady && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>🗺️</div>
              <div>Loading map...</div>
            </div>
          )}
          
          {/* Map hint */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '10px 15px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontSize: '14px',
            color: '#666',
            zIndex: 1000
          }}>
            💡 Μετακινήστε τον χάρτη για να δείτε ακίνητα σε διαφορετικές περιοχές
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;