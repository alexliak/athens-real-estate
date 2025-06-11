// Script to update existing database with new columns
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'property_coordinates.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Updating database schema...\n');

db.serialize(() => {
    // Check if display_name column exists
    db.all("PRAGMA table_info(property_coordinates)", (err, columns) => {
        if (err) {
            console.error('Error checking table:', err);
            return;
        }
        
        const hasDisplayName = columns.some(col => col.name === 'display_name');
        
        if (!hasDisplayName) {
            console.log('Adding display_name column...');
            db.run("ALTER TABLE property_coordinates ADD COLUMN display_name TEXT", (err) => {
                if (err) {
                    console.error('Error adding column:', err);
                } else {
                    console.log('✅ Successfully added display_name column');
                }
            });
        } else {
            console.log('✅ display_name column already exists');
        }
        
        // Show current schema
        console.log('\nCurrent table schema:');
        columns.forEach(col => {
            console.log(`  - ${col.name} (${col.type})`);
        });
        
        // Count existing records
        db.get("SELECT COUNT(*) as count FROM property_coordinates", (err, row) => {
            if (!err) {
                console.log(`\n📊 Total records in database: ${row.count}`);
            }
            db.close();
        });
    });
});
