import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const municipality = searchParams.get('municipality');
        
        if (!query || query.length < 2) {
            return NextResponse.json([]);
        }
        
        // Use master database
        const dbPath = path.join(process.cwd(), 'attica_master.db');
        const db = new Database(dbPath, { readonly: true });
        
        // Search for streets
        let sql = `
            SELECT DISTINCT street_name, municipality, COUNT(*) as count
            FROM addresses 
            WHERE street_name LIKE ?
            AND municipality != 'Unknown'
        `;
        
        const params: any[] = [`${query}%`];
        
        if (municipality) {
            sql += ' AND municipality = ?';
            params.push(municipality);
        }
        
        sql += ' GROUP BY street_name, municipality ORDER BY count DESC LIMIT 20';
        
        const stmt = db.prepare(sql);
        const results = stmt.all(...params);
        
        db.close();
        
        return NextResponse.json(results);
    } catch (error) {
        console.error('Autocomplete error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}