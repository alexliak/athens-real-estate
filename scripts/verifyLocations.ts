// Tool to verify property locations on map
import { generateAthensProperties } from '../lib/generateAthensProperties';

// Generate a few properties to test
const properties = generateAthensProperties(10);

console.log('🏠 Property Locations Test\n');
console.log('Paste these coordinates in Google Maps to verify locations:\n');

properties.forEach((property, index) => {
    console.log(`Property ${index + 1}: ${property.title}`);
    console.log(`📍 Address: ${property.address}, ${property.area}`);
    console.log(`🗺️  Coordinates: ${property.coordinates.lat}, ${property.coordinates.lng}`);
    console.log(`🔗 Google Maps: https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}`);
    console.log('---\n');
});

// Show specific examples from areas with real geocoding
console.log('\n✅ VERIFIED LOCATIONS (from geocoding):\n');

const verifiedAddresses = [
    { street: 'Σκουφά', number: 50, area: 'Kolonaki', lat: 37.9809353, lng: 23.737804 },
    { street: 'Τσακάλωφ', number: 23, area: 'Kolonaki', lat: 37.9792549, lng: 23.7396485 },
    { street: 'Πατριάρχου Ιωακείμ', number: 50, area: 'Kolonaki', lat: 37.9782198, lng: 23.7453195 },
];

verifiedAddresses.forEach(addr => {
    console.log(`✅ ${addr.street} ${addr.number}, ${addr.area}`);
    console.log(`   Real coords: ${addr.lat}, ${addr.lng}`);
    console.log(`   Google Maps: https://www.google.com/maps?q=${addr.lat},${addr.lng}`);
    console.log('');
});
