// app/lib/geocodingService.ts
// Service to use manual coordinates (no database needed for client-side)

import { manualStreetCoordinates, getManualCoordinates } from './manualCoordinates';

// Export function for use in property generation
export function getGeocodedCoordinates(
    street: string,
    number: number,
    area: string,
    fallbackCoords?: { lat: number; lng: number }
): { lat: number; lng: number } {
    // Use manual coordinates
    const manualCoords = getManualCoordinates(street, area, number);
    if (manualCoords) {
        return manualCoords;
    }
    
    // Return fallback coordinates
    return fallbackCoords || { lat: 37.9838, lng: 23.7275 };
}
