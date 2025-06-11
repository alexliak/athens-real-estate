'use client';

import { Property } from '../../lib/propertyDataService';
import { useState } from 'react';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
  selected?: boolean;
}

export default function PropertyCard({ property, onClick, selected }: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Χρήση των υπαρχουσών εικόνων από public/images
  const propertyImages = [
    'img_1.jpg',
    'img_2.jpg', 
    'img_3.jpg',
    'img_4.jpg',
    'img_5.jpg',
    'img_6.jpg',
    'img_7.jpg',
    'img_8.jpg'
  ];
  
  // Επιλογή εικόνας βάσει του property ID με fallback
  const getImageIndex = () => {
    if (!property || !property.id) {
      console.warn('Property or property.id is undefined');
      return 0;
    }
    // Παίρνουμε μόνο τους αριθμούς από το ID
    const numericId = property.id.replace(/\D/g, '') || '0';
    return parseInt(numericId) % propertyImages.length;
  };
  
  const imageIndex = getImageIndex();
  const mainImage = `/images/${propertyImages[imageIndex]}`;

  return (
    <div 
      className={`card property-card h-100 ${selected ? 'border-primary border-2' : ''}`}
      onClick={onClick}
      style={{ 
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ position: 'relative', height: '150px', overflow: 'hidden' }}>
        {!imageError ? (
          <img 
            src={mainImage}
            alt={property.title}
            className="card-img-top"
            style={{ 
              height: '100%',
              width: '100%',
              objectFit: 'cover'
            }}
            onError={() => {
              console.error(`Failed to load image: ${mainImage} for property: ${property.id}`);
              setImageError(true);
            }}
          />
        ) : (
          <div 
            className="d-flex align-items-center justify-content-center h-100"
            style={{ backgroundColor: '#f0f0f0' }}
          >
            <i className="bi bi-house fs-1 text-muted"></i>
          </div>
        )}
        <div className="position-absolute top-0 start-0 m-2">
          <span className={`badge ${property.details.type === 'sale' ? 'bg-success' : 'bg-primary'}`}>
            {property.details.type === 'sale' ? 'Πώληση' : 'Ενοικίαση'}
          </span>
        </div>
      </div>

      <div className="card-body p-2">
        <h6 className="card-title mb-1 text-truncate" style={{ fontSize: '0.9rem' }}>
          {property.title}
        </h6>
        <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>
          <i className="bi bi-geo-alt me-1"></i>
          {property.location.address}
        </p>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="text-primary mb-0" style={{ fontSize: '1rem' }}>
            €{property.price.toLocaleString()}
            {property.details.type === 'rent' && '/μήνα'}
          </h5>
          <small className="text-muted">
            {property.details.sqm}τμ
          </small>
        </div>
        <div className="d-flex gap-2 mt-2">
          <small className="text-muted">
            <i className="bi bi-door-open me-1"></i>
            {property.details.bedrooms}
          </small>
          <small className="text-muted">
            <i className="bi bi-droplet me-1"></i>
            {property.details.bathrooms}
          </small>
        </div>
      </div>
    </div>
  );
}