// scripts/geocodeAddresses.ts

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

// Import Athens areas from the main app
const athensAreasData = require('../app/lib/generateAthensProperties');
const athensAreas = athensAreasData.athensAreas || [];

// Rate limiter
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Geocoding function using Nominatim
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    const fetch = (await import('node-fetch')).default;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=gr&limit=1`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'RealEstateAthens/1.0' // Required by Nominatim
            }
        });

        const data = await response.json() as any[];

        if (data && Array.isArray(data) && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
    } catch (error) {
        console.error(`Geocoding error for ${address}:`, error);
    }

    return null;
}

// Generate all possible addresses
function generateAllAddresses() {
    const addresses: any[] = [];

    for (const area of athensAreas) {
        // Check if area has streets property
        if (!area.streets || !Array.isArray(area.streets)) {
            console.warn(`Area ${area.name} has no streets array`);
            continue;
        }
        
        for (const street of area.streets) {
            // Generate addresses for every 5th number to reduce total count
            for (let num = 1; num <= 150; num += 5) {
                addresses.push({
                    street,
                    number: num,
                    area: area.name,
                    areaGr: area.nameGr,
                    fullAddress: `${street} ${num}, ${area.nameGr}, Αθήνα, Ελλάδα`
                });
            }
        }
    }

    return addresses;
}

// Main geocoding function
async function geocodeAllAddresses() {
    // Open database
    const db = await open({
        filename: './property_coordinates.db',
        driver: sqlite3.Database
    });

    // Create table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS property_coordinates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      street VARCHAR(255) NOT NULL,
      number INTEGER NOT NULL,
      area VARCHAR(100) NOT NULL,
      area_gr VARCHAR(100) NOT NULL,
      full_address VARCHAR(500) NOT NULL,
      lat DECIMAL(10, 8) NOT NULL,
      lng DECIMAL(11, 8) NOT NULL,
      geocoding_source VARCHAR(50) DEFAULT 'nominatim',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(street, number, area)
    );

    CREATE INDEX IF NOT EXISTS idx_area ON property_coordinates(area);
    CREATE INDEX IF NOT EXISTS idx_street ON property_coordinates(street);
  `);

    const addresses = generateAllAddresses();
    console.log(`Total addresses to geocode: ${addresses.length}`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < addresses.length; i++) {
        const addr = addresses[i];

        // Check if already geocoded
        const existing = await db.get(
            'SELECT * FROM property_coordinates WHERE street = ? AND number = ? AND area = ?',
            [addr.street, addr.number, addr.area]
        );

        if (existing) {
            console.log(`[${i + 1}/${addresses.length}] Already geocoded: ${addr.fullAddress}`);
            successCount++;
            continue;
        }

        // Geocode address
        console.log(`[${i + 1}/${addresses.length}] Geocoding: ${addr.fullAddress}`);
        const coords = await geocodeAddress(addr.fullAddress);

        if (coords) {
            // Save to database
            await db.run(
                `INSERT INTO property_coordinates 
         (street, number, area, area_gr, full_address, lat, lng) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [addr.street, addr.number, addr.area, addr.areaGr, addr.fullAddress, coords.lat, coords.lng]
            );
            successCount++;
            console.log(`✓ Success: ${coords.lat}, ${coords.lng}`);
        } else {
            failCount++;
            console.log(`✗ Failed to geocode`);

            // Try alternative format
            const altAddress = `${addr.street} ${addr.number}, Athens, Greece`;
            const altCoords = await geocodeAddress(altAddress);

            if (altCoords) {
                await db.run(
                    `INSERT INTO property_coordinates 
           (street, number, area, area_gr, full_address, lat, lng) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [addr.street, addr.number, addr.area, addr.areaGr, addr.fullAddress, altCoords.lat, altCoords.lng]
                );
                successCount++;
                failCount--;
                console.log(`✓ Success with alt format: ${altCoords.lat}, ${altCoords.lng}`);
            }
        }

        // Rate limit: 1 request per second
        await sleep(1000);

        // Progress update every 10 addresses
        if ((i + 1) % 10 === 0) {
            console.log(`\nProgress: ${i + 1}/${addresses.length} (${Math.round((i + 1) / addresses.length * 100)}%)`);
            console.log(`Success: ${successCount}, Failed: ${failCount}\n`);
        }
    }

    await db.close();

    console.log('\n=== Geocoding Complete ===');
    console.log(`Total: ${addresses.length}`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Success rate: ${Math.round(successCount / addresses.length * 100)}%`);
}

// Run the script
geocodeAllAddresses().catch(console.error);