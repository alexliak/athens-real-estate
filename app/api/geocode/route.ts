import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const street = searchParams.get('street');
        const number = searchParams.get('number');
        const municipality = searchParams.get('municipality');
        
        if (!street || !number) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }
        
        // Use master database
        const dbPath = path.join(process.cwd(), 'attica_master.db');
        const db = new Database(dbPath, { readonly: true });
        
        // Query for exact match
        let result = db.prepare(`
            SELECT lat, lng, confidence FROM addresses 
            WHERE street_name = ? AND street_number = ?
            ${municipality ? 'AND municipality = ?' : ''}
        `).get(
            street, 
            parseInt(number),
            ...(municipality ? [municipality] : [])
        ) as { lat: number; lng: number; confidence: number } | undefined;
        
        // If no exact match, try interpolation
        if (!result) {
            const nearby = db.prepare(`
                SELECT street_number, lat, lng 
                FROM addresses 
                WHERE street_name = ? 
                ${municipality ? 'AND municipality = ?' : ''}
                ORDER BY ABS(street_number - ?)
                LIMIT 2
            `).all(
                street,
                ...(municipality ? [municipality] : []),
                parseInt(number)
            ) as Array<{ street_number: number; lat: number; lng: number }>;
            
            if (nearby.length >= 2) {
                // Interpolate between two nearest numbers
                const [p1, p2] = nearby;
                const ratio = (parseInt(number) - p1.street_number) / (p2.street_number - p1.street_number);
                
                result = {
                    lat: p1.lat + (p2.lat - p1.lat) * ratio,
                    lng: p1.lng + (p2.lng - p1.lng) * ratio,
                    confidence: 0.7
                };
            } else if (nearby.length === 1) {
                // Use nearest with offset
                const offset = (parseInt(number) - nearby[0].street_number) * 0.00001;
                result = {
                    lat: nearby[0].lat + offset,
                    lng: nearby[0].lng + offset,
                    confidence: 0.5
                };
            }
        }
        
        db.close();
        
        if (result) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json({ error: 'Address not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}