'use client';

import { useState, useEffect } from 'react';
import DynamicMap from './components/Map/DynamicMap';
import PropertyList from './components/UI/PropertyList';
import PropertyCard from './components/UI/PropertyCard';
import PropertySearch from './components/UI/PropertySearch';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PropertyDetailModal from './components/PropertyDetailModal';
import { propertyService, Property } from './lib/propertyDataService';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [loading, setLoading] = useState(true);

  // Load properties on mount
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const allProperties = propertyService.getAllProperties();
        setProperties(allProperties);
        setFilteredProperties(allProperties.slice(0, 100)); // Show first 100 by default
        setLoading(false);
      } catch (error) {
        console.error('Error loading properties:', error);
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  const handleSearch = (filters: any) => {
    const results = propertyService.searchProperties(filters);
    setFilteredProperties(results);
  };

  const handleMapBoundsChange = (bounds: any) => {
    const propertiesInView = propertyService.getPropertiesInBounds(bounds);
    setFilteredProperties(propertiesInView);
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyDetail(true);
  };

  return (
    <>
      {/* Navbar */}
      <Navbar currentPage="map" />

      {/* Hero Section με Search */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 0',
        color: 'white'
      }}>
        <div className="container">
          <div className="text-center mb-4">
            <h1 className="display-5 fw-bold mb-3">
              Βρείτε το Ιδανικό Ακίνητο στην Αθήνα
            </h1>
            <p className="lead">
              {properties.length} ακίνητα διαθέσιμα σε όλη την Αττική
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="bg-white rounded shadow p-3">
            <PropertySearch onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-light py-2">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              {filteredProperties.length} ακίνητα στην περιοχή
            </h5>
            <div className="btn-group" role="group">
              <button 
                type="button"
                className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('map')}
              >
                <i className="bi bi-map me-1"></i>Χάρτης
              </button>
              <button 
                type="button"
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('list')}
              >
                <i className="bi bi-list-ul me-1"></i>Λίστα
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid p-0">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Φόρτωση...</span>
            </div>
          </div>
        ) : viewMode === 'map' ? (
          <div className="row g-0">
            {/* Properties List - Αριστερά */}
            <div className="col-lg-7" style={{ height: 'calc(100vh - 280px)', overflowY: 'auto' }}>
              <div className="p-2">
                <div className="row g-2">
                  {filteredProperties.slice(0, 50).map((property) => (
                    <div key={property.id} id={`property-${property.id}`} className="col-12 col-xxl-6">
                      <PropertyCard
                        property={property}
                        onClick={() => handlePropertySelect(property)}
                        selected={selectedProperty?.id === property.id}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Map - Δεξιά */}
            <div className="col-lg-5">
              <DynamicMap
                properties={filteredProperties}
                selectedProperty={selectedProperty}
                onPropertySelect={handlePropertySelect}
                onBoundsChange={handleMapBoundsChange}
                height="calc(100vh - 280px)"
              />
            </div>
          </div>
        ) : (
          <div className="container py-4">
            <PropertyList 
              properties={filteredProperties} 
              onPropertySelect={handlePropertySelect}
              gridView
            />
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {showPropertyDetail && (
        <PropertyDetailModal 
          property={selectedProperty}
          onClose={() => setShowPropertyDetail(false)}
        />
      )}

      {/* Footer */}
      <Footer />
    </>
  );
}