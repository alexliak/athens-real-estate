'use client';

import dynamic from 'next/dynamic';
import { Property } from '../../lib/propertyDataService';

// Dynamic import του map component χωρίς SSR
const PropertyMapComponent = dynamic(
  () => import('./SimpleLeafletMap'),
  { 
    ssr: false,
    loading: () => (
      <div style={{ height: '600px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Φόρτωση χάρτη...</span>
        </div>
      </div>
    )
  }
);

interface DynamicMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  onBoundsChange?: (bounds: any) => void;
  height?: string;
}

export default function DynamicMap(props: DynamicMapProps) {
  return <PropertyMapComponent {...props} />;
}