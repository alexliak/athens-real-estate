// Simple geocoding script using ESM
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fetch from 'node-fetch';

// Athens areas with streets
const athensAreas = [
  { 
    name: 'Kolonaki', 
    nameGr: 'Κολωνάκι',
    streets: ['Σκουφά', 'Τσακάλωφ', 'Πατριάρχου Ιωακείμ']
  },
  { 
    name: 'Glyfada', 
    nameGr: 'Γλυφάδα',
    streets: ['Γούναρη', 'Λαζαράκη', 'Μεταξά']
  },
  { 
    name: 'Peristeri', 
    nameGr: 'Περιστέρι',
    streets: ['Παναγή Τσαλδάρη', 'Εθνάρχου Μακαρίου', 'Αγίου Βασιλείου']
  }
];

async function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=gr&limit=1`;
    
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'RealEstateAthens/1.0' }
        });
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
    } catch (error) {
        console.error(`Error geocoding ${address}:`, error.message);
    }
    
    return null;
}

async function main() {
    // Create database
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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(street, number, area)
        );
    `);

    console.log('Starting geocoding...\n');
    
    let total = 0;
    let success = 0;
    
    // Process only a few addresses for testing
    for (const area of athensAreas) {
        for (const street of area.streets) {
            // Only process numbers 10, 50, 100 for testing
            for (const num of [10, 50, 100]) {
                total++;
                const address = `${street} ${num}, ${area.nameGr}, Αθήνα, Ελλάδα`;
                
                console.log(`[${total}] Geocoding: ${address}`);
                
                const coords = await geocodeAddress(address);
                
                if (coords) {
                    try {
                        await db.run(
                            `INSERT OR IGNORE INTO property_coordinates 
                             (street, number, area, area_gr, full_address, lat, lng) 
                             VALUES (?, ?, ?, ?, ?, ?, ?)`,
                            [street, num, area.name, area.nameGr, address, coords.lat, coords.lng]
                        );
                        success++;
                        console.log(`✓ Success: ${coords.lat}, ${coords.lng}`);
                    } catch (error) {
                        console.log(`✗ Database error: ${error.message}`);
                    }
                } else {
                    console.log(`✗ No results found`);
                }
                
                // Wait 1 second (rate limiting)
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
    
    await db.close();
    
    console.log(`\nComplete! Success: ${success}/${total}`);
}

main().catch(console.error);
