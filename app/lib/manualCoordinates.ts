// Manual coordinates for major Athens streets
// Based on real geocoding results

export const manualStreetCoordinates: { [area: string]: { [street: string]: { lat: number; lng: number } } } = {
  'Kolonaki': {
    'Σκουφά': { lat: 37.9809353, lng: 23.737804 }, // Real coordinates from geocoding
    'Τσακάλωφ': { lat: 37.9792549, lng: 23.7396485 }, // Real coordinates from geocoding
    'Πατριάρχου Ιωακείμ': { lat: 37.9782198, lng: 23.7453195 }, // Real coordinates from geocoding
    'Κανάρη': { lat: 37.9790, lng: 23.7428 },
    'Λουκιανού': { lat: 37.9785, lng: 23.7415 },
    'Δεινοκράτους': { lat: 37.9795, lng: 23.7435 },
    'Αναγνωστοπούλου': { lat: 37.9788, lng: 23.7425 },
    'Ηροδότου': { lat: 37.9780, lng: 23.7420 },
    'Πλουτάρχου': { lat: 37.9775, lng: 23.7410 },
    'Σόλωνος': { lat: 37.9770, lng: 23.7405 },
  },
  'Glyfada': {
    'Γούναρη': { lat: 37.8645, lng: 23.7547 },
    'Λαζαράκη': { lat: 37.8690, lng: 23.7560 },
    'Μεταξά': { lat: 37.8612, lng: 23.7525 },
    'Αρτέμιδος': { lat: 37.8625, lng: 23.7538 },
  },
  'Peristeri': {
    'Παναγή Τσαλδάρη': { lat: 38.0165, lng: 23.6880 },
    'Εθνάρχου Μακαρίου': { lat: 38.0145, lng: 23.6895 },
    'Αγίου Βασιλείου': { lat: 38.0122, lng: 23.6910 },
  },
  'Plaka': {
    'Αδριανού': { lat: 37.9743, lng: 23.7296 },
    'Κυδαθηναίων': { lat: 37.9736, lng: 23.7288 },
    'Μητροπόλεως': { lat: 37.9752, lng: 23.7301 },
  },
  'Nea Smyrni': {
    'Ελευθερίου Βενιζέλου': { lat: 37.9445, lng: 23.7120 },
    'Ομήρου': { lat: 37.9460, lng: 23.7135 },
    'Αγίας Φωτεινής': { lat: 37.9475, lng: 23.7145 },
  },
  'Kifisia': {
    'Κασσαβέτη': { lat: 38.0745, lng: 23.8115 },
    'Κολοκοτρώνη': { lat: 38.0738, lng: 23.8108 },
    'Τατοΐου': { lat: 38.0752, lng: 23.8098 },
  },
  'Marousi': {
    'Κηφισίας': { lat: 38.0505, lng: 23.8062 },
    'Βασιλίσσης Σοφίας': { lat: 38.0498, lng: 23.8048 },
    'Αγίου Κωνσταντίνου': { lat: 38.0490, lng: 23.8055 },
  },
  'Palaio Faliro': {
    'Αμφιθέας': { lat: 37.9295, lng: 23.7025 },
    'Ναϊάδων': { lat: 37.9275, lng: 23.7012 },
    'Ποσειδώνος': { lat: 37.9265, lng: 23.6995 },
    'Παλαιών Πατρών Γερμανού': { lat: 37.9285, lng: 23.7018 },
  }
};

// Function to get approximate coordinates for a street
export function getManualCoordinates(street: string, area: string, number: number): { lat: number; lng: number } | null {
  if (manualStreetCoordinates[area] && manualStreetCoordinates[area][street]) {
    const baseCoords = manualStreetCoordinates[area][street];
    
    // Add small offset based on street number
    // This creates a linear distribution along the street
    const offset = (number - 50) * 0.00002; // Small offset per number
    
    return {
      lat: baseCoords.lat + offset * Math.cos(Math.PI/4), // 45 degree angle
      lng: baseCoords.lng + offset * Math.sin(Math.PI/4)
    };
  }
  
  return null;
}
