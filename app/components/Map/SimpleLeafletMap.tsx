'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Property } from '../../lib/propertyDataService';
import 'leaflet/dist/leaflet.css';

// Fix default markers
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface SimpleLeafletMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  onBoundsChange?: (bounds: any) => void;
  height?: string;
}

export default function SimpleLeafletMap({
  properties,
  selectedProperty,
  onPropertySelect,
  onBoundsChange,
  height = '600px'
}: SimpleLeafletMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const [openPopup, setOpenPopup] = useState<L.Popup | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      // Create map
      map.current = L.map(mapContainer.current).setView([37.9838, 23.7275], 12);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.current);

      // Create markers layer
      markersLayer.current = L.layerGroup().addTo(map.current);

      // Bounds change handler
      if (onBoundsChange) {
        map.current.on('moveend zoomend', () => {
          if (map.current) {
            const bounds = map.current.getBounds();
            onBoundsChange({
              north: bounds.getNorth(),
              south: bounds.getSouth(),
              east: bounds.getEast(),
              west: bounds.getWest()
            });
          }
        });
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (markersLayer.current && map.current) {
      // Clear existing markers
      markersLayer.current.clearLayers();

      // Add new markers
      properties.forEach(property => {
        const color = property.details.type === 'sale' ? '#28a745' : '#007bff';
        const priceText = property.details.type === 'sale' 
          ? `€${(property.price / 1000).toFixed(0)}k` 
          : `€${property.price}`;

        const icon = L.divIcon({
          html: `<div style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 20px; font-weight: bold; font-size: 12px; white-space: nowrap; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${priceText}</div>`,
          iconSize: [70, 30],
          iconAnchor: [35, 15],
          className: 'property-marker'
        });

        const marker = L.marker([property.location.lat, property.location.lng], { icon });
        
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
        
        // Έλεγχος για valid property ID
        const numericId = property.id ? property.id.replace(/\D/g, '') || '0' : '0';
        const imageIndex = parseInt(numericId) % propertyImages.length;
        const imageUrl = `/images/${propertyImages[imageIndex]}`;
        
        // Popup content - μικρότερο μέγεθος
        const popupHtml = `
          <div style="min-width: 240px; max-width: 260px;">
            <img src="${imageUrl}" 
                 style="width: 100%; height: 120px; object-fit: cover; margin-bottom: 8px; border-radius: 6px;"
                 onerror="this.src='https://via.placeholder.com/280x140/e85a1b/ffffff?text=${encodeURIComponent(property.details.propertyType)}'">
            <h6 style="margin-bottom: 6px; font-weight: bold; font-size: 14px; line-height: 1.3;">${property.title}</h6>
            <p style="color: #0d6efd; margin-bottom: 4px; font-weight: bold; font-size: 16px;">
              €${property.price.toLocaleString('el-GR')}${property.details.type === 'rent' ? '/μήνα' : ''}
            </p>
            <p style="font-size: 12px; color: #6c757d; margin-bottom: 4px;">
              <i class="bi bi-geo-alt" style="margin-right: 4px;"></i>
              ${property.location.address}
            </p>
            <p style="font-size: 11px; margin-bottom: 6px;">
              ${property.details.sqm}τμ • ${property.details.bedrooms} υπνοδ. • ${property.details.floor}
            </p>
            <button id="property-detail-${property.id}" 
                    style="background-color: #0d6efd; color: white; border: none; padding: 6px 12px; border-radius: 4px; width: 100%; cursor: pointer; font-size: 13px;">
              <i class="bi bi-eye" style="margin-right: 4px;"></i>Λεπτομέρειες
            </button>
          </div>
        `;

        const popup = L.popup({
          maxWidth: 350,
          minWidth: 280,
          autoClose: false,
          closeOnClick: false
        }).setContent(popupHtml);

        marker.bindPopup(popup);
        
        // Click handler για τον marker
        marker.on('click', (e) => {
          // Κλείσε το προηγούμενο popup αν υπάρχει
          if (openPopup && openPopup !== popup) {
            openPopup.close();
          }
          
          // Άνοιξε το νέο popup
          marker.openPopup();
          setOpenPopup(popup);
          
          // Επίλεξε το property
          if (onPropertySelect) {
            onPropertySelect(property);
          }
          
          // Προσθήκη event listener στο button μετά το άνοιγμα του popup
          setTimeout(() => {
            const button = document.getElementById(`property-detail-${property.id}`);
            if (button) {
              button.onclick = (event) => {
                event.stopPropagation();
                if (onPropertySelect) {
                  onPropertySelect(property);
                }
              };
            }
          }, 100);
        });

        markersLayer.current?.addLayer(marker);
      });
    }
  }, [properties, onPropertySelect]);

  // Pan to selected property without changing zoom
  useEffect(() => {
    if (map.current && selectedProperty) {
      // Απλά κάνε pan, όχι zoom
      map.current.panTo([selectedProperty.location.lat, selectedProperty.location.lng], {
        animate: true,
        duration: 0.5
      });
      
      // Scroll στο property στη λίστα
      const propertyElement = document.getElementById(`property-${selectedProperty.id}`);
      if (propertyElement) {
        propertyElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedProperty]);

  return <div ref={mapContainer} style={{ height, width: '100%' }} />;
}