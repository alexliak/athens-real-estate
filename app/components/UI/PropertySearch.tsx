'use client';

import { useState } from 'react';
import { propertyService } from '../../lib/propertyDataService';

interface PropertySearchProps {
  onSearch: (filters: any) => void;
}

export default function PropertySearch({ onSearch }: PropertySearchProps) {
  const [filters, setFilters] = useState({
    type: '',
    area: '',
    minPrice: '',
    maxPrice: '',
    minSqm: '',
    maxSqm: '',
    bedrooms: '',
    searchText: ''
  });

  const areas = propertyService.getAreas();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchFilters = {
      type: filters.type || undefined,
      area: filters.area || undefined,
      minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
      minSqm: filters.minSqm ? parseInt(filters.minSqm) : undefined,
      maxSqm: filters.maxSqm ? parseInt(filters.maxSqm) : undefined,
      bedrooms: filters.bedrooms ? parseInt(filters.bedrooms) : undefined,
      searchText: filters.searchText || undefined
    };
    
    onSearch(searchFilters);
  };

  const handleReset = () => {
    setFilters({
      type: '',
      area: '',
      minPrice: '',
      maxPrice: '',
      minSqm: '',
      maxSqm: '',
      bedrooms: '',
      searchText: ''
    });
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3 align-items-end">
        {/* Search Text */}
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Αναζήτηση..."
            value={filters.searchText}
            onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
          />
        </div>

        {/* Type */}
        <div className="col-md-2">
          <select 
            className="form-select"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">Όλοι οι τύποι</option>
            <option value="sale">Πώληση</option>
            <option value="rent">Ενοικίαση</option>
          </select>
        </div>

        {/* Area */}
        <div className="col-md-2">
          <select 
            className="form-select"
            value={filters.area}
            onChange={(e) => setFilters({ ...filters, area: e.target.value })}
          >
            <option value="">Όλες οι περιοχές</option>
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="col-md-2">
          <div className="input-group input-group-sm">
            <input
              type="number"
              className="form-control"
              placeholder="Από €"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Έως €"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="col-md-3">
          <button type="submit" className="btn btn-primary me-2">
            <i className="bi bi-search me-1"></i>Αναζήτηση
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
            <i className="bi bi-x-circle me-1"></i>Καθαρισμός
          </button>
        </div>
      </div>

      {/* Advanced Filters (collapsible) */}
      <div className="collapse mt-3" id="advancedFilters">
        <div className="row g-3">
          {/* Size Range */}
          <div className="col-md-3">
            <label className="form-label small">Τετραγωνικά</label>
            <div className="input-group input-group-sm">
              <input
                type="number"
                className="form-control"
                placeholder="Από τ.μ."
                value={filters.minSqm}
                onChange={(e) => setFilters({ ...filters, minSqm: e.target.value })}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Έως τ.μ."
                value={filters.maxSqm}
                onChange={(e) => setFilters({ ...filters, maxSqm: e.target.value })}
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div className="col-md-2">
            <label className="form-label small">Υπνοδωμάτια (min)</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={filters.bedrooms}
              onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Toggle Advanced */}
      <div className="mt-2">
        <a 
          className="small text-decoration-none" 
          data-bs-toggle="collapse" 
          href="#advancedFilters"
        >
          <i className="bi bi-sliders me-1"></i>Προχωρημένη αναζήτηση
        </a>
      </div>
    </form>
  );
}
