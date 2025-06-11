// Direct solution to assign municipalities based on coordinates
const sqlite3 = require('sqlite3').verbose();

// Municipality centers with approximate radius
const municipalityData = {
    'Αθήνα': { center: { lat: 37.9838, lng: 23.7275 }, radius: 0.04 },
    'Κολωνάκι': { center: { lat: 37.9799, lng: 23.7444 }, radius: 0.015 },
    'Γλυφάδα': { center: { lat: 37.8586, lng: 23.7529 }, radius: 0.03 },
    'Μαρούσι': { center: { lat: 38.0495, lng: 23.8054 }, radius: 0.025 },
    'Κηφισιά': { center: { lat: 38.0736, lng: 23.8103 }, radius: 0.03 },
    'Πειραιάς': { center: { lat: 37.9483, lng: 23.6433 }, radius: 0.025 },
    'Καλλιθέα': { center: { lat: 37.9603, lng: 23.6968 }, radius: 0.02 },
    'Νέα Σμύρνη': { center: { lat: 37.9470, lng: 23.7138 }, radius: 0.02 },
    'Παλαιό Φάληρο': { center: { lat: 37.9283, lng: 23.7019 }, radius: 0.025 },
    'Άλιμος': { center: { lat: 37.9104, lng: 23.7267 }, radius: 0.025 },
    'Βούλα': { center: { lat: 37.8462, lng: 23.7837 }, radius: 0.025 },
    'Βουλιαγμένη': { center: { lat: 37.8107, lng: 23.7831 }, radius: 0.02 },
    'Χαλάνδρι': { center: { lat: 38.0211, lng: 23.8001 }, radius: 0.025 },
    'Αγία Παρασκευή': { center: { lat: 37.9951, lng: 23.8180 }, radius: 0.02 },
    'Περιστέρι': { center: { lat: 38.0133, lng: 23.6915 }, radius: 0.03 },
    'Πετρούπολη': { center: { lat: 38.0417, lng: 23.6850 }, radius: 0.02 },
    'Ηλιούπολη': { center: { lat: 37.9316, lng: 23.7588 }, radius: 0.025 },
    'Βύρωνας': { center: { lat: 37.9616, lng: 23.7633 }, radius: 0.02 },
    'Ζωγράφου': { center: { lat: 37.9761, lng: 23.7686 }, radius: 0.02 },
    'Παγκράτι': { center: { lat: 37.9681, lng: 23.7520 }, radius: 0.02 },
    'Εξάρχεια': { center: { lat: 37.9861, lng: 23.7341 }, radius: 0.015 },
    'Κουκάκι': { center: { lat: 37.9625, lng: 23.7279 }, radius: 0.015 },
    'Αιγάλεω': { center: { lat: 37.9929, lng: 23.6823 }, radius: 0.025 },
    'Ψυχικό': { center: { lat: 37.9970, lng: 23.7731 }, radius: 0.02 },
    'Φιλοθέη': { center: { lat: 38.0042, lng: 23.7811 }, radius: 0.02 },
    'Νέα Ιωνία': { center: { lat: 38.0347, lng: 23.7579 }, radius: 0.025 },
    'Ελληνικό': { center: { lat: 37.8848, lng: 23.7441 }, radius: 0.025 },
    'Αργυρούπολη': { center: { lat: 37.9057, lng: 23.7505 }, radius: 0.02 },
    'Βριλήσσια': { center: { lat: 38.0343, lng: 23.8298 }, radius: 0.02 },
    'Μελίσσια': { center: { lat: 38.0500, lng: 23.8333 }, radius: 0.02 },
    'Πεντέλη': { center: { lat: 38.0520, lng: 23.8656 }, radius: 0.025 },
    'Χολαργός': { center: { lat: 38.0042, lng: 23.7976 }, radius: 0.015 },
    'Αμπελόκηποι': { center: { lat: 37.9875, lng: 23.7570 }, radius: 0.015 },
    'Γαλάτσι': { center: { lat: 38.0133, lng: 23.7490 }, radius: 0.02 },
    'Κυψέλη': { center: { lat: 37.9938, lng: 23.7395 }, radius: 0.015 },
    'Πλάκα': { center: { lat: 37.9725, lng: 23.7293 }, radius: 0.01 },
    'Ψυρρή': { center: { lat: 37.9779, lng: 23.7230 }, radius: 0.01 },
    'Μοναστηράκι': { center: { lat: 37.9760, lng: 23.7254 }, radius: 0.01 },
    'Θησείο': { center: { lat: 37.9773, lng: 23.7185 }, radius: 0.01 },
    'Κεραμεικός': { center: { lat: 37.9785, lng: 23.7108 }, radius: 0.01 },
    'Γκάζι': { center: { lat: 37.9778, lng: 23.7141 }, radius: 0.01 },
    'Μεταξουργείο': { center: { lat: 37.9863, lng: 23.7210 }, radius: 0.01 }
};

