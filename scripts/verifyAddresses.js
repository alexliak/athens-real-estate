// Verify what addresses we have and their quality
const sqlite3 = require('sqlite3').verbose();

console.log('🔍 VERIFYING ADDRESS COVERAGE\n');

function analyzeDatabase(dbFile, tableName) {
    console.log(`\n📂 Analyzing ${dbFile} (${tableName}):`);
    console.log('='.repeat(50));
    
    const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READONLY);
    
    // Total count
    db.get(`SELECT COUNT(*) as total FROM ${tableName}`, (err, result) => {
        if (err) {
            console.log(`Error: ${err.message}`);
            return;
        }
        console.log(`Total addresses: ${result.total.toLocaleString()}`);
    });
    
    // By municipality
    db.all(`
        SELECT municipality, COUNT(*) as count 
        FROM ${tableName}
        WHERE municipality IS NOT NULL AND municipality != 'Unknown'
        GROUP BY municipality
        ORDER BY count DESC
        LIMIT 20
    `, (err, rows) => {
        if (!err && rows) {
            console.log('\nTop municipalities:');
            rows.forEach(row => {
                console.log(`  ${row.municipality}: ${row.count.toLocaleString()} addresses`);
            });
        }
    });
    
    // Check coordinate quality
    db.get(`
        SELECT 
            COUNT(CASE WHEN lat IS NOT NULL AND lng IS NOT NULL THEN 1 END) as with_coords,
            COUNT(CASE WHEN lat IS NULL OR lng IS NULL THEN 1 END) as without_coords,
            COUNT(DISTINCT ROUND(lat, 6) || ',' || ROUND(lng, 6)) as unique_coords
        FROM ${tableName}
    `, (err, result) => {
        if (!err && result) {
            console.log('\nCoordinate quality:');
            console.log(`  With coordinates: ${result.with_coords.toLocaleString()}`);
            console.log(`  Without coordinates: ${result.without_coords}`);
            console.log(`  Unique coordinate pairs: ${result.unique_coords.toLocaleString()}`);
        }
    });
    
    // Sample addresses
    db.all(`
        SELECT street_name, street_number, municipality, lat, lng
        FROM ${tableName}
        WHERE lat IS NOT NULL
        ORDER BY RANDOM()
        LIMIT 5
    `, (err, rows) => {
        if (!err && rows) {
            console.log('\nSample addresses:');
            rows.forEach(row => {
                console.log(`  ${row.street_name} ${row.street_number}, ${row.municipality}`);
                console.log(`    → ${row.lat}, ${row.lng}`);
            });
        }
        
        setTimeout(() => db.close(), 1000);
    });
}

// Analyze all address databases
analyzeDatabase('attica_geocoded.db', 'attica_addresses');
analyzeDatabase('property_coordinates.db', 'property_coordinates');

// Check for master database
const fs = require('fs');
if (fs.existsSync('attica_master.db')) {
    analyzeDatabase('attica_master.db', 'addresses');
}
