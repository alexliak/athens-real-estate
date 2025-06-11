'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Property } from './PropertyCard';
import { generateAthensProperties, athensAreas } from '../lib/generateAthensProperties';
import PropertyCardWithFavorites from './PropertyCardWithFavorites';
import PriceRangeSlider from './PriceRangeSlider';
import ExportProperties from './ExportProperties';
import '../styles/properties.css';

// Import Leaflet
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

const InteractiveMapWithFilters: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [mounted, setMounted] = useState(false);
  const markersRef = useRef<{ [key: number]: L.Marker }>({});
  const mapBoundsRef = useRef<L.LatLngBounds | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [bedroomFilter, setBedroomFilter] = useState('all');

  useEffect(() => {
    setMounted(true);
    const generatedProperties = generateAthensProperties(200);
    setProperties(generatedProperties);
  }, []);

  // Filter properties based on criteria
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
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
      if (property.price < priceRange[0] || property.price > priceRange[1]) {
        return false;
      }
      if (bedroomFilter !== 'all' && property.bedrooms.toString() !== bedroomFilter) {
        return false;
      }
      return true;
    });
  }, [properties, searchTerm, selectedArea, selectedType, priceRange, bedroomFilter]);

  // Get visible properties (filtered + within map bounds)
  const visibleProperties = useMemo(() => {
    if (!map || !mapBoundsRef.current) return filteredProperties;

    const bounds = mapBoundsRef.current;
    return filteredProperties.filter(property => {
      const lat = property.coordinates.lat;
      const lng = property.coordinates.lng;
      return bounds.contains([lat, lng]);
    });
  }, [filteredProperties, map, mapBoundsRef.current]);

  // Update map bounds
  const updateMapBounds = useCallback(() => {
    if (!map) return;
    mapBoundsRef.current = map.getBounds();
  }, [map]);

  // Update markers visibility based on filters
  useEffect(() => {
    if (!map) return;

    // Hide all markers first
    Object.values(markersRef.current).forEach(marker => {
      marker.remove();
    });

    // Show only filtered properties
    filteredProperties.forEach(property => {
      if (markersRef.current[property.id]) {
        markersRef.current[property.id].addTo(map);
      }
    });
  }, [filteredProperties, map]);

  useEffect(() => {
    if (!mounted || map || properties.length === 0) return;

    // Initialize map
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
        setTimeout(() => {
          const element = document.getElementById(`property-${property.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      });

      markersRef.current[property.id] = marker;
      marker.addTo(mapInstance);
    });

    // Listen to map events
    mapInstance.on('moveend', updateMapBounds);
    mapInstance.on('zoomend', updateMapBounds);

    setMap(mapInstance);
    
    // Initial bounds update
    setTimeout(() => {
      mapBoundsRef.current = mapInstance.getBounds();
    }, 100);

    // Cleanup
    return () => {
      if (mapInstance) {
        mapInstance.off('moveend', updateMapBounds);
        mapInstance.off('zoomend', updateMapBounds);
        mapInstance.remove();
      }
    };
  }, [mounted, properties, updateMapBounds]);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    
    if (map && markersRef.current[property.id]) {
      map.setView([property.coordinates.lat, property.coordinates.lng], 16, {
        animate: true,
        duration: 0.5
      });
      
      markersRef.current[property.id].openPopup();
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedArea('all');
    setSelectedType('all');
    setBedroomFilter('all');
    setPriceRange([0, 2000000]);
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
          <span style={{ color: '#666' }}>
            Εμφάνιση {visibleProperties.length} από {filteredProperties.length} φιλτραρισμένα ({properties.length} σύνολο)
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
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
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

          <div style={{ width: '200px' }}>
            <PriceRangeSlider
              min={0}
              max={2000000}
              step={10000}
              values={priceRange}
              onChange={setPriceRange}
              type={selectedType === 'all' ? 'all' : selectedType as 'sale' | 'rent'}
            />
          </div>

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

        <ExportProperties properties={visibleProperties} type="filtered" />
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
          {visibleProperties.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'white',
              borderRadius: '12px',
              margin: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>
                Δεν βρέθηκαν ακίνητα
              </h3>
              <p style={{ color: '#666' }}>
                {filteredProperties.length === 0 
                  ? 'Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης'
                  : 'Μετακινήστε τον χάρτη για να δείτε ακίνητα σε αυτή την περιοχή'}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {visibleProperties.map(property => (
                <PropertyCardWithFavorites
                  key={property.id}
                  property={property}
                  selected={selectedProperty?.id === property.id}
                  onViewDetails={handlePropertyClick}
                />
              ))}
            </div>
          )}
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
            💡 Τα ακίνητα ενημερώνονται καθώς μετακινείτε τον χάρτη
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapWithFilters;