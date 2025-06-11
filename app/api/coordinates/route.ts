// API endpoint to fetch coordinates from database (server-side only)
import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const street = searchParams.get('street');
        const number = searchParams.get('number');
        const area = searchParams.get('area');
        
        if (!street || !number || !area) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }
        
        // Open database (server-side only)
        const dbPath = path.join(process.cwd(), 'property_coordinates.db');
        const db = new Database(dbPath, { readonly: true });
        
        // Query for exact match
        const stmt = db.prepare(`
            SELECT lat, lng FROM property_coordinates 
            WHERE street = ? AND number = ? AND area = ?
        `);
        
        const result = stmt.get(street, parseInt(number), area) as { lat: number; lng: number } | undefined;
        
        db.close();
        
        if (result) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json({ error: 'Coordinates not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
