// Service για διαχείριση property data με πραγματικές διευθύνσεις
// Import the properties with real addresses
let propertiesData: any[] = [];
try {
  propertiesData = require('../data/properties-real-addresses.json');
} catch (error) {
  console.warn('Properties file not found, using empty array');
}

export interface Property {
  id: string;
  title: string;
  price: number;
  location: {
    address: string;
    street: string;
    streetNumber: number;
    area: string;
    areaGr: string;
    lat: number;
    lng: number;
    fullAddress: string;
  };
  details: {
    type: 'sale' | 'rent';
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    sqm: number;
    floor: string;
    yearBuilt: number;
    condition: string;
  };
  features: string[];
  images: string[];
  description: string;
  agent: {
    name: string;
    phone: string;
    email: string;
  };
  createdAt: string;
  views: number;
  isFeatured: boolean;
}

class PropertyDataService {
  private properties: Property[] = propertiesData as Property[];

  // Πάρε όλα τα ακίνητα
  getAllProperties(): Property[] {
    return this.properties;
  }

  // Πάρε ακίνητα με pagination
  getProperties(page: number = 1, limit: number = 20): {
    properties: Property[];
    total: number;
    pages: number;
  } {
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      properties: this.properties.slice(start, end),
      total: this.properties.length,
      pages: Math.ceil(this.properties.length / limit)
    };
  }

  // Αναζήτηση και φιλτράρισμα
  searchProperties(filters: {
    area?: string;
    type?: 'sale' | 'rent';
    minPrice?: number;
    maxPrice?: number;
    minSqm?: number;
    maxSqm?: number;
    bedrooms?: number;
    searchText?: string;
  }): Property[] {
    return this.properties.filter(property => {
      // Φίλτρο περιοχής
      if (filters.area && property.location.area !== filters.area) {
        return false;
      }

      // Φίλτρο τύπου
      if (filters.type && property.details.type !== filters.type) {
        return false;
      }

      // Φίλτρο τιμής
      if (filters.minPrice && property.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && property.price > filters.maxPrice) {
        return false;
      }

      // Φίλτρο τετραγωνικών
      if (filters.minSqm && property.details.sqm < filters.minSqm) {
        return false;
      }
      if (filters.maxSqm && property.details.sqm > filters.maxSqm) {
        return false;
      }

      // Φίλτρο υπνοδωματίων
      if (filters.bedrooms && property.details.bedrooms < filters.bedrooms) {
        return false;
      }

      // Αναζήτηση κειμένου
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        return (
          property.title.toLowerCase().includes(searchLower) ||
          property.description.toLowerCase().includes(searchLower) ||
          property.location.address.toLowerCase().includes(searchLower) ||
          property.location.area.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }

  // Πάρε ακίνητα σε συγκεκριμένη περιοχή του χάρτη
  getPropertiesInBounds(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): Property[] {
    return this.properties.filter(property => {
      const { lat, lng } = property.location;
      return (
        lat >= bounds.south &&
        lat <= bounds.north &&
        lng >= bounds.west &&
        lng <= bounds.east
      );
    });
  }

  // Πάρε ένα ακίνητο με ID
  getPropertyById(id: string): Property | undefined {
    return this.properties.find(p => p.id === id);
  }

  // Πάρε featured ακίνητα
  getFeaturedProperties(limit: number = 6): Property[] {
    return this.properties
      .filter(p => p.isFeatured)
      .slice(0, limit);
  }

  // Πάρε πρόσφατα ακίνητα
  getRecentProperties(limit: number = 10): Property[] {
    return [...this.properties]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Στατιστικά ανά περιοχή
  getAreaStatistics(): Record<string, {
    total: number;
    avgPrice: number;
    avgSqm: number;
    forSale: number;
    forRent: number;
  }> {
    const stats: Record<string, any> = {};

    this.properties.forEach(property => {
      const area = property.location.area;
      if (!stats[area]) {
        stats[area] = {
          total: 0,
          totalPrice: 0,
          totalSqm: 0,
          forSale: 0,
          forRent: 0
        };
      }

      stats[area].total++;
      stats[area].totalPrice += property.price;
      stats[area].totalSqm += property.details.sqm;
      
      if (property.details.type === 'sale') {
        stats[area].forSale++;
      } else {
        stats[area].forRent++;
      }
    });

    // Υπολογισμός μέσων όρων
    Object.keys(stats).forEach(area => {
      const areaStats = stats[area];
      stats[area] = {
        total: areaStats.total,
        avgPrice: Math.round(areaStats.totalPrice / areaStats.total),
        avgSqm: Math.round(areaStats.totalSqm / areaStats.total),
        forSale: areaStats.forSale,
        forRent: areaStats.forRent
      };
    });

    return stats;
  }

  // Πάρε όλες τις μοναδικές περιοχές
  getAreas(): string[] {
    return [...new Set(this.properties.map(p => p.location.area))].sort();
  }
}

// Singleton instance
export const propertyService = new PropertyDataService();
