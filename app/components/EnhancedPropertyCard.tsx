'use client';

import React, { useState } from 'react';
import { Property } from './PropertyCard';

interface EnhancedPropertyCardProps {
  property: Property;
  selected?: boolean;
  onViewDetails: (property: Property) => void;
}

const EnhancedPropertyCard: React.FC<EnhancedPropertyCardProps> = ({
  property,
  selected = false,
  onViewDetails
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `€${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `€${(price / 1000).toFixed(0)}K`;
    }
    return `€${price}`;
  };

  const getPropertyTypeIcon = (type?: string) => {
    switch (type) {
      case 'studio': return '🏢';
      case 'apartment': return '🏠';
      case 'maisonette': return '🏘️';
      case 'penthouse': return '🌆';
      case 'loft': return '🏭';
      default: return '🏠';
    }
  };

  const getConditionBadge = (yearBuilt?: number) => {
    if (!yearBuilt) return null;
    const age = new Date().getFullYear() - yearBuilt;
    
    if (age <= 2) return { text: 'Νεόδμητο', color: '#27ae60' };
    if (age <= 5) return { text: 'Καινούργιο', color: '#3498db' };
    if (age <= 15) return { text: 'Καλή κατάσταση', color: '#f39c12' };
    return null;
  };

  const condition = getConditionBadge(property.yearBuilt);

  return (
    <div
      className="enhanced-property-card"
      onClick={() => onViewDetails(property)}
      style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: selected ? '0 8px 24px rgba(232, 90, 27, 0.3)' : '0 2px 12px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: selected ? '2px solid #e85a1b' : '1px solid #e0e0e0',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
        }
      }}
    >
      {/* Image Section */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        {!imageError ? (
          <img
            src={property.image}
            alt={property.title}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '64px'
          }}>
            {getPropertyTypeIcon(property.propertyType)}
          </div>
        )}

        {/* Badges */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              background: property.type === 'sale' ? '#e85a1b' : '#27ae60',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              backdropFilter: 'blur(10px)',
              backgroundColor: property.type === 'sale' ? 'rgba(232, 90, 27, 0.9)' : 'rgba(39, 174, 96, 0.9)'
            }}>
              {property.type === 'sale' ? 'Πώληση' : 'Ενοικίαση'}
            </span>
            
            {condition && (
              <span style={{
                background: condition.color,
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                backdropFilter: 'blur(10px)',
                backgroundColor: `${condition.color}dd`
              }}>
                {condition.text}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span style={{ fontSize: '20px' }}>{isFavorite ? '❤️' : '🤍'}</span>
          </button>
        </div>

        {/* Price Tag */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '25px',
          backdropFilter: 'blur(10px)'
        }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {formatPrice(property.price)}
          </span>
          {property.type === 'rent' && (
            <span style={{ fontSize: '14px', opacity: 0.9 }}>/μήνα</span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div style={{ padding: '16px' }}>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '16px',
          fontWeight: '600',
          color: '#2c3e50',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>{getPropertyTypeIcon(property.propertyType)}</span>
          {property.title}
        </h3>

        <p style={{
          margin: '0 0 12px 0',
          fontSize: '14px',
          color: '#666',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>📍</span>
          {property.address}
        </p>

        {/* Specs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '12px'
        }}>
          <div style={{
            background: '#f8f9fa',
            padding: '8px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Υπνοδωμάτια</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
              {property.bedrooms || 'Στούντιο'}
            </div>
          </div>
          <div style={{
            background: '#f8f9fa',
            padding: '8px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Εμβαδόν</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
              {property.sqm} τ.μ.
            </div>
          </div>
          <div style={{
            background: '#f8f9fa',
            padding: '8px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Όροφος</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
              {property.floor !== undefined ? (property.floor === 0 ? 'Ισόγειο' : `${property.floor}ος`) : '-'}
            </div>
          </div>
        </div>

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            marginBottom: '12px'
          }}>
            {property.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                style={{
                  background: '#e3f2fd',
                  color: '#1976d2',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500'
                }}
              >
                {feature}
              </span>
            ))}
            {property.features.length > 3 && (
              <span style={{
                color: '#666',
                fontSize: '11px',
                fontStyle: 'italic'
              }}>
                +{property.features.length - 3} ακόμα
              </span>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div style={{
          display: 'flex',
          gap: '8px',
          paddingTop: '12px',
          borderTop: '1px solid #eee'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(`tel:+302101234567`, '_self');
            }}
            style={{
              flex: 1,
              background: '#f8f9fa',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e85a1b';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = '#e85a1b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8f9fa';
              e.currentTarget.style.color = 'black';
              e.currentTarget.style.borderColor = '#e0e0e0';
            }}
          >
            <span>📞</span>
            Κλήση
          </button>
          
          <button
            style={{
              flex: 1,
              background: '#e85a1b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#d14810'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#e85a1b'}
          >
            <span>👁️</span>
            Λεπτομέρειες
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPropertyCard;