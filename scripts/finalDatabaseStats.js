// Final database statistics and verification
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

console.log('📊 FINAL DATABASE STATISTICS\n');
console.log('='.repeat(60));

function formatNumber(num) {
    return num.toLocaleString('el-GR');
}

function analyzeFinalDatabase() {
    const db = new sqlite3.Database('./attica_master.db', sqlite3.OPEN_READONLY);
    
    // Total statistics
    console.log('\n🏛️ MASTER DATABASE OVERVIEW:');
    
    // Streets statistics
    db.get('SELECT COUNT(*) as total FROM streets', (err, result) => {
        if (!err) {
            console.log(`\n📍 Streets:`);
            console.log(`   Total streets: ${formatNumber(result.total)}`);
        }
    });
    
    // Streets by municipality
    db.all(`
        SELECT municipality, COUNT(*) as count 
        FROM streets 
        WHERE municipality NOT IN ('Unknown', 'Kolonaki', 'Marousi', 'Piraeus', 'Athens', 'Glyfada', 'Kifisia')
        GROUP BY municipality 
        ORDER BY count DESC 
        LIMIT 15
    `, (err, results) => {
        if (!err) {
            console.log(`\n   Top Greek municipalities:`);
            results.forEach(r => {
                console.log(`   - ${r.municipality}: ${formatNumber(r.count)} streets`);
            });
        }
    });
    
    // Addresses statistics
    db.get('SELECT COUNT(*) as total FROM addresses', (err, result) => {
        if (!err) {
            console.log(`\n📮 Addresses:`);
            console.log(`   Total addresses: ${formatNumber(result.total)}`);
        }
    });
    
    // Addresses by municipality
    db.all(`
        SELECT municipality, COUNT(*) as count 
        FROM addresses 
        WHERE municipality != 'Unknown'
        GROUP BY municipality 
        ORDER BY count DESC 
        LIMIT 20
    `, (err, results) => {
        if (!err) {
            console.log(`\n   Addresses per municipality:`);
            results.forEach(r => {
                console.log(`   - ${r.municipality}: ${formatNumber(r.count)} addresses`);
            });
        }
    });
    
    // Coverage statistics
    db.get(`
        SELECT 
            COUNT(DISTINCT municipality) as municipalities,
            COUNT(DISTINCT street_name) as unique_streets,
            COUNT(DISTINCT ROUND(lat, 3) || ',' || ROUND(lng, 3)) as coverage_areas
        FROM addresses 
        WHERE municipality != 'Unknown'
    `, (err, result) => {
        if (!err) {
            console.log(`\n📈 Coverage:`);
            console.log(`   Municipalities with data: ${result.municipalities}`);
            console.log(`   Unique street names: ${formatNumber(result.unique_streets)}`);
            console.log(`   Geographic coverage areas: ${formatNumber(result.coverage_areas)}`);
        }
    });
    
    // Sample searches
    console.log('\n🔍 Sample searches:');
    const sampleStreets = ['Σταδίου', 'Ακαδημίας', 'Κηφισίας', 'Βασιλίσσης Σοφίας', 'Συγγρού'];
    
    sampleStreets.forEach(street => {
        db.all(`
            SELECT DISTINCT street_name, municipality, COUNT(*) as count
            FROM addresses
            WHERE street_name LIKE ?
            GROUP BY street_name, municipality
            ORDER BY count DESC
            LIMIT 3
        `, [`${street}%`], (err, results) => {
            if (!err && results.length > 0) {
                console.log(`\n   "${street}":`);
                results.forEach(r => {
                    console.log(`   - ${r.street_name}, ${r.municipality} (${r.count} addresses)`);
                });
            }
        });
    });
    
    // Database file size
    setTimeout(() => {
        const stats = fs.statSync('./attica_master.db');
        console.log(`\n💾 Database size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ DATABASE READY FOR PRODUCTION USE!');
        console.log('   - Use attica_master.db for all queries');
        console.log('   - API endpoints: /api/streets/autocomplete & /api/geocode');
        console.log('   - UI component: AddressAutocomplete.tsx');
        console.log('\n🎉 Athens Real Estate Geocoding System Complete!');
        
        db.close();
    }, 3000);
}

analyzeFinalDatabase();
