// scripts/testGeocoding.ts
// Simple test to verify geocoding works

async function testGeocoding() {
    console.log('Testing Nominatim geocoding...\n');
    
    const fetch = (await import('node-fetch')).default;
    
    // Test addresses
    const testAddresses = [
        'Τσακάλωφ 23, Κολωνάκι, Αθήνα, Ελλάδα',
        'Γούναρη 45, Γλυφάδα, Αθήνα, Ελλάδα',
        'Παναγή Τσαλδάρη 100, Περιστέρι, Αθήνα, Ελλάδα',
    ];
    
    for (const address of testAddresses) {
        console.log(`Testing: ${address}`);
        
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=gr&limit=1`;
        
        try {
            const response = await fetch(url, {
                headers: { 'User-Agent': 'RealEstateAthens/1.0' }
            });
            
            const data = await response.json() as any[];
            
            if (data && data.length > 0) {
                console.log('✓ Found:', {
                    lat: data[0].lat,
                    lng: data[0].lon,
                    display_name: data[0].display_name
                });
            } else {
                console.log('✗ No results found');
            }
        } catch (error) {
            console.error('✗ Error:', error);
        }
        
        console.log('---\n');
        
        // Wait 1 second between requests (rate limiting)
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

testGeocoding().then(() => {
    console.log('Test completed!');
}).catch(console.error);
