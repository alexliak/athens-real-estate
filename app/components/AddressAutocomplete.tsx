'use client';

import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';

interface AddressAutocompleteProps {
  onAddressSelect: (address: {
    street: string;
    number: number;
    municipality: string;
    coordinates: { lat: number; lng: number };
  }) => void;
}

export default function AddressAutocomplete({ onAddressSelect }: AddressAutocompleteProps) {
  const [streetQuery, setStreetQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStreet, setSelectedStreet] = useState<any>(null);
  const [streetNumber, setStreetNumber] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search function
  const searchStreets = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/streets/autocomplete?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error searching streets:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    searchStreets(streetQuery);
  }, [streetQuery, searchStreets]);

  const handleStreetSelect = (street: any) => {
    setSelectedStreet(street);
    setStreetQuery(street.street_name);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStreet || !streetNumber) {
      alert('Παρακαλώ συμπληρώστε όλα τα πεδία');
      return;
    }

    try {
      // Get geocoded coordinates
      const response = await fetch(
        `/api/geocode?street=${encodeURIComponent(selectedStreet.street_name)}&number=${streetNumber}&municipality=${encodeURIComponent(selectedStreet.municipality)}`
      );
      
      const data = await response.json();
      
      if (data.lat && data.lng) {
        onAddressSelect({
          street: selectedStreet.street_name,
          number: parseInt(streetNumber),
          municipality: selectedStreet.municipality,
          coordinates: { lat: data.lat, lng: data.lng }
        });
      } else {
        alert('Δεν βρέθηκαν συντεταγμένες για αυτή τη διεύθυνση');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      alert('Σφάλμα κατά την αναζήτηση συντεταγμένων');
    }
  };

  return (
    <div className="address-autocomplete">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Οδός</label>
          <div className="position-relative">
            <input
              type="text"
              className="form-control"
              value={streetQuery}
              onChange={(e) => setStreetQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Πληκτρολογήστε όνομα οδού..."
              autoComplete="off"
            />
            
            {isLoading && (
              <div className="position-absolute end-0 top-50 translate-middle-y me-2">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="dropdown-menu show w-100 mt-1" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="dropdown-item"
                    onClick={() => handleStreetSelect(suggestion)}
                  >
                    <div>
                      <strong>{suggestion.street_name}</strong>
                      <small className="text-muted d-block">{suggestion.municipality}</small>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Αριθμός</label>
          <input
            type="number"
            className="form-control"
            value={streetNumber}
            onChange={(e) => setStreetNumber(e.target.value)}
            placeholder="π.χ. 25"
            min="1"
            max="999"
          />
        </div>

        {selectedStreet && (
          <div className="mb-3">
            <small className="text-muted">
              Περιοχή: <strong>{selectedStreet.municipality}</strong>
            </small>
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100">
          <i className="bi bi-geo-alt-fill me-2"></i>
          Εύρεση Τοποθεσίας
        </button>
      </form>
    </div>
  );
}
