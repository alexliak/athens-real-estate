// Σύστημα για δημιουργία ακινήτων με πραγματικές διευθύνσεις
import Database from 'better-sqlite3';
import { faker } from '@faker-js/faker';
import fs from 'fs';

const db = new Database('./attica_master.db');

// Property types και τιμές ανά περιοχή
const areaConfig = {
  'Κολωνάκι': { minPrice: 300000, maxPrice: 2000000, avgSqmPrice: 4500 },
  'Εξάρχεια': { minPrice: 150000, maxPrice: 600000, avgSqmPrice: 2500 },
  'Πλάκα': { minPrice: 250000, maxPrice: 1500000, avgSqmPrice: 3500 },
  'Κηφισιά': { minPrice: 400000, maxPrice: 3000000, avgSqmPrice: 3800 },
  'Γλυφάδα': { minPrice: 350000, maxPrice: 2500000, avgSqmPrice: 4000 },
  'Πειραιάς': { minPrice: 120000, maxPrice: 500000, avgSqmPrice: 2000 },
  'Μαρούσι': { minPrice: 280000, maxPrice: 1200000, avgSqmPrice: 3200 },
  'Νέα Σμύρνη': { minPrice: 200000, maxPrice: 800000, avgSqmPrice: 2800 },
  'Παλαιό Φάληρο': { minPrice: 250000, maxPrice: 1000000, avgSqmPrice: 3300 },
  'Αμπελόκηποι': { minPrice: 180000, maxPrice: 700000, avgSqmPrice: 2600 },
  'default': { minPrice: 150000, maxPrice: 600000, avgSqmPrice: 2200 }
};

function generateProperties() {
  console.log('🏠 Generating Real Estate Properties with Real Addresses...\n');

  // Παίρνουμε τυχαίες διευθύνσεις από τη database
  const addresses = db.prepare(`
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
    LIMIT 1000
  `).all();

  console.log(`📍 Found ${addresses.length} valid addresses to use\n`);

  const properties = addresses.map((addr, index) => {
    const config = areaConfig[addr.municipality] || areaConfig.default;
    
    // Τυχαίο μέγεθος ακινήτου
    const sqm = faker.number.int({ min: 45, max: 250 });
    const type = faker.helpers.arrayElement(['sale', 'rent']);
    
    // Υπολογισμός τιμής βάσει περιοχής και μεγέθους
    let price;
    if (type === 'sale') {
      price = Math.round(sqm * config.avgSqmPrice * faker.number.float({ min: 0.8, max: 1.2 }));
    } else {
      // Ενοίκιο: περίπου 0.4% της αξίας το μήνα
      const salePrice = sqm * config.avgSqmPrice;
      price = Math.round(salePrice * 0.004);
    }

    const yearBuilt = faker.number.int({ min: 1960, max: 2024 });
    const isNew = yearBuilt >= 2020;

    return {
      id: `prop_${index + 1}`,
      title: generateTitle(addr, sqm, type),
      price,
      location: {
        address: `${addr.street_name} ${addr.street_number}`,
        street: addr.street_name,
        streetNumber: addr.street_number,
        area: addr.municipality,
        areaGr: addr.municipality,
        lat: addr.lat,
        lng: addr.lng,
        fullAddress: addr.full_address
      },
      details: {
        type,
        propertyType: faker.helpers.arrayElement(['Διαμέρισμα', 'Μεζονέτα', 'Μονοκατοικία', 'Studio']),
        bedrooms: sqm < 50 ? 1 : faker.number.int({ min: 1, max: Math.min(5, Math.floor(sqm / 30)) }),
        bathrooms: faker.number.int({ min: 1, max: 2 }),
        sqm,
        floor: faker.helpers.arrayElement(['Ισόγειο', '1ος', '2ος', '3ος', '4ος', '5ος', 'Ρετιρέ']),
        yearBuilt,
        condition: isNew ? 'Νεόδμητο' : faker.helpers.arrayElement(['Ανακαινισμένο', 'Καλή κατάσταση', 'Χρήζει ανακαίνισης'])
      },
      features: generateFeatures(sqm, yearBuilt, addr.municipality),
      images: generateImages(addr.municipality),
      description: generateDescription(addr, sqm, type, yearBuilt),
      agent: {
        name: faker.person.fullName(),
        phone: `21${faker.number.int({ min: 10000000, max: 99999999 })}`,
        email: faker.internet.email({ provider: 'realestate.gr' })
      },
      createdAt: faker.date.recent({ days: 30 }),
      views: faker.number.int({ min: 10, max: 500 }),
      isFeatured: faker.number.int({ min: 1, max: 100 }) > 90
    };
  });

  // Αποθήκευση σε αρχείο
  fs.writeFileSync(
    './app/data/properties-real-addresses.json',
    JSON.stringify(properties, null, 2)
  );

  // Στατιστικά
  const stats = {
    total: properties.length,
    byArea: {},
    byType: { sale: 0, rent: 0 },
    avgPrices: {}
  };

  properties.forEach(prop => {
    const area = prop.location.area;
    stats.byArea[area] = (stats.byArea[area] || 0) + 1;
    stats.byType[prop.details.type]++;
  });

  console.log('📊 Statistics:');
  console.log(`   Total properties: ${stats.total}`);
  console.log('\n   By area:');
  Object.entries(stats.byArea)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([area, count]) => {
      console.log(`   - ${area}: ${count} properties`);
    });

  console.log(`\n   For sale: ${stats.byType.sale}`);
  console.log(`   For rent: ${stats.byType.rent}`);

  console.log('\n✅ Properties saved to: app/data/properties-real-addresses.json');
  return properties;
}

