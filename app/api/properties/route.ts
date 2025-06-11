// API endpoint για properties
import { NextRequest, NextResponse } from 'next/server';
import { propertyService } from '@/lib/propertyDataService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Filters
    const area = searchParams.get('area') || undefined;
    const type = searchParams.get('type') as 'sale' | 'rent' | undefined;
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;
    const minSqm = searchParams.get('minSqm') ? parseInt(searchParams.get('minSqm')!) : undefined;
    const maxSqm = searchParams.get('maxSqm') ? parseInt(searchParams.get('maxSqm')!) : undefined;
    const bedrooms = searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined;
    const searchText = searchParams.get('search') || undefined;
    
    // Map bounds
    const bounds = searchParams.get('bounds');
    
    let properties;
    
    if (bounds) {
      // Αν έχουμε bounds από το χάρτη
      const [south, west, north, east] = bounds.split(',').map(Number);
      properties = propertyService.getPropertiesInBounds({ north, south, east, west });
    } else if (area || type || minPrice || maxPrice || minSqm || maxSqm || bedrooms || searchText) {
      // Αν έχουμε filters
      properties = propertyService.searchProperties({
        area,
        type,
        minPrice,
        maxPrice,
        minSqm,
        maxSqm,
        bedrooms,
        searchText
      });
    } else {
      // Default: με pagination
      const result = propertyService.getProperties(page, limit);
      return NextResponse.json(result);
    }
    
    // Pagination για filtered results
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProperties = properties.slice(start, end);
    
    return NextResponse.json({
      properties: paginatedProperties,
      total: properties.length,
      pages: Math.ceil(properties.length / limit)
    });
  } catch (error) {
    console.error('Properties API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
