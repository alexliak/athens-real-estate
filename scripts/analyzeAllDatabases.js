// Analyze all databases to see what we have
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

console.log('🔍 ANALYZING ALL DATABASES\n');
console.log('='.repeat(60));

// Function to analyze a database
async function analyzeDatabase(dbFile) {
    if (!fs.existsSync(dbFile)) {
        console.log(`❌ ${dbFile} not found`);
        return;
    }
    
    const stats = fs.statSync(dbFile);
    console.log(`\n📂 ${dbFile}`);
    console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    
    const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READONLY);
    
    return new Promise((resolve) => {
        // Get all tables
        db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
            if (err) {
                console.log(`   Error: ${err.message}`);
                db.close();
                resolve();
                return;
            }
            
            console.log(`   Tables: ${tables.length}`);
            
            let processed = 0;
            tables.forEach(table => {
                // Get row count and sample data
                db.get(`SELECT COUNT(*) as count FROM ${table.name}`, (err, result) => {
                    if (!err) {
                        console.log(`   - ${table.name}: ${result.count} rows`);
                        
                        // Get columns
                        db.all(`PRAGMA table_info(${table.name})`, (err, columns) => {
                            if (!err) {
                                console.log(`     Columns: ${columns.map(c => c.name).join(', ')}`);
                            }
                            
                            // Sample data
                            db.get(`SELECT * FROM ${table.name} LIMIT 1`, (err, sample) => {
                                if (!err && sample) {
                                    console.log(`     Sample: ${JSON.stringify(sample).substring(0, 100)}...`);
                                }
                                
                                processed++;
                                if (processed === tables.length) {
                                    db.close();
                                    resolve();
                                }
                            });
                        });
                    } else {
                        processed++;
                        if (processed === tables.length) {
                            db.close();
                            resolve();
                        }
                    }
                });
            });
            
            if (tables.length === 0) {
                db.close();
                resolve();
            }
        });
    });
}

// Analyze GeoJSON
function analyzeGeoJSON(file) {
    if (!fs.existsSync(file)) {
        console.log(`❌ ${file} not found`);
        return;
    }
    
    const stats = fs.statSync(file);
    console.log(`\n📂 ${file}`);
    console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    
    try {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        console.log(`   Type: ${data.type}`);
        console.log(`   Features: ${data.features.length}`);
        
        // Count by type
        const types = {};
        const municipalities = new Set();
        
        data.features.forEach(feature => {
            const type = feature.properties.highway || 'unknown';
            types[type] = (types[type] || 0) + 1;
            
            if (feature.properties['addr:city']) {
                municipalities.add(feature.properties['addr:city']);
            }
        });
        
        console.log(`   Street types: ${Object.keys(types).length}`);
        console.log(`   Municipalities found: ${municipalities.size}`);
        
        // Sample
        if (data.features.length > 0) {
            const sample = data.features[0];
            console.log(`   Sample: ${sample.properties.name || 'unnamed'} (${sample.properties.highway})`);
        }
    } catch (error) {
        console.log(`   Error parsing: ${error.message}`);
    }
}

// Main analysis
async function analyzeAll() {
    // Analyze databases
    await analyzeDatabase('property_coordinates.db');
    await analyzeDatabase('attica_streets.db');
    await analyzeDatabase('attica_geocoded.db');
    
    // Analyze GeoJSON
    analyzeGeoJSON('attica_streets.geojson');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Analysis complete!\n');
}

analyzeAll().catch(console.error);
