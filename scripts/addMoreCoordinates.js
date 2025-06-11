// Add more manual coordinates to the database
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Real coordinates from previous geocoding
const knownCoordinates = {
  'Kolonaki': {
    'Σκουφά': [
      { number: 10, lat: 37.9778654, lng: 23.7403479 },
      { number: 50, lat: 37.9809353, lng: 23.737804 },
      { number: 100, lat: 37.9810715, lng: 23.7375077 }
    ],
    'Τσακάλωφ': [
      { number: 10, lat: 37.9792549, lng: 23.7396485 },
      { number: 50, lat: 37.9792549, lng: 23.7396485 },
      { number: 100, lat: 37.9792549, lng: 23.7396485 }
    ],
    'Πατριάρχου Ιωακείμ': [
      { number: 10, lat: 37.9774614, lng: 23.7416333 },
      { number: 50, lat: 37.9782198, lng: 23.7453195 },
      { number: 100, lat: 37.9774614, lng: 23.7416333 }
    ]
  },
  'Peristeri': {
    'Εθνάρχου Μακαρίου': [
      { number: 10, lat: 38.001633, lng: 23.7053064 },
      { number: 50, lat: 38.001633, lng: 23.7053064 },
      { number: 100, lat: 38.001633, lng: 23.7053064 }
    ]
  }
};

// Function to interpolate coordinates
function interpolateCoordinates(coords, targetNumber) {
  // Sort by number
  coords.sort((a, b) => a.number - b.number);
  
  // Find the two closest points
  let before = null;
  let after = null;
  
  for (let i = 0; i < coords.length; i++) {
    if (coords[i].number <= targetNumber) {
      before = coords[i];
    }
    if (coords[i].number >= targetNumber && !after) {
      after = coords[i];
    }
  }
  
  if (before && after && before.number !== after.number) {
    // Interpolate
    const ratio = (targetNumber - before.number) / (after.number - before.number);
    return {
      lat: before.lat + (after.lat - before.lat) * ratio,
      lng: before.lng + (after.lng - before.lng) * ratio
    };
  } else if (before) {
    // Use closest known point
    return { lat: before.lat, lng: before.lng };
  } else if (after) {
    return { lat: after.lat, lng: after.lng };
  }
  
  return null;
}

async function main() {
  const dbPath = path.join(__dirname, '..', 'property_coordinates.db');
  const db = new sqlite3.Database(dbPath);
  
  console.log('Adding interpolated coordinates...\n');
  
  let added = 0;
  
  // Numbers to generate
  const numbersToAdd = [1, 5, 15, 20, 25, 30, 35, 40, 45, 55, 60, 65, 70, 75, 80, 85, 90, 95, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150];
  
  for (const [area, streets] of Object.entries(knownCoordinates)) {
    console.log(`Processing ${area}...`);
    
    for (const [street, coords] of Object.entries(streets)) {
      console.log(`  Street: ${street}`);
      
      for (const number of numbersToAdd) {
        const interpolated = interpolateCoordinates(coords, number);
        
        if (interpolated) {
          const address = `${street} ${number}, ${area === 'Kolonaki' ? 'Κολωνάκι' : 'Περιστέρι'}, Αθήνα, Ελλάδα`;
          
          db.run(
            `INSERT OR IGNORE INTO property_coordinates 
             (street, number, area, area_gr, full_address, lat, lng) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [street, number, area, area === 'Kolonaki' ? 'Κολωνάκι' : 'Περιστέρι', address, interpolated.lat, interpolated.lng],
            (err) => {
              if (!err) {
                added++;
              }
            }
          );
        }
      }
    }
  }
  
  // Wait a bit for all inserts to complete
  setTimeout(() => {
    db.close();
    console.log(`\nCompleted! Added ${added} interpolated coordinates.`);
  }, 2000);
}

main();
