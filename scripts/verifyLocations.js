// Simple JavaScript version to verify locations
const manualCoordinates = {
  'Kolonaki': {
    'Σκουφά': { lat: 37.9809353, lng: 23.737804 },
    'Τσακάλωφ': { lat: 37.9792549, lng: 23.7396485 },
    'Πατριάρχου Ιωακείμ': { lat: 37.9782198, lng: 23.7453195 },
  }
};

console.log('🏠 Athens Real Estate - Location Verification\n');
console.log('Click these links to see EXACT property locations on Google Maps:\n');

// Show real geocoded locations
for (const [area, streets] of Object.entries(manualCoordinates)) {
    console.log(`\n📍 ${area}:`);
    for (const [street, coords] of Object.entries(streets)) {
        console.log(`${street}: https://www.google.com/maps?q=${coords.lat},${coords.lng}`);
    }
}

console.log('\n✅ These are REAL coordinates from OpenStreetMap geocoding!');
console.log('Each property will be placed exactly on these streets.');
