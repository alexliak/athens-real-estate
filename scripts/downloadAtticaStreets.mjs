// Complete Attica street downloader from OpenStreetMap
// This script downloads ALL streets in Attica region and geocodes them

import fetch from 'node-fetch';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import osmtogeojson from 'osmtogeojson';

// Overpass API query for ALL streets in Attica
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Query to get ALL streets in Attica region
// Using OSM relation ID 4477553 for Attica
const atticaQuery = `
[out:json][timeout:300];
// Get Attica region
area(3604477553)->.attica;
// Get all ways with highway tag (streets, roads, etc.) in Attica
(
  way["highway"]["name"](area.attica);
);
out geom;
`;

console.log('🌍 Downloading ALL streets in Attica from OpenStreetMap...');
console.log('⚠️  This will take several minutes due to the large dataset...\n');

async function downloadAtticaStreets() {
    try {
        // Make request to Overpass API
        console.log('📡 Querying Overpass API...');
        const response = await fetch(OVERPASS_API, {
            method: 'POST',
            body: atticaQuery,
            headers: {
                'Content-Type': 'text/plain'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('✅ Response received, parsing data...');
        const data = await response.json();
        
        // Convert OSM data to GeoJSON
        const geojson = osmtogeojson(data);
        
        console.log(`📊 Found ${geojson.features.length} streets in Attica!`);
        
        // Save raw GeoJSON
        fs.writeFileSync('./attica_streets.geojson', JSON.stringify(geojson, null, 2));
        console.log('💾 Saved raw data to attica_streets.geojson');
        
        // Extract unique streets with municipalities
        const streets = extractStreets(geojson);
        console.log(`🏛️ Extracted ${streets.length} unique streets across ${new Set(streets.map(s => s.municipality)).size} municipalities`);
        
        // Save to database
        await saveToDatabase(streets);
        
        // Generate statistics
        generateStatistics(streets);
        
    } catch (error) {
        console.error('❌ Error downloading streets:', error);
    }
}

function extractStreets(geojson) {
    const streets = [];
    const uniqueStreets = new Set();
    
    geojson.features.forEach(feature => {
        const props = feature.properties;
        if (!props.name) return;
        
        // Extract municipality from various OSM tags
        const municipality = props['addr:city'] || 
                           props['addr:municipality'] || 
                           props['is_in:municipality'] ||
                           props['is_in'] ||
                           'Unknown';
        
        // Get street type
        const streetType = props.highway || 'unknown';
        
        // Create unique key
        const key = `${props.name}|${municipality}`;
        
        if (!uniqueStreets.has(key)) {
            uniqueStreets.add(key);
            
            // Calculate center point
            let centerLat, centerLng;
            if (feature.geometry.type === 'LineString') {
                const coords = feature.geometry.coordinates;
                const midIndex = Math.floor(coords.length / 2);
                [centerLng, centerLat] = coords[midIndex];
            } else if (feature.geometry.type === 'Point') {
                [centerLng, centerLat] = feature.geometry.coordinates;
            }
            
            streets.push({
                name: props.name,
                nameEn: props['name:en'] || props.name,
                municipality: municipality,
                streetType: streetType,
                postalCode: props['addr:postcode'] || null,
                lat: centerLat,
                lng: centerLng,
                osmId: feature.id
            });
        }
    });
    
    return streets;
}

async function saveToDatabase(streets) {
    console.log('\n💾 Saving to database...');
    
    const db = await open({
        filename: './attica_streets.db',
        driver: sqlite3.Database
    });

    // Create comprehensive table
    await db.exec(`
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
        );

        CREATE INDEX IF NOT EXISTS idx_name ON attica_streets(name);
        CREATE INDEX IF NOT EXISTS idx_municipality ON attica_streets(municipality);
        CREATE INDEX IF NOT EXISTS idx_coords ON attica_streets(lat, lng);
    `);

    // Insert streets
    const stmt = await db.prepare(`
        INSERT OR IGNORE INTO attica_streets 
        (name, name_en, municipality, street_type, postal_code, lat, lng, osm_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let count = 0;
    for (const street of streets) {
        await stmt.run(
            street.name,
            street.nameEn,
            street.municipality,
            street.streetType,
            street.postalCode,
            street.lat,
            street.lng,
            street.osmId
        );
        count++;
        if (count % 100 === 0) {
            console.log(`  Processed ${count}/${streets.length} streets...`);
        }
    }

    await stmt.finalize();
    await db.close();
    
    console.log(`✅ Saved ${count} streets to database!`);
}

function generateStatistics(streets) {
    console.log('\n📊 ATTICA STREETS STATISTICS:');
    console.log('================================');
    
    // Municipality counts
    const municipalityCounts = {};
    streets.forEach(street => {
        municipalityCounts[street.municipality] = (municipalityCounts[street.municipality] || 0) + 1;
    });
    
    // Sort by count
    const sorted = Object.entries(municipalityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);
    
    console.log('\nTop 20 Municipalities by Street Count:');
    sorted.forEach(([municipality, count]) => {
        console.log(`  ${municipality}: ${count} streets`);
    });
    
    // Street type statistics
    const typeCounts = {};
    streets.forEach(street => {
        typeCounts[street.streetType] = (typeCounts[street.streetType] || 0) + 1;
    });
    
    console.log('\nStreet Types:');
    Object.entries(typeCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([type, count]) => {
            console.log(`  ${type}: ${count}`);
        });
    
    console.log('\n🎉 COMPLETE! You now have ALL Attica streets in your database!');
}

// Alternative: Direct download from Geofabrik
async function downloadFromGeofabrik() {
    console.log('\n📦 Alternative: Download from Geofabrik...');
    console.log('Download Greece shapefile: https://download.geofabrik.de/europe/greece-latest-free.shp.zip');
    console.log('Then filter for Attica region using QGIS or similar GIS software');
}

// Run the download
downloadAtticaStreets().catch(console.error);
