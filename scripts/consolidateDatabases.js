// Consolidate all databases into one master database
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

console.log('🔄 CONSOLIDATING ALL DATABASES\n');

async function consolidate() {
    // Create master database
    const masterDb = new sqlite3.Database('./attica_master.db');
    
    console.log('📦 Creating master database schema...\n');
    
    // Create comprehensive schema
    masterDb.serialize(() => {
        // Master streets table
        masterDb.run(`
            CREATE TABLE IF NOT EXISTS streets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255) NOT NULL,
                name_en VARCHAR(255),
                municipality VARCHAR(100),
                street_type VARCHAR(50),
                postal_code VARCHAR(10),
                osm_id VARCHAR(50),
                lat DECIMAL(10, 8),
                lng DECIMAL(11, 8),
                source VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(name, municipality)
            )
        `);
        
        // Master addresses table
        masterDb.run(`
            CREATE TABLE IF NOT EXISTS addresses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                street_name VARCHAR(255) NOT NULL,
                street_number INTEGER NOT NULL,
                municipality VARCHAR(100),
                postal_code VARCHAR(10),
                full_address VARCHAR(500),
                lat DECIMAL(10, 8) NOT NULL,
                lng DECIMAL(11, 8) NOT NULL,
                geocoding_source VARCHAR(50),
                confidence DECIMAL(3, 2),
                source_db VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(street_name, street_number, municipality)
            )
        `);
        
        // Create indexes
        masterDb.run(`CREATE INDEX IF NOT EXISTS idx_streets_name ON streets(name)`);
        masterDb.run(`CREATE INDEX IF NOT EXISTS idx_streets_municipality ON streets(municipality)`);
        masterDb.run(`CREATE INDEX IF NOT EXISTS idx_addresses_street ON addresses(street_name)`);
        masterDb.run(`CREATE INDEX IF NOT EXISTS idx_addresses_coords ON addresses(lat, lng)`);
    });
    
    // Import from attica_streets.db
    console.log('📥 Importing from attica_streets.db...');
    const streetsDb = new sqlite3.Database('./attica_streets.db', sqlite3.OPEN_READONLY);
    
    await new Promise((resolve) => {
        streetsDb.all('SELECT * FROM attica_streets', (err, rows) => {
            if (!err && rows) {
                console.log(`   Found ${rows.length} streets`);
                const stmt = masterDb.prepare(`
                    INSERT OR IGNORE INTO streets 
                    (name, name_en, municipality, street_type, postal_code, osm_id, lat, lng, source)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'osm_download')
                `);
                
                rows.forEach(row => {
                    stmt.run(row.name, row.name_en, row.municipality, row.street_type, 
                            row.postal_code, row.osm_id, row.lat, row.lng);
                });
                
                stmt.finalize();
                console.log(`   ✅ Imported ${rows.length} streets`);
            }
            streetsDb.close();
            resolve();
        });
    });
    
    // Import from attica_geocoded.db
    console.log('\n📥 Importing from attica_geocoded.db...');
    const geocodedDb = new sqlite3.Database('./attica_geocoded.db', sqlite3.OPEN_READONLY);
    
    await new Promise((resolve) => {
        geocodedDb.all('SELECT * FROM attica_addresses', (err, rows) => {
            if (!err && rows) {
                console.log(`   Found ${rows.length} addresses`);
                const stmt = masterDb.prepare(`
                    INSERT OR IGNORE INTO addresses 
                    (street_name, street_number, municipality, postal_code, full_address, 
                     lat, lng, geocoding_source, confidence, source_db)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'attica_geocoded')
                `);
                
                let imported = 0;
                rows.forEach(row => {
                    stmt.run(row.street_name, row.street_number, row.municipality, 
                            row.postal_code, row.full_address, row.lat, row.lng,
                            row.geocoding_source, row.confidence);
                    imported++;
                    if (imported % 10000 === 0) {
                        console.log(`   Processing... ${imported}/${rows.length}`);
                    }
                });
                
                stmt.finalize();
                console.log(`   ✅ Imported ${rows.length} addresses`);
            }
            geocodedDb.close();
            resolve();
        });
    });
    
    // Import from property_coordinates.db
    console.log('\n📥 Importing from property_coordinates.db...');
    const propertyDb = new sqlite3.Database('./property_coordinates.db', sqlite3.OPEN_READONLY);
    
    await new Promise((resolve) => {
        propertyDb.all('SELECT * FROM property_coordinates', (err, rows) => {
            if (!err && rows) {
                console.log(`   Found ${rows.length} property coordinates`);
                const stmt = masterDb.prepare(`
                    INSERT OR IGNORE INTO addresses 
                    (street_name, street_number, municipality, full_address, 
                     lat, lng, geocoding_source, confidence, source_db)
                    VALUES (?, ?, ?, ?, ?, ?, 'nominatim', 1.0, 'property_coordinates')
                `);
                
                rows.forEach(row => {
                    stmt.run(row.street, row.number, row.area, row.full_address, 
                            row.lat, row.lng);
                });
                
                stmt.finalize();
                console.log(`   ✅ Imported ${rows.length} property coordinates`);
            }
            propertyDb.close();
            resolve();
        });
    });
    
    // Generate statistics
    console.log('\n📊 Generating statistics...');
    
    masterDb.get('SELECT COUNT(*) as count FROM streets', (err, result) => {
        console.log(`   Total unique streets: ${result.count}`);
    });
    
    masterDb.get('SELECT COUNT(*) as count FROM addresses', (err, result) => {
        console.log(`   Total unique addresses: ${result.count}`);
    });
    
    masterDb.get('SELECT COUNT(DISTINCT municipality) as count FROM streets WHERE municipality != "Unknown"', (err, result) => {
        console.log(`   Municipalities with data: ${result.count}`);
    });
    
    // Close
    setTimeout(() => {
        masterDb.close();
        console.log('\n✅ Master database created: attica_master.db');
        console.log('   Use this for all queries!\n');
    }, 2000);
}

consolidate().catch(console.error);
