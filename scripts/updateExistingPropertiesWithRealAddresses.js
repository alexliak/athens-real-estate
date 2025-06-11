// Script για ενημέρωση υπαρχόντων ακινήτων με πραγματικές διευθύνσεις
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const db = new Database('./attica_master.db');

console.log('🔄 Updating existing properties with real addresses...\n');

// Διάβασε τα υπάρχοντα properties
const existingPropertiesPath = './app/data/properties.json';
let existingProperties;

try {
  existingProperties = JSON.parse(fs.readFileSync(existingPropertiesPath, 'utf8'));
  console.log(`📂 Found ${existingProperties.length} existing properties\n`);
} catch (error) {
  console.error('❌ Could not read existing properties file');
  console.log('   Make sure app/data/properties.json exists');
  process.exit(1);
}

// Backup των παλιών properties
const backupPath = './app/data/properties-backup-' + Date.now() + '.json';
fs.writeFileSync(backupPath, JSON.stringify(existingProperties, null, 2));
console.log(`💾 Backup saved to: ${backupPath}\n`);

// Πάρε πραγματικές διευθύνσεις από τη database
// Προτεραιότητα σε περιοχές που ταιριάζουν με τα υπάρχοντα properties
const getAddressesForArea = (area) => {
  // Μετατροπή περιοχών σε ελληνικά αν χρειάζεται
  const areaMapping = {
    'Kolonaki': 'Κολωνάκι',
    'Exarchia': 'Εξάρχεια',
    'Plaka': 'Πλάκα',
    'Kifisia': 'Κηφισιά',
    'Glyfada': 'Γλυφάδα',
    'Marousi': 'Μαρούσι',
    'Psiri': 'Ψυρρή',
    'Koukaki': 'Κουκάκι',
    'Pagrati': 'Παγκράτι',
    'Nea Smyrni': 'Νέα Σμύρνη',
    'Piraeus': 'Πειραιάς',
    'Peristeri': 'Περιστέρι',
    'Ampelokipoi': 'Αμπελόκηποι',
    'Kypseli': 'Κυψέλη',
    'Ilioupoli': 'Ηλιούπολη',
    'Kallithea': 'Καλλιθέα',
    'Zografou': 'Ζωγράφου',
    'Voula': 'Βούλα',
    'Vouliagmeni': 'Βουλιαγμένη',
    'Palaio Faliro': 'Παλαιό Φάληρο'
  };

  const greekArea = areaMapping[area] || area;
  
  // Πρώτα ψάξε για exact match
  let addresses = db.prepare(`
    SELECT DISTINCT 
      street_name, 
      street_number, 
      municipality,
      lat, 
      lng,
      full_address
    FROM addresses 
    WHERE municipality LIKE ? 
    AND lat IS NOT NULL 
    AND lng IS NOT NULL
    ORDER BY RANDOM()
    LIMIT 100
  `).all(`%${greekArea}%`);

  // Αν δεν βρεις αρκετές, πάρε από γειτονικές περιοχές
  if (addresses.length < 10) {
    console.log(`⚠️  Few addresses found for ${area}, using nearby areas`);
    addresses = db.prepare(`
      SELECT DISTINCT 
        street_name, 
        street_number, 
        municipality,
        lat, 
        lng,
        full_address
      FROM addresses 
      WHERE lat IS NOT NULL 
      AND lng IS NOT NULL
      AND municipality NOT IN ('Unknown', 'Λαγονήσι')
      ORDER BY RANDOM()
      LIMIT 100
    `).all();
  }

  return addresses;
};

// Κράτα track των χρησιμοποιημένων διευθύνσεων
const usedAddresses = new Set();

// Ενημέρωσε κάθε property
const updatedProperties = existingProperties.map((property, index) => {
  // Πάρε διευθύνσεις για την περιοχή του property
  const areaAddresses = getAddressesForArea(property.location.area);
  
  // Βρες μια διεύθυνση που δεν έχει χρησιμοποιηθεί
  let selectedAddress = null;
  for (const addr of areaAddresses) {
    const addressKey = `${addr.street_name}_${addr.street_number}_${addr.municipality}`;
    if (!usedAddresses.has(addressKey)) {
      usedAddresses.add(addressKey);
      selectedAddress = addr;
      break;
    }
  }

  // Αν δεν βρήκαμε, πάρε οποιαδήποτε τυχαία
  if (!selectedAddress) {
    const randomAddresses = db.prepare(`
      SELECT * FROM addresses 
      WHERE lat IS NOT NULL AND lng IS NOT NULL
      ORDER BY RANDOM() LIMIT 1
    `).get();
    selectedAddress = randomAddresses;
  }

  if (selectedAddress) {
    // Ενημέρωσε το property με τη νέα διεύθυνση
    return {
      ...property,
      location: {
        ...property.location,
        address: `${selectedAddress.street_name} ${selectedAddress.street_number}`,
        street: selectedAddress.street_name,
        streetNumber: selectedAddress.street_number,
        area: selectedAddress.municipality,
        areaGr: selectedAddress.municipality,
        lat: selectedAddress.lat,
        lng: selectedAddress.lng,
        fullAddress: selectedAddress.full_address || 
                     `${selectedAddress.street_name} ${selectedAddress.street_number}, ${selectedAddress.municipality}`
      },
      // Ενημέρωσε και τον τίτλο
      title: property.title.includes(property.location.area) 
        ? property.title.replace(property.location.area, selectedAddress.municipality)
        : `${selectedAddress.municipality} - ${property.details.sqm}τμ στην ${selectedAddress.street_name}`
    };
  }

  return property; // Κράτα το παλιό αν δεν βρήκαμε διεύθυνση
});

// Στατιστικά
const stats = {
  total: updatedProperties.length,
  updated: 0,
  byArea: {}
};

updatedProperties.forEach(prop => {
  if (prop.location.lat && prop.location.lng) {
    stats.updated++;
    const area = prop.location.area;
    stats.byArea[area] = (stats.byArea[area] || 0) + 1;
  }
});

// Αποθήκευση
fs.writeFileSync(
  existingPropertiesPath,
  JSON.stringify(updatedProperties, null, 2)
);

// Δημιούργησε και ένα merged αρχείο με όλα τα properties
const mergedPath = './app/data/properties-with-real-addresses.json';
fs.writeFileSync(
  mergedPath,
  JSON.stringify(updatedProperties, null, 2)
);

console.log('\n✅ Update Complete!\n');
console.log('📊 Statistics:');
console.log(`   Total properties: ${stats.total}`);
console.log(`   Successfully updated: ${stats.updated}`);
console.log(`   Success rate: ${((stats.updated / stats.total) * 100).toFixed(1)}%\n`);

console.log('   Properties by area:');
Object.entries(stats.byArea)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 15)
  .forEach(([area, count]) => {
    console.log(`   - ${area}: ${count} properties`);
  });

console.log('\n📁 Files:');
console.log(`   Original: ${existingPropertiesPath}`);
console.log(`   Backup: ${backupPath}`);
console.log(`   Merged: ${mergedPath}`);

db.close();
