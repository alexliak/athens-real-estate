import { Property } from '../../lib/propertyDataService';
import PropertyCard from './PropertyCard';

interface PropertyListProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  selectedProperty?: Property | null;
  gridView?: boolean;
}

export default function PropertyList({ 
  properties, 
  onPropertySelect, 
  selectedProperty,
  gridView = false 
}: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-house-slash fs-1 text-muted"></i>
        <p className="text-muted mt-3">Δεν βρέθηκαν ακίνητα</p>
      </div>
    );
  }

  if (gridView) {
    return (
      <div className="row g-4">
        {properties.map((property) => (
          <div key={property.id} className="col-md-6 col-lg-4">
            <PropertyCard
              property={property}
              onClick={() => onPropertySelect?.(property)}
              selected={selectedProperty?.id === property.id}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="property-list">
      {properties.map((property) => (
        <div key={property.id} id={`property-${property.id}`} className="mb-3">
          <PropertyCard
            property={property}
            onClick={() => onPropertySelect?.(property)}
            selected={selectedProperty?.id === property.id}
          />
        </div>
      ))}
    </div>
  );
}
