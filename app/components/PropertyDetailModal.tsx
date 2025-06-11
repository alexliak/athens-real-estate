'use client';

import { Property } from '../lib/propertyDataService';
import { useState } from 'react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
}

export default function PropertyDetailModal({ property, onClose }: PropertyDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!property) return null;

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    if (type === 'sale') {
      return `€${price.toLocaleString('el-GR')}`;
    }
    return `€${price.toLocaleString('el-GR')}/μήνα`;
  };

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

  // Δημιουργία gallery με διαφορετικές εικόνες για κάθε property
  const getPropertyImages = () => {
    const images = [];
    // Έλεγχος για valid property ID
    const numericId = property.id ? property.id.replace(/\D/g, '') || '0' : '0';
    const baseIndex = parseInt(numericId) % propertyImages.length;
    
    // Χρήση 6 εικόνων για το gallery, ξεκινώντας από διαφορετικό σημείο για κάθε property
    for (let i = 0; i < 6; i++) {
      const idx = (baseIndex + i) % propertyImages.length;
      images.push(`/images/${propertyImages[idx]}`);
    }
    return images;
  };

  const images = getPropertyImages();

  return (
    <div 
      className="modal show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">{property.title}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <div className="row">
              {/* Images Column */}
              <div className="col-lg-7">
                <div className="position-relative mb-3">
                  <img 
                    src={images[currentImageIndex]}
                    alt={property.title}
                    className="img-fluid rounded"
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                  />
                  
                  {/* Image navigation */}
                  {images.length > 1 && (
                    <>
                      <button 
                        className="btn btn-dark position-absolute top-50 start-0 translate-middle-y ms-2"
                        onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                      <button 
                        className="btn btn-dark position-absolute top-50 end-0 translate-middle-y me-2"
                        onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                <div className="row g-2">
                  {images.map((img, index) => (
                    <div key={index} className="col-2">
                      <img 
                        src={img}
                        alt={`${property.title} ${index + 1}`}
                        className={`img-fluid rounded cursor-pointer ${currentImageIndex === index ? 'border border-primary border-3' : ''}`}
                        style={{ height: '60px', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Details Column */}
              <div className="col-lg-5">
                <div className="mb-3">
                  <span className={`badge ${property.details.type === 'sale' ? 'bg-success' : 'bg-primary'} me-2`}>
                    {property.details.type === 'sale' ? 'Πώληση' : 'Ενοικίαση'}
                  </span>
                  <span className="badge bg-secondary">
                    {property.details.propertyType}
                  </span>
                </div>

                <h3 className="text-primary mb-3">
                  {formatPrice(property.price, property.details.type)}
                </h3>

                <p className="text-muted mb-3">
                  <i className="bi bi-geo-alt me-2"></i>
                  {property.location.address}, {property.location.area}
                </p>

                {/* Main Details */}
                <div className="row mb-4">
                  <div className="col-4 text-center">
                    <i className="bi bi-arrows-angle-expand fs-4 text-primary"></i>
                    <p className="mb-0 fw-bold">{property.details.sqm}τμ</p>
                    <small className="text-muted">Εμβαδόν</small>
                  </div>
                  <div className="col-4 text-center">
                    <i className="bi bi-door-open fs-4 text-primary"></i>
                    <p className="mb-0 fw-bold">{property.details.bedrooms}</p>
                    <small className="text-muted">Υπνοδωμάτια</small>
                  </div>
                  <div className="col-4 text-center">
                    <i className="bi bi-droplet fs-4 text-primary"></i>
                    <p className="mb-0 fw-bold">{property.details.bathrooms}</p>
                    <small className="text-muted">Μπάνια</small>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Χαρακτηριστικά</h6>
                  <div className="row g-2">
                    <div className="col-6">
                      <small className="text-muted">Όροφος:</small>
                      <p className="mb-2 fw-bold">{property.details.floor}</p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Έτος κατασκευής:</small>
                      <p className="mb-2 fw-bold">{property.details.yearBuilt}</p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Κατάσταση:</small>
                      <p className="mb-2 fw-bold">{property.details.condition}</p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Τιμή/τμ:</small>
                      <p className="mb-2 fw-bold">€{Math.round(property.price / property.details.sqm)}</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                {property.features.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Παροχές</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {property.features.map((feature, index) => (
                        <span key={index} className="badge bg-light text-dark">
                          <i className="bi bi-check-circle me-1"></i>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Περιγραφή</h6>
                  <p className="text-muted">{property.description}</p>
                </div>

                {/* Agent Info */}
                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Στοιχεία Επικοινωνίας</h6>
                    <p className="mb-2">
                      <i className="bi bi-person me-2"></i>
                      {property.agent.name}
                    </p>
                    <p className="mb-2">
                      <i className="bi bi-telephone me-2"></i>
                      {property.agent.phone}
                    </p>
                    <p className="mb-0">
                      <i className="bi bi-envelope me-2"></i>
                      {property.agent.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Κλείσιμο
            </button>
            <button type="button" className="btn btn-primary">
              <i className="bi bi-telephone me-2"></i>
              Επικοινωνήστε μαζί μας
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}