function generateTitle(addr, sqm, type) {
  const titles = [
    `${addr.municipality} - ${sqm}τμ στην ${addr.street_name}`,
    `${sqm}τμ ${type === 'rent' ? 'προς ενοικίαση' : 'προς πώληση'} - ${addr.street_name}`,
    `Ευκαιρία στο ${addr.municipality} - ${addr.street_name} ${addr.street_number}`,
    `${addr.municipality}: ${sqm}τμ στην οδό ${addr.street_name}`
  ];
  return faker.helpers.arrayElement(titles);
}

function generateFeatures(sqm, yearBuilt, area) {
  const features = [];
  
  // Βασικά χαρακτηριστικά
  if (faker.datatype.boolean(0.8)) features.push('Ασανσέρ');
  if (faker.datatype.boolean(0.7)) features.push('Μπαλκόνι');
  if (faker.datatype.boolean(0.6)) features.push('Αποθήκη');
  if (faker.datatype.boolean(0.5)) features.push('Θέση parking');
  if (faker.datatype.boolean(0.4)) features.push('Αυτόνομη θέρμανση');
  
  // Premium features για ακριβές περιοχές
  if (['Κολωνάκι', 'Κηφισιά', 'Γλυφάδα'].includes(area)) {
    if (faker.datatype.boolean(0.6)) features.push('Πισίνα');
    if (faker.datatype.boolean(0.7)) features.push('Κήπος');
    if (faker.datatype.boolean(0.5)) features.push('Συναγερμός');
  }
  
  // Νεόδμητα χαρακτηριστικά
  if (yearBuilt >= 2020) {
    features.push('Ενεργειακή κλάση Α+');
    if (faker.datatype.boolean(0.7)) features.push('Έξυπνο σπίτι');
    if (faker.datatype.boolean(0.6)) features.push('Ηλιακός θερμοσίφωνας');
  }
  
  return features;
}

function generateImages(area) {
  // Θα χρησιμοποιήσουμε placeholder images
  const imageCount = faker.number.int({ min: 5, max: 10 });
  return Array.from({ length: imageCount }, (_, i) => 
    `https://source.unsplash.com/800x600/?${area},apartment,interior&sig=${i}`
  );
}

function generateDescription(addr, sqm, type, yearBuilt) {
  const condition = yearBuilt >= 2020 ? 'νεόδμητο' : 
                    yearBuilt >= 2010 ? 'πρόσφατης κατασκευής' : 
                    'καλά συντηρημένο';
  
  return `Εξαιρετικό ${condition} ακίνητο ${sqm}τμ στην περιοχή ${addr.municipality}, ` +
         `επί της οδού ${addr.street_name}. Βρίσκεται σε προνομιακή τοποθεσία με εύκολη ` +
         `πρόσβαση σε ΜΜΜ και τοπική αγορά. ${type === 'rent' ? 'Διατίθεται προς ενοικίαση' : 'Διατίθεται προς πώληση'} ` +
         `σε ανταγωνιστική τιμή. Κατασκευή ${yearBuilt}.`;
}

// Run the generation
generateProperties();
db.close();
