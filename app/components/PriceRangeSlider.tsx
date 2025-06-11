'use client';

import React, { useState, useEffect } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
  type: 'sale' | 'rent' | 'all';
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  step = 10000,
  values,
  onChange,
  type
}) => {
  const [localValues, setLocalValues] = useState<[number, number]>(values);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value);
    if (newMin <= localValues[1]) {
      const newValues: [number, number] = [newMin, localValues[1]];
      setLocalValues(newValues);
      onChange(newValues);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value);
    if (newMax >= localValues[0]) {
      const newValues: [number, number] = [localValues[0], newMax];
      setLocalValues(newValues);
      onChange(newValues);
    }
  };

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div style={{ width: '100%', padding: '10px 0' }}>
      <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
        Εύρος τιμής {type === 'rent' ? '(μήνα)' : ''}
      </div>
      
      <div style={{ position: 'relative', height: '40px' }}>
        {/* Track */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '4px',
            width: '100%',
            backgroundColor: '#ddd',
            borderRadius: '2px',
          }}
        />
        
        {/* Active track */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '4px',
            left: `${getPercentage(localValues[0])}%`,
            width: `${getPercentage(localValues[1]) - getPercentage(localValues[0])}%`,
            backgroundColor: '#e85a1b',
            borderRadius: '2px',
          }}
        />
        
        {/* Min slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValues[0]}
          onChange={handleMinChange}
          style={{
            position: 'absolute',
            width: '100%',
            height: '4px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            pointerEvents: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          className="price-slider"
        />
        
        {/* Max slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValues[1]}
          onChange={handleMaxChange}
          style={{
            position: 'absolute',
            width: '100%',
            height: '4px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            pointerEvents: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          className="price-slider"
        />
      </div>
      
      {/* Price labels */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '10px',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        <span>{formatPrice(localValues[0])}</span>
        <span>{formatPrice(localValues[1])}</span>
      </div>

      <style jsx>{`
        .price-slider {
          pointer-events: auto !important;
        }
        
        .price-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #e85a1b;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .price-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #e85a1b;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .price-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        
        .price-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default PriceRangeSlider;