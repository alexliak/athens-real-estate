// Test the address search functionality
const sqlite3 = require('sqlite3').verbose();

console.log('🔍 TESTING ADDRESS SEARCH\n');

// Test queries
const testQueries = [
    'Σταδίου',
    'Ακαδημίας',
    'Κηφισίας',
    'Βασιλίσσης Σοφίας',
    'Ομήρου',
    'Πανεπιστημίου'
];

function searchStreets(query) {
    const db = new sqlite3.Database('./attica_geocoded.db', sqlite3.OPEN_READONLY);
    
    console.log(`\n🔍 Searching for: "${query}"`);
    
    db.all(`
        SELECT DISTINCT street_name, municipality, COUNT(*) as address_count
        FROM attica_addresses 
        WHERE street_name LIKE ? 
        GROUP BY street_name, municipality
        ORDER BY address_count DESC
        LIMIT 10
    `, [`${query}%`], (err, results) => {
        if (err) {
            console.error(err);
            db.close();
            return;
        }
        
        if (results.length === 0) {
            console.log('   No results found');
        } else {
            console.log(`   Found ${results.length} streets:`);
            results.forEach(r => {
                console.log(`   - ${r.street_name}, ${r.municipality} (${r.address_count} addresses)`);
            });
        }
        
        db.close();
    });
}

// Test autocomplete functionality
function testAutocomplete() {
    console.log('📝 Testing autocomplete functionality...\n');
    
    testQueries.forEach((query, index) => {
        setTimeout(() => {
            searchStreets(query);
        }, index * 500);
    });
    
    // Show sample addresses with coordinates
    setTimeout(() => {
        console.log('\n📍 Sample addresses with coordinates:');
        
        const db = new sqlite3.Database('./attica_geocoded.db', sqlite3.OPEN_READONLY);
        
        db.all(`
            SELECT street_name, street_number, municipality, lat, lng
            FROM attica_addresses
            WHERE municipality != 'Unknown'
            ORDER BY RANDOM()
            LIMIT 10
        `, (err, results) => {
            if (!err && results) {
                results.forEach(r => {
                    console.log(`\n   ${r.street_name} ${r.street_number}, ${r.municipality}`);
                    console.log(`   📍 ${r.lat}, ${r.lng}`);
                    console.log(`   🗺️  https://www.google.com/maps?q=${r.lat},${r.lng}`);
                });
            }
            db.close();
        });
    }, 3500);
}

testAutocomplete();
