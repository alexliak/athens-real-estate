'use client';

import React, { useState } from 'react';
import { athensAreas } from '../lib/generateAthensProperties';

export interface FilterState {
  type: 'all' | 'sale' | 'rent';
  priceMin: number;
  priceMax: number;
  areaMin: number;
  areaMax: number;
  bedrooms: number | 'all';
  areas: string[];
  propertyTypes: string[];
}

interface MapFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  propertyCount: number;
  isOpen: boolean;
  onToggle: () => void;
}

const MapFilters: React.FC<MapFiltersProps> = ({
  onFiltersChange,
  propertyCount,
  isOpen,
  onToggle
}) => {
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    priceMin: 0,
    priceMax: 5000000,
    areaMin: 0,
    areaMax: 500,
    bedrooms: 'all',
    areas: [],
    propertyTypes: []
  });

  const propertyTypes = [
    { value: 'apartment', label: 'Διαμέρισμα' },
    { value: 'maisonette', label: 'Μεζονέτα' },
    { value: 'studio', label: 'Στούντιο' },
    { value: 'penthouse', label: 'Ρετιρέ' },
    { value: 'loft', label: 'Loft' }
  ];

  const priceRanges = {
    sale: [
      { min: 0, max: 100000, label: '< €100K' },
      { min: 100000, max: 200000, label: '€100K - €200K' },
      { min: 200000, max: 500000, label: '€200K - €500K' },
      { min: 500000, max: 1000000, label: '€500K - €1M' },
      { min: 1000000, max: 5000000, label: '> €1M' }
    ],
    rent: [
      { min: 0, max: 500, label: '< €500' },
      { min: 500, max: 1000, label: '€500 - €1K' },
      { min: 1000, max: 2000, label: '€1K - €2K' },
      { min: 2000, max: 3000, label: '€2K - €3K' },
      { min: 3000, max: 10000, label: '> €3K' }
    ]
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleArea = (area: string) => {
    const newAreas = filters.areas.includes(area)
      ? filters.areas.filter(a => a !== area)
      : [...filters.areas, area];
    updateFilter('areas', newAreas);
  };

  const togglePropertyType = (type: string) => {
    const newTypes = filters.propertyTypes.includes(type)
      ? filters.propertyTypes.filter(t => t !== type)
      : [...filters.propertyTypes, type];
    updateFilter('propertyTypes', newTypes);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      type: 'all',
      priceMin: 0,
      priceMax: 5000000,
      areaMin: 0,
      areaMax: 500,
      bedrooms: 'all',
      areas: [],
      propertyTypes: []
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const currentPriceRanges = filters.type === 'rent' ? priceRanges.rent : priceRanges.sale;

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      width: isOpen ? '360px' : 'auto'
    }}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        style={{
          background: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '16px',
          fontWeight: '500',
          width: isOpen ? '100%' : 'auto',
          marginBottom: isOpen ? '10px' : '0'
        }}
      >
        <span>🔍</span>
        Φίλτρα
        <span style={{
          background: '#e85a1b',
          color: 'white',
          borderRadius: '12px',
          padding: '2px 8px',
          fontSize: '12px',
          marginLeft: 'auto'
        }}>
          {propertyCount}
        </span>
      </button>

      {/* Filters Panel */}
      {isOpen && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          padding: '20px',
          maxHeight: 'calc(100vh - 140px)',
          overflowY: 'auto'
        }}>
          {/* Property Type */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              Τύπος Αγγελίας
            </h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['all', 'sale', 'rent'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => updateFilter('type', type)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    background: filters.type === type ? '#e85a1b' : 'white',
                    color: filters.type === type ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  {type === 'all' ? 'Όλα' : type === 'sale' ? 'Πώληση' : 'Ενοικίαση'}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              Εύρος Τιμής
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {currentPriceRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => {
                    updateFilter('priceMin', range.min);
                    updateFilter('priceMax', range.max);
                  }}
                  style={{
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    background: filters.priceMin === range.min && filters.priceMax === range.max ? '#e85a1b' : 'white',
                    color: filters.priceMin === range.min && filters.priceMax === range.max ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '13px',
                    transition: 'all 0.2s'
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              Υπνοδωμάτια
            </h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['all', 0, 1, 2, 3, '4+'] as const).map(beds => (
                <button
                  key={beds}
                  onClick={() => updateFilter('bedrooms', beds === '4+' ? 4 : beds)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    background: filters.bedrooms === (beds === '4+' ? 4 : beds) ? '#e85a1b' : 'white',
                    color: filters.bedrooms === (beds === '4+' ? 4 : beds) ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  {beds === 'all' ? 'Όλα' : beds === 0 ? 'Στ' : beds}
                </button>
              ))}
            </div>
          </div>

          {/* Property Types */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              Τύπος Ακινήτου
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {propertyTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => togglePropertyType(type.value)}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '20px',
                    background: filters.propertyTypes.includes(type.value) ? '#e85a1b' : 'white',
                    color: filters.propertyTypes.includes(type.value) ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '13px',
                    transition: 'all 0.2s'
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Areas */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              Περιοχές
            </h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '8px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {athensAreas.map(area => (
                <label
                  key={area.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    padding: '4px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={filters.areas.includes(area.name)}
                    onChange={() => toggleArea(area.name)}
                    style={{ cursor: 'pointer' }}
                  />
                  {area.nameGr}
                </label>
              ))}
            </div>
          </div>

          {/* Area Size */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              Εμβαδόν (τ.μ.)
            </h4>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="number"
                min="0"
                max="500"
                value={filters.areaMin}
                onChange={(e) => updateFilter('areaMin', parseInt(e.target.value) || 0)}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Από"
              />
              <span style={{ color: '#666' }}>-</span>
              <input
                type="number"
                min="0"
                max="500"
                value={filters.areaMax}
                onChange={(e) => updateFilter('areaMax', parseInt(e.target.value) || 500)}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Έως"
              />
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              background: 'white',
              color: '#666',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
            }}
          >
            🔄 Καθαρισμός Φίλτρων
          </button>
        </div>
      )}
    </div>
  );
};

export default MapFilters;