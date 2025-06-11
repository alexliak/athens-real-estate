// Script για σύγκριση παλιών και νέων properties
import fs from 'fs';

console.log('📊 Comparing property files...\n');

// Διάβασε τα αρχεία
const files = {
  original: './app/data/properties.json',
  mockData: './app/data/mock-properties.json',
  realAddresses: './app/data/properties-real-addresses.json',
  withRealAddresses: './app/data/properties-with-real-addresses.json'
};

const fileInfo = {};

Object.entries(files).forEach(([name, path]) => {
  try {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    fileInfo[name] = {
      exists: true,
      count: data.length,
      sample: data[0],
      hasRealCoords: data[0]?.location?.lat && data[0]?.location?.lng,
      areas: [...new Set(data.map(p => p.location.area))].slice(0, 5)
    };
  } catch (e) {
    fileInfo[name] = { exists: false };
  }
});

// Εμφάνιση αποτελεσμάτων
console.log('📁 Property Files Status:\n');

Object.entries(fileInfo).forEach(([name, info]) => {
  console.log(`${name}:`);
  if (info.exists) {
    console.log(`  ✅ Exists`);
    console.log(`  📍 Count: ${info.count} properties`);
    console.log(`  🗺️  Real coordinates: ${info.hasRealCoords ? 'YES' : 'NO'}`);
    console.log(`  🏘️  Areas: ${info.areas.join(', ')}`);
    if (info.sample) {
      console.log(`  📌 Sample address: ${info.sample.location.address || 'N/A'}`);
    }
  } else {
    console.log(`  ❌ Does not exist`);
  }
  console.log('');
});

// Προτάσεις
console.log('💡 Recommendations:\n');

if (fileInfo.original.exists && !fileInfo.original.hasRealCoords) {
  console.log('1. Run: node scripts/updateExistingPropertiesWithRealAddresses.js');
  console.log('   This will update your existing properties with real addresses\n');
}

if (!fileInfo.realAddresses.exists) {
  console.log('2. Run: node scripts/generatePropertiesWithRealAddresses.js');
  console.log('   This will create new properties with real addresses\n');
}

if (fileInfo.original.exists && fileInfo.realAddresses.exists) {
  console.log('3. You can merge both files or choose one to use');
  console.log('   Update propertyDataService.ts to import the file you want\n');
}
