// Quick setup script to create initial database
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function setupDatabases() {
    console.log('🔧 Setting up Attica databases...\n');
    
    // Create attica_streets.db with sample data
    const streetsDb = new sqlite3.Database('./attica_streets.db');
    
    streetsDb.serialize(() => {
        // Create table
        streetsDb.run(`
            CREATE TABLE IF NOT EXISTS attica_streets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255) NOT NULL,
                name_en VARCHAR(255),
                municipality VARCHAR(100),
                street_type VARCHAR(50),
                postal_code VARCHAR(10),
                lat DECIMAL(10, 8),
                lng DECIMAL(11, 8),
                osm_id VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(name, municipality)
            )
        `);
        
        // Create indexes
        streetsDb.run(`CREATE INDEX IF NOT EXISTS idx_name ON attica_streets(name)`);
        streetsDb.run(`CREATE INDEX IF NOT EXISTS idx_municipality ON attica_streets(municipality)`);
        
        // Insert sample streets for testing
        const sampleStreets = [
            // Athens Center
            ['Σταδίου', 'Stadiou', 'Athens', 'primary', '10559', 37.9789, 23.7330],
            ['Πανεπιστημίου', 'Panepistimiou', 'Athens', 'primary', '10564', 37.9803, 23.7337],
            ['Ακαδημίας', 'Akadimias', 'Athens', 'primary', '10671', 37.9807, 23.7357],
            ['Σόλωνος', 'Solonos', 'Athens', 'secondary', '10672', 37.9785, 23.7405],
            ['Ομήρου', 'Omirou', 'Athens', 'secondary', '10672', 37.9813, 23.7362],
            
            // Kolonaki
            ['Σκουφά', 'Skoufa', 'Kolonaki', 'residential', '10672', 37.9809, 23.7378],
            ['Τσακάλωφ', 'Tsakalof', 'Kolonaki', 'residential', '10673', 37.9793, 23.7396],
            ['Πατριάρχου Ιωακείμ', 'Patriarchou Ioakim', 'Kolonaki', 'residential', '10675', 37.9782, 23.7453],
            
            // Glyfada
            ['Μεταξά', 'Metaxa', 'Glyfada', 'primary', '16675', 37.8612, 23.7525],
            ['Γούναρη', 'Gounari', 'Glyfada', 'secondary', '16674', 37.8645, 23.7547],
            ['Λαζαράκη', 'Lazaraki', 'Glyfada', 'residential', '16674', 37.8690, 23.7560],
            
            // Kifisia
            ['Κολοκοτρώνη', 'Kolokotroni', 'Kifisia', 'secondary', '14562', 38.0738, 23.8108],
            ['Κασσαβέτη', 'Kassaveti', 'Kifisia', 'residential', '14562', 38.0745, 23.8115],
            
            // Piraeus
            ['Ηρώων Πολυτεχνείου', 'Iroon Polytechniou', 'Piraeus', 'primary', '18535', 37.9483, 23.6433],
            ['Φίλωνος', 'Filonos', 'Piraeus', 'secondary', '18535', 37.9478, 23.6445],
            
            // Marousi
            ['Κηφισίας', 'Kifisias', 'Marousi', 'primary', '15123', 38.0505, 23.8062],
            ['Αγίου Κωνσταντίνου', 'Agiou Konstantinou', 'Marousi', 'secondary', '15124', 38.0490, 23.8055]
        ];
        
        const stmt = streetsDb.prepare(`
            INSERT OR IGNORE INTO attica_streets 
            (name, name_en, municipality, street_type, postal_code, lat, lng) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        sampleStreets.forEach(street => {
            stmt.run(...street);
        });
        
        stmt.finalize();
        
        console.log(`✅ Created attica_streets.db with ${sampleStreets.length} sample streets`);
    });
    
    streetsDb.close();
    
    // Create attica_geocoded.db
    const geocodedDb = new sqlite3.Database('./attica_geocoded.db');
    
    geocodedDb.serialize(() => {
        geocodedDb.run(`
            CREATE TABLE IF NOT EXISTS attica_addresses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                street_name VARCHAR(255) NOT NULL,
                street_number INTEGER NOT NULL,
                municipality VARCHAR(100),
                postal_code VARCHAR(10),
                full_address VARCHAR(500),
                lat DECIMAL(10, 8) NOT NULL,
                lng DECIMAL(11, 8) NOT NULL,
                geocoding_source VARCHAR(50) DEFAULT 'calculated',
                confidence DECIMAL(3, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(street_name, street_number, municipality)
            )
        `);
        
        // Create indexes
        geocodedDb.run(`CREATE INDEX IF NOT EXISTS idx_street ON attica_addresses(street_name)`);
        geocodedDb.run(`CREATE INDEX IF NOT EXISTS idx_municipality ON attica_addresses(municipality)`);
        geocodedDb.run(`CREATE INDEX IF NOT EXISTS idx_coords ON attica_addresses(lat, lng)`);
        
        console.log('✅ Created attica_geocoded.db');
    });
    
    geocodedDb.close();
    
    console.log('\n🎉 Databases ready! You can now:');
    console.log('1. Run: node scripts/geocodeAtticaComplete.mjs');
    console.log('2. Or download full data: node scripts/downloadAtticaStreets.mjs');
}

setupDatabases().catch(console.error);
