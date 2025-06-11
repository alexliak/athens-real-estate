'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Property } from '../components/PropertyCard';
import PropertyCardWithFavorites from '../components/PropertyCardWithFavorites';
import { generateAthensProperties } from '../lib/generateAthensProperties';
import { favoritesManager } from '../lib/favoritesManager';
import '../styles/properties.css';

export default function FavoritesPage() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate all properties
    const properties = generateAthensProperties(500);
    setAllProperties(properties);
    
    // Filter favorites
    updateFavorites(properties);
    setLoading(false);

    // Listen for favorites changes
    const handleFavoritesChange = () => {
      updateFavorites(properties);
    };

    window.addEventListener('favoritesChanged', handleFavoritesChange);
    return () => window.removeEventListener('favoritesChanged', handleFavoritesChange);
  }, []);

  const updateFavorites = (properties: Property[]) => {
    const favoriteIds = favoritesManager.getFavorites();
    const favorites = properties.filter(p => favoriteIds.includes(p.id));
    setFavoriteProperties(favorites);
  };

  const clearAllFavorites = () => {
    if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε όλα τα αγαπημένα;')) {
      favoritesManager.clearFavorites();
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
          <h2>Loading favorites...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <nav className="nav-header">
        <h1>❤️ Τα Αγαπημένα μου</h1>
        <div className="nav-controls" style={{ gap: '20px' }}>
          <span style={{ color: '#666' }}>
            {favoriteProperties.length} {favoriteProperties.length === 1 ? 'ακίνητο' : 'ακίνητα'}
          </span>
          
          <Link 
            href="/map"
            style={{
              padding: '10px 20px',
              background: '#6c757d',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#5a6268';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#6c757d';
            }}
          >
            ← Πίσω στον χάρτη
          </Link>
          
          {favoriteProperties.length > 0 && (
            <button
              onClick={clearAllFavorites}
              style={{
                padding: '10px 20px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#c82333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#dc3545';
              }}
            >
              Διαγραφή όλων
            </button>
          )}
        </div>
      </nav>

      {/* Content */}
      <div style={{ padding: '40px 20px' }}>
        {favoriteProperties.length === 0 ? (
          <div style={{
            maxWidth: '600px',
            margin: '100px auto',
            textAlign: 'center',
            background: 'white',
            padding: '60px',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🤍</div>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>
              Δεν έχετε αγαπημένα ακίνητα
            </h2>
            <p style={{ color: '#666', marginBottom: '30px', fontSize: '18px' }}>
              Πατήστε το εικονίδιο της καρδιάς σε οποιοδήποτε ακίνητο για να το προσθέσετε στα αγαπημένα σας.
            </p>
            <Link
              href="/map"
              style={{
                display: 'inline-block',
                padding: '12px 30px',
                background: '#e85a1b',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d64a0b';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#e85a1b';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Εξερευνήστε ακίνητα
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            {favoriteProperties.map(property => (
              <PropertyCardWithFavorites
                key={property.id}
                property={property}
                onViewDetails={(property) => {
                  // In a real app, this would navigate to property details
                  console.log('View details for:', property);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}