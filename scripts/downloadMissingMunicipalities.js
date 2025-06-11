// Download streets for municipalities that are missing
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// All 66 municipalities of Attica
const atticaMunicipalities = [
    // Central Athens
    'Αθήνα', 'Athens', 'Δάφνη-Υμηττός', 'Φιλαδέλφεια-Χαλκηδόνα', 'Γαλάτσι', 
    'Ηλιούπολη', 'Καισαριανή', 'Βύρωνας', 'Ζωγράφου',
    
    // South Athens
    'Άγιος Δημήτριος', 'Άλιμος', 'Ελληνικό-Αργυρούπολη', 'Γλυφάδα', 
    'Καλλιθέα', 'Μοσχάτο-Ταύρος', 'Νέα Σμύρνη', 'Παλαιό Φάληρο',
    
    // North Athens
    'Αγία Παρασκευή', 'Αμαρούσιο', 'Μαρούσι', 'Χαλάνδρι', 'Φιλοθέη-Ψυχικό',
    'Ηράκλειο', 'Κηφισιά', 'Λυκόβρυση-Πεύκη', 'Μεταμόρφωση', 'Νέα Ιωνία',
    'Παπάγου-Χολαργός', 'Πεντέλη', 'Βριλήσσια',
    
    // West Athens
    'Άγιοι Ανάργυροι-Καματερό', 'Χαϊδάρι', 'Αιγάλεω', 'Ίλιον', 
    'Περιστέρι', 'Πετρούπολη', 'Αγία Βαρβάρα',
    
    // Piraeus
    'Πειραιάς', 'Κερατσίνι-Δραπετσώνα', 'Κορυδαλλός', 
    'Νίκαια-Άγιος Ιωάννης Ρέντης', 'Πέραμα',
    
    // East Attica
    'Αχαρνές', 'Ασπρόπυργος', 'Διόνυσος', 'Κρωπία', 'Λαυρεωτική',
    'Μαραθώνας', 'Μαρκόπουλο Μεσογαίας', 'Ωρωπός', 'Παλλήνη',
    'Ραφήνα-Πικέρμι', 'Σαρωνικός', 'Σπάτα-Άρτεμις', 'Παιανία',
    
    // West Attica
    'Ελευσίνα', 'Φυλή', 'Μάνδρα-Ειδυλλία', 'Μέγαρα',
    
    // Islands
    'Αίγινα', 'Αγκίστρι', 'Κύθηρα', 'Πόρος', 'Σαλαμίνα', 
    'Σπέτσες', 'Τροιζηνία-Μέθανα', 'Ύδρα'
];

console.log('🔍 CHECKING MISSING MUNICIPALITIES\n');

async function checkMissing() {
    const db = new sqlite3.Database('./attica_streets.db', sqlite3.OPEN_READONLY);
    
    // Get existing municipalities
    db.all(`
        SELECT DISTINCT municipality, COUNT(*) as count 
        FROM attica_streets 
        WHERE municipality != 'Unknown'
        GROUP BY municipality
        ORDER BY count DESC
    `, async (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        
        const existing = new Set(rows.map(r => r.municipality));
        console.log(`📊 Found ${existing.size} municipalities with data:\n`);
        
        rows.forEach(row => {
            console.log(`   ${row.municipality}: ${row.count} streets`);
        });
        
        // Find missing
        const missing = atticaMunicipalities.filter(m => !existing.has(m));
        
        console.log(`\n❌ Missing ${missing.length} municipalities:`);
        missing.forEach(m => console.log(`   - ${m}`));
        
        db.close();
        
        // Create download script for missing
        if (missing.length > 0) {
            createDownloadScript(missing);
        }
    });
}

function createDownloadScript(municipalities) {
    const queries = municipalities.map(municipality => {
        return `
// Query for ${municipality}
area["name"="${municipality}"]["admin_level"~"[7-9]"]->.municipality;
(
  way["highway"]["name"](area.municipality);
);
out geom;`;
    });
    
    const script = `// Download missing municipalities
// Run each query separately in https://overpass-turbo.eu/

${queries.join('\n\n')}

// Or use this combined query (may timeout):
[out:json][timeout:600];
(
${municipalities.map(m => `  area["name"="${m}"]["admin_level"~"[7-9]"]->.${m.replace(/[\s-]/g, '_')};`).join('\n')}
);
(
${municipalities.map(m => `  way["highway"]["name"](area.${m.replace(/[\s-]/g, '_')});`).join('\n')}
);
out geom;
`;
    
    fs.writeFileSync('./download_missing_municipalities.txt', script);
    console.log('\n📝 Created download_missing_municipalities.txt');
    console.log('   Use these queries in https://overpass-turbo.eu/');
}

checkMissing();
