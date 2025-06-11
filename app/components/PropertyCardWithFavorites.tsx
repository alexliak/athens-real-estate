import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Property } from './PropertyCard';
import { favoritesManager } from '../lib/favoritesManager';

interface PropertyCardWithFavoritesProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
  selected?: boolean;
}

const PropertyCardWithFavorites: React.FC<PropertyCardWithFavoritesProps> = ({ 
  property, 
  onViewDetails,
  selected = false 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if property is favorite on mount
    setIsFavorite(favoritesManager.isFavorite(property.id));

    // Listen for favorites changes
    const handleFavoritesChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.propertyId === property.id || customEvent.detail.action === 'clear') {
        setIsFavorite(favoritesManager.isFavorite(property.id));
      }
    };

    window.addEventListener('favoritesChanged', handleFavoritesChange);
    return () => window.removeEventListener('favoritesChanged', handleFavoritesChange);
  }, [property.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getAreaInGreek = (area: string) => {
    const areaMap: { [key: string]: string } = {
      'Kolonaki': 'Κολωνάκι',
      'Exarchia': 'Εξάρχεια',
      'Plaka': 'Πλάκα',
      'Glyfada': 'Γλυφάδα',
      'Kifisia': 'Κηφισιά',
      'Marousi': 'Μαρούσι',
      'Pagrati': 'Παγκράτι',
      'Psiri': 'Ψυρρή',
      'Koukaki': 'Κουκάκι',
      'Nea Smyrni': 'Νέα Σμύρνη',
    };
    return areaMap[area] || area;
  };

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(property);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    favoritesManager.toggleFavorite(property.id);
  };

  return (
    <div 
      id={`property-${property.id}`}
      className="property-card"
      onClick={handleClick}
      style={{
        border: selected ? '2px solid #e85a1b' : '1px solid #e0e0e0',
        position: 'relative'
      }}
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <span style={{ 
          fontSize: '20px',
          color: isFavorite ? '#e85a1b' : '#ccc',
          transition: 'color 0.2s'
        }}>
          {isFavorite ? '❤️' : '🤍'}
        </span>
      </button>

      <div className="property-image">
        {property.image ? (
          <img src={property.image} alt={property.title} />
        ) : (
          <span>📷 Property Image</span>
        )}
        
        {/* Property Type Badge */}
        <div
          className="property-type-badge"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: property.type === 'sale' ? '#e85a1b' : '#28a745',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
          }}
        >
          {property.type === 'sale' ? 'Πώληση' : 'Ενοικίαση'}
        </div>
      </div>

      <div className="property-content">
        <h3 className="property-title">{property.title}</h3>
        <div className="property-price">
          {formatPrice(property.price)}
          {property.type === 'rent' && <span style={{ fontSize: '16px' }}>/μήνα</span>}
        </div>
        
        <p className="property-address">{property.address}</p>
        <span className="city d-block mb-3" style={{ fontSize: '14px', color: '#888' }}>
          {getAreaInGreek(property.area)}, Αθήνα
        </span>

        <div className="property-specs">
          <span style={{ marginRight: '15px' }}>
            <span style={{ marginRight: '5px' }}>🛏️</span>
            {property.bedrooms} υπν.
          </span>
          <span style={{ marginRight: '15px' }}>
            <span style={{ marginRight: '5px' }}>🚿</span>
            {property.bathrooms} μπ.
          </span>
          <span>
            <span style={{ marginRight: '5px' }}>📐</span>
            {property.sqm} τ.μ.
          </span>
        </div>

        <button
          className="btn btn-primary"
          style={{
            background: '#e85a1b',
            border: 'none',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            width: '100%',
            marginTop: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#d64a0b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#e85a1b';
          }}
        >
          Δείτε λεπτομέρειες
        </button>
      </div>
    </div>
  );
};

export default PropertyCardWithFavorites;