// Function to calculate distance between two points
function calculateDistance(lat1, lng1, lat2, lng2) {
    const dLat = Math.abs(lat1 - lat2);
    const dLng = Math.abs(lng1 - lng2);
    return Math.sqrt(dLat * dLat + dLng * dLng);
}

// Function to find closest municipality
function findClosestMunicipality(lat, lng) {
    let closestMunicipality = 'Unknown';
    let minDistance = Infinity;
    
    for (const [name, data] of Object.entries(municipalityData)) {
        const distance = calculateDistance(lat, lng, data.center.lat, data.center.lng);
        
        // Check if within radius
        if (distance <= data.radius && distance < minDistance) {
            minDistance = distance;
            closestMunicipality = name;
        }
    }
    
    // If no municipality within radius, find absolute closest
    if (closestMunicipality === 'Unknown') {
        for (const [name, data] of Object.entries(municipalityData)) {
            const distance = calculateDistance(lat, lng, data.center.lat, data.center.lng);
            if (distance < minDistance) {
                minDistance = distance;
                closestMunicipality = name;
            }
        }
    }
    
    return closestMunicipality;
}

console.log('🔧 FIXING MUNICIPALITY ASSIGNMENTS\n');

// Update streets database
const streetsDb = new sqlite3.Database('./attica_streets.db');

// First, count unknown streets
streetsDb.get('SELECT COUNT(*) as count FROM attica_streets WHERE municipality = "Unknown"', (err, result) => {
    if (err) {
        console.error(err);
        return;
    }
    
    console.log(`Found ${result.count} streets with Unknown municipality`);
    console.log('Updating...\n');
    
    // Get all unknown streets
    streetsDb.all(`
        SELECT id, name, lat, lng 
        FROM attica_streets 
        WHERE municipality = 'Unknown' AND lat IS NOT NULL AND lng IS NOT NULL
    `, (err, streets) => {
        if (err) {
            console.error(err);
            return;
        }
        
        let updated = 0;
        const stmt = streetsDb.prepare('UPDATE attica_streets SET municipality = ? WHERE id = ?');
        
        streets.forEach((street, index) => {
            const municipality = findClosestMunicipality(street.lat, street.lng);
            
            if (municipality !== 'Unknown') {
                stmt.run(municipality, street.id);
                updated++;
                
                if (updated % 100 === 0) {
                    console.log(`Updated ${updated} streets...`);
                }
            }
        });
        
        stmt.finalize(() => {
            console.log(`\n✅ Updated ${updated} streets with municipality data`);
            
            // Show new statistics
            streetsDb.all(`
                SELECT municipality, COUNT(*) as count 
                FROM attica_streets 
                GROUP BY municipality 
                ORDER BY count DESC
                LIMIT 25
            `, (err, results) => {
                if (!err) {
                    console.log('\n📊 New municipality distribution:');
                    results.forEach(r => {
                        console.log(`   ${r.municipality}: ${r.count} streets`);
                    });
                }
                
                // Also update addresses database
                updateAddressesDatabase();
            });
        });
    });
});

// Update addresses database
function updateAddressesDatabase() {
    console.log('\n🔧 Updating addresses database...');
    
    const addressDb = new sqlite3.Database('./attica_geocoded.db');
    
    addressDb.all(`
        SELECT id, street_name, lat, lng 
        FROM attica_addresses 
        WHERE municipality = 'Unknown' OR municipality IS NULL
        LIMIT 50000
    `, (err, addresses) => {
        if (err) {
            console.error(err);
            return;
        }
        
        console.log(`Found ${addresses.length} addresses to update`);
        
        let updated = 0;
        const stmt = addressDb.prepare('UPDATE attica_addresses SET municipality = ? WHERE id = ?');
        
        addresses.forEach(address => {
            const municipality = findClosestMunicipality(address.lat, address.lng);
            
            if (municipality !== 'Unknown') {
                stmt.run(municipality, address.id);
                updated++;
                
                if (updated % 1000 === 0) {
                    console.log(`Updated ${updated} addresses...`);
                }
            }
        });
        
        stmt.finalize(() => {
            console.log(`\n✅ Updated ${updated} addresses with municipality data`);
            
            addressDb.all(`
                SELECT municipality, COUNT(*) as count 
                FROM attica_addresses 
                WHERE municipality != 'Unknown'
                GROUP BY municipality 
                ORDER BY count DESC
                LIMIT 25
            `, (err, results) => {
                if (!err) {
                    console.log('\n📊 Address municipality distribution:');
                    results.forEach(r => {
                        console.log(`   ${r.municipality}: ${r.count} addresses`);
                    });
                }
                
                addressDb.close();
                streetsDb.close();
                
                console.log('\n🎉 Municipality assignment complete!');
                console.log('   Run consolidateDatabases.js to update master database');
            });
        });
    });
}
