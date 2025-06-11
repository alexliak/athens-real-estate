// Download municipality boundaries and assign streets to correct municipalities
import fetch from 'node-fetch';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';

console.log('🏛️ DOWNLOADING ATTICA MUNICIPALITY BOUNDARIES\n');

// Overpass query for municipality boundaries
const boundariesQuery = `
[out:json][timeout:300];
// Get all municipalities in Attica
area["name"="Αττική"]["admin_level"="4"]->.attica;
(
  relation["admin_level"~"[7-8]"]["type"="boundary"](area.attica);
);
out geom;
`;

async function downloadBoundaries() {
    console.log('📡 Downloading municipality boundaries...');
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: boundariesQuery,
        headers: { 'Content-Type': 'text/plain' }
    });
    
    const data = await response.json();
    console.log(`✅ Found ${data.elements.length} municipality boundaries`);
    
    // Save boundaries
    fs.writeFileSync('./municipality_boundaries.json', JSON.stringify(data, null, 2));
    
    // Extract municipality info
    const municipalities = data.elements.map(element => ({
        id: element.id,
        name: element.tags.name || element.tags['name:el'],
        nameEn: element.tags['name:en'],
        adminLevel: element.tags.admin_level,
        bounds: element.bounds
    }));
    
    console.log('\n📊 Municipalities found:');
    municipalities.forEach(m => {
        console.log(`   ${m.name} (${m.nameEn})`);
    });
    
    return municipalities;
}

// Function to check if point is in municipality bounds (simple box check)
function isPointInBounds(lat, lng, bounds) {
    return lat >= bounds.minlat && lat <= bounds.maxlat &&
           lng >= bounds.minlon && lng <= bounds.maxlon;
}

async function assignMunicipalities() {
    console.log('\n🔄 Assigning municipalities to streets...');
    
    const boundaries = JSON.parse(fs.readFileSync('./municipality_boundaries.json', 'utf8'));
    const db = await open({
        filename: './attica_streets.db',
        driver: sqlite3.Database
    });
    
    // Get all streets with Unknown municipality
    const unknownStreets = await db.all(`
        SELECT id, name, lat, lng 
        FROM attica_streets 
        WHERE municipality = 'Unknown' AND lat IS NOT NULL
    `);
    
    console.log(`Found ${unknownStreets.length} streets to process`);
    
    let updated = 0;
    for (const street of unknownStreets) {
        // Find which municipality this street belongs to
        for (const element of boundaries.elements) {
            if (element.bounds && isPointInBounds(street.lat, street.lng, element.bounds)) {
                const municipality = element.tags.name || element.tags['name:el'] || 'Unknown';
                
                await db.run(
                    'UPDATE attica_streets SET municipality = ? WHERE id = ?',
                    [municipality, street.id]
                );
                
                updated++;
                if (updated % 100 === 0) {
                    console.log(`   Updated ${updated} streets...`);
                }
                break;
            }
        }
    }
    
    console.log(`✅ Updated ${updated} streets with municipality data`);
    
    // Show new statistics
    const stats = await db.all(`
        SELECT municipality, COUNT(*) as count 
        FROM attica_streets 
        GROUP BY municipality 
        ORDER BY count DESC
        LIMIT 20
    `);
    
    console.log('\n📊 Updated municipality distribution:');
    stats.forEach(s => {
        console.log(`   ${s.municipality}: ${s.count} streets`);
    });
    
    await db.close();
}

// Main execution
async function main() {
    try {
        await downloadBoundaries();
        await assignMunicipalities();
        console.log('\n✅ Municipality assignment complete!');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
