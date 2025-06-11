// Remove duplicate addresses from databases
const sqlite3 = require('sqlite3').verbose();

console.log('🧹 REMOVING DUPLICATE ADDRESSES\n');

async function removeDuplicates(dbFile) {
    console.log(`Processing ${dbFile}...`);
    
    const db = new sqlite3.Database(dbFile);
    
    // Check for duplicates
    db.get(`
        SELECT COUNT(*) as total,
               COUNT(DISTINCT street_name || '|' || street_number || '|' || municipality) as unique_count
        FROM attica_addresses
    `, (err, result) => {
        if (err) {
            console.log(`  Error: ${err.message}`);
            return;
        }
        
        const duplicates = result.total - result.unique_count;
        console.log(`  Total addresses: ${result.total}`);
        console.log(`  Unique addresses: ${result.unique_count}`);
        console.log(`  Duplicates: ${duplicates}`);
        
        if (duplicates > 0) {
            console.log('  Removing duplicates...');
            
            // Create temp table with unique addresses
            db.run(`
                CREATE TABLE temp_addresses AS
                SELECT MIN(id) as id, street_name, street_number, municipality, 
                       postal_code, full_address, lat, lng, geocoding_source, confidence, created_at
                FROM attica_addresses
                GROUP BY street_name, street_number, municipality
            `, (err) => {
                if (err) {
                    console.log(`  Error creating temp table: ${err.message}`);
                    return;
                }
                
                // Replace original table
                db.serialize(() => {
                    db.run('DROP TABLE attica_addresses');
                    db.run('ALTER TABLE temp_addresses RENAME TO attica_addresses');
                    
                    // Recreate indexes
                    db.run('CREATE INDEX idx_street ON attica_addresses(street_name)');
                    db.run('CREATE INDEX idx_municipality ON attica_addresses(municipality)');
                    db.run('CREATE INDEX idx_coords ON attica_addresses(lat, lng)');
                    
                    console.log(`  ✅ Removed ${duplicates} duplicates`);
                    db.close();
                });
            });
        } else {
            console.log('  ✅ No duplicates found');
            db.close();
        }
    });
}

// Process all databases
removeDuplicates('attica_geocoded.db');
