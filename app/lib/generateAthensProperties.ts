import { Property } from '../components/PropertyCard';
import { getGeocodedCoordinates } from './geocodingService';

// Athens neighborhoods with coordinates and their actual streets
export const athensAreas = [
  // Κεντρικές Περιοχές
  { 
    name: 'Kolonaki', 
    nameGr: 'Κολωνάκι',
    coords: { lat: 37.9799, lng: 23.7444 },
    priceMultiplier: 1.8,
    streets: ['Σκουφά', 'Τσακάλωφ', 'Πατριάρχου Ιωακείμ', 'Κανάρη', 'Λουκιανού', 'Δεινοκράτους', 'Αναγνωστοπούλου', 'Ηροδότου', 'Πλουτάρχου', 'Σόλωνος']
  },
  { 
    name: 'Exarchia', 
    nameGr: 'Εξάρχεια',
    coords: { lat: 37.9861, lng: 23.7341 },
    priceMultiplier: 0.8,
    streets: ['Ναυαρίνου', 'Μεσολογγίου', 'Καλλιδρομίου', 'Τρικούπη', 'Θεμιστοκλέους', 'Μπενάκη', 'Αραχώβης', 'Ζωοδόχου Πηγής', 'Σπ. Τρικούπη', 'Εμμ. Μπενάκη']
  },
  { 
    name: 'Plaka', 
    nameGr: 'Πλάκα',
    coords: { lat: 37.9725, lng: 23.7293 },
    priceMultiplier: 1.5,
    streets: ['Αδριανού', 'Κυδαθηναίων', 'Μητροπόλεως', 'Πανδρόσου', 'Λυσικράτους', 'Βύρωνος', 'Αρεοπαγίτου', 'Τριπόδων', 'Φλέσσα', 'Μνησικλέους']
  },
  { 
    name: 'Psiri', 
    nameGr: 'Ψυρρή',
    coords: { lat: 37.9779, lng: 23.7230 },
    priceMultiplier: 1.0,
    streets: ['Αισχύλου', 'Σαρρή', 'Τάκη', 'Μιαούλη', 'Καραϊσκάκη', 'Ευριπίδου', 'Σοφοκλέους', 'Αριστοφάνους', 'Παλλάδος', 'Αγ. Αναργύρων']
  },
  { 
    name: 'Koukaki', 
    nameGr: 'Κουκάκι',
    coords: { lat: 37.9625, lng: 23.7279 },
    priceMultiplier: 1.1,
    streets: ['Βεΐκου', 'Δημητρακοπούλου', 'Ζίννη', 'Γεωργίου Ολυμπίου', 'Φαλήρου', 'Δράκου', 'Παρθενώνος', 'Προπυλαίων', 'Μισαραλιώτου', 'Ζαχαρίτσα']
  },
  { 
    name: 'Pagrati', 
    nameGr: 'Παγκράτι',
    coords: { lat: 37.9681, lng: 23.7520 },
    priceMultiplier: 1.0,
    streets: ['Υμηττού', 'Σπύρου Μερκούρη', 'Ευτυχίδου', 'Αρχιμήδους', 'Πλατεία Προσκόπων', 'Φρύνης', 'Δαμάρεως', 'Ηρώδου Αττικού', 'Ευφρονίου', 'Αρατού']
  },
  { 
    name: 'Ampelokipoi', 
    nameGr: 'Αμπελόκηποι',
    coords: { lat: 37.9875, lng: 23.7570 },
    priceMultiplier: 1.1,
    streets: ['Λεωφόρος Αλεξάνδρας', 'Πανόρμου', 'Σεβαστουπόλεως', 'Δημητσάνας', 'Λαρίσης', 'Τριπόλεως', 'Κεφαλληνίας', 'Σούτσου', 'Κόνωνος', 'Λυκούργου']
  },
  { 
    name: 'Kypseli', 
    nameGr: 'Κυψέλη',
    coords: { lat: 37.9938, lng: 23.7395 },
    priceMultiplier: 0.7,
    streets: ['Πατησίων', 'Κυψέλης', 'Αγίας Ζώνης', 'Τενέδου', 'Σπετσών', 'Κύπρου', 'Κεφαλονιάς', 'Λέσβου', 'Ιθάκης', 'Δροσοπούλου']
  },
  
  // Νότια Προάστια
  { 
    name: 'Glyfada', 
    nameGr: 'Γλυφάδα',
    coords: { lat: 37.8586, lng: 23.7529 },
    priceMultiplier: 1.6,
    streets: ['Γούναρη', 'Λαζαράκη', 'Μεταξά', 'Αρτέμιδος', 'Γρηγορίου Λαμπράκη', 'Ζησιμοπούλου', 'Κύπρου', 'Ανθέων', 'Βασιλέως Γεωργίου', 'Παλαιολόγου']
  },
  { 
    name: 'Voula', 
    nameGr: 'Βούλα',
    coords: { lat: 37.8462, lng: 23.7837 },
    priceMultiplier: 1.7,
    streets: ['Βασιλέως Παύλου', 'Ηρακλείτου', 'Σωκράτους', 'Δημοκρίτου', 'Ιάσονος', 'Οδυσσέως', 'Αφροδίτης', 'Ποσειδώνος', 'Ερμού', 'Παπάγου']
  },
  { 
    name: 'Vouliagmeni', 
    nameGr: 'Βουλιαγμένη',
    coords: { lat: 37.8107, lng: 23.7831 },
    priceMultiplier: 2.0,
    streets: ['Απόλλωνος', 'Λητούς', 'Θησέως', 'Αρίωνος', 'Λεωφόρος Βουλιαγμένης', 'Οδυσσέως', 'Νηρέως', 'Ποσειδωνίας', 'Ακτής', 'Πανός']
  },
  { 
    name: 'Nea Smyrni', 
    nameGr: 'Νέα Σμύρνη',
    coords: { lat: 37.9470, lng: 23.7138 },
    priceMultiplier: 1.2,
    streets: ['Ελευθερίου Βενιζέλου', 'Ομήρου', 'Αγίας Φωτεινής', '25ης Μαρτίου', 'Πλαστήρα', 'Κλεισθένους', 'Μεγάλου Αλεξάνδρου', 'Στρατάρχου Παπάγου', 'Αιγαίου', 'Κωνσταντινουπόλεως']
  },
  { 
    name: 'Palaio Faliro', 
    nameGr: 'Παλαιό Φάληρο',
    coords: { lat: 37.9283, lng: 23.7019 },
    priceMultiplier: 1.3,
    streets: ['Αμφιθέας', 'Ναϊάδων', 'Ποσειδώνος', 'Αχιλλέως', 'Αλκυόνης', 'Τρίτωνος', 'Παλαιών Πατρών Γερμανού', 'Αγίου Αλεξάνδρου', 'Ζησιμοπούλου', 'Αρτέμιδος']
  },
  { 
    name: 'Alimos', 
    nameGr: 'Άλιμος',
    coords: { lat: 37.9104, lng: 23.7267 },
    priceMultiplier: 1.2,
    streets: ['Ιωνίας', 'Καλαμακίου', 'Μιχαλακοπούλου', 'Θουκυδίδου', 'Αλίμου', 'Λεωφόρος Βουλιαγμένης', 'Γερουλάνου', 'Ποσειδώνος', 'Δωδεκανήσου', 'Κρήτης']
  },
  { 
    name: 'Elliniko', 
    nameGr: 'Ελληνικό',
    coords: { lat: 37.8848, lng: 23.7441 },
    priceMultiplier: 1.3,
    streets: ['Ιασωνίδου', 'Κύπρου', 'Βουλιαγμένης', 'Ηούς', 'Αφροδίτης', 'Χρυσοστόμου Σμύρνης', 'Ελλήνων Αξιωματικών', 'Σκρα', 'Πινδάρου', 'Ομήρου']
  },
  
  // Βόρεια Προάστια
  { 
    name: 'Kifisia', 
    nameGr: 'Κηφισιά',
    coords: { lat: 38.0736, lng: 23.8103 },
    priceMultiplier: 1.7,
    streets: ['Κασσαβέτη', 'Κολοκοτρώνη', 'Λεβίδου', 'Χαρ. Τρικούπη', 'Τατοΐου', 'Οθωνος', 'Δροσίνη', 'Σολωμού', 'Χελμού', 'Κορυτσάς']
  },
  { 
    name: 'Marousi', 
    nameGr: 'Μαρούσι',
    coords: { lat: 38.0495, lng: 23.8054 },
    priceMultiplier: 1.4,
    streets: ['Κηφισίας', 'Βασιλίσσης Σοφίας', 'Αγίου Κωνσταντίνου', 'Χατζηαντωνίου', 'Φραγκοκλησιάς', 'Σωρού', 'Περικλέους', 'Ανδρέα Παπανδρέου', 'Βορείου Ηπείρου', 'Κύπρου']
  },
  { 
    name: 'Psychiko', 
    nameGr: 'Ψυχικό',
    coords: { lat: 37.9970, lng: 23.7731 },
    priceMultiplier: 1.9,
    streets: ['Δημοκρατίας', 'Αμαρυλλίδος', 'Γαλήνης', 'Νεφέλης', 'Στρατηγού Καλλάρη', 'Δαβάκη', 'Αναπαύσεως', 'Παπαδιαμάντη', 'Σεφέρη', 'Ελύτη']
  },
  { 
    name: 'Filothei', 
    nameGr: 'Φιλοθέη',
    coords: { lat: 38.0042, lng: 23.7811 },
    priceMultiplier: 1.8,
    streets: ['Καποδιστρίου', 'Αναπαύσεως', 'Παπαναστασίου', 'Λ. Κηφισίας', 'Πίνδου', 'Αλαμάνας', 'Δροσοπούλου', 'Χρυσανθέμων', 'Γαρδενίων', 'Ορχιδέων']
  },
  { 
    name: 'Chalandri', 
    nameGr: 'Χαλάνδρι',
    coords: { lat: 38.0211, lng: 23.8001 },
    priceMultiplier: 1.3,
    streets: ['Ανδρέα Παπανδρέου', 'Πεντέλης', 'Αγίας Παρασκευής', 'Ηρακλείτου', 'Σωκράτους', 'Πλάτωνος', 'Κοδριγκτώνος', 'Αναξαγόρα', 'Δημοκρίτου', 'Ευκλείδη']
  },
  { 
    name: 'Vrilissia', 
    nameGr: 'Βριλήσσια',
    coords: { lat: 38.0343, lng: 23.8298 },
    priceMultiplier: 1.2,
    streets: ['Λεωφόρος Πεντέλης', 'Ολυμπίας', 'Αναλήψεως', 'Υμηττού', 'Ροδοπόλεως', 'Πάρνηθος', 'Ταϋγέτου', 'Αγίου Δημητρίου', 'Ευαγγελίστριας', 'Κισσάβου']
  },
  { 
    name: 'Agia Paraskevi', 
    nameGr: 'Αγία Παρασκευή',
    coords: { lat: 37.9951, lng: 23.8180 },
    priceMultiplier: 1.1,
    streets: ['Μεσογείων', 'Αγίας Παρασκευής', 'Ελευθερίας', 'Πατριάρχου Γρηγορίου', 'Ηπείρου', 'Χίου', 'Αιγίνης', 'Δημοκρατίας', 'Ειρήνης', 'Αγίου Ιωάννου']
  },
  { 
    name: 'Cholargos', 
    nameGr: 'Χολαργός',
    coords: { lat: 38.0042, lng: 23.7976 },
    priceMultiplier: 1.2,
    streets: ['Περικλέους', 'Φανερωμένης', 'Αριστοτέλους', 'Μεταμορφώσεως', 'Κατεχάκη', 'Αγίας Τριάδος', 'Κύπρου', 'Παπαφλέσσα', 'Αναστάσεως', 'Στρατάρχου Παπάγου']
  },
  
  // Δυτικά Προάστια
  { 
    name: 'Peristeri', 
    nameGr: 'Περιστέρι',
    coords: { lat: 38.0133, lng: 23.6915 },
    priceMultiplier: 0.7,
    streets: ['Παναγή Τσαλδάρη', 'Εθνάρχου Μακαρίου', 'Αγίου Βασιλείου', 'Θηβών', 'Αναπαύσεως', 'Πελοποννήσου', 'Τρώων', 'Αχαρνών', 'Κωνσταντινουπόλεως', 'Αγίων Αναργύρων']
  },
  { 
    name: 'Petroupoli', 
    nameGr: 'Πετρούπολη',
    coords: { lat: 38.0417, lng: 23.6850 },
    priceMultiplier: 0.6,
    streets: ['25ης Μαρτίου', 'Ελευθερίου Βενιζέλου', 'Αναπαύσεως', 'Μ. Μπότσαρη', 'Κύπρου', 'Ηρώων Πολυτεχνείου', 'Εθνικής Αντιστάσεως', 'Αγίας Τριάδος', 'Δημοκρατίας', 'Ειρήνης']
  },
  { 
    name: 'Aigaleo', 
    nameGr: 'Αιγάλεω',
    coords: { lat: 37.9929, lng: 23.6823 },
    priceMultiplier: 0.6,
    streets: ['Ιερά Οδός', 'Κηφισού', 'Δημαρχείου', 'Αγίου Σπυρίδωνος', 'Μεγάλου Αλεξάνδρου', 'Ναυαρίνου', 'Δωδεκανήσου', 'Κορυτσάς', 'Θηβών', 'Αθηνών']
  },
  { 
    name: 'Ilioupoli', 
    nameGr: 'Ηλιούπολη',
    coords: { lat: 37.9316, lng: 23.7588 },
    priceMultiplier: 0.9,
    streets: ['Σοφ. Βενιζέλου', 'Πρωτόπαππα', 'Μαρίνου Αντύπα', 'Ηρώων Πολυτεχνείου', 'Αλσους', 'Κύπρου', 'Πατριάρχου Γρηγορίου', 'Ελευθερίου Βενιζέλου', 'Φλέμινγκ', 'Μεγίστης']
  },
  
  // Πειραιάς
  { 
    name: 'Piraeus Center', 
    nameGr: 'Κέντρο Πειραιά',
    coords: { lat: 37.9483, lng: 23.6433 },
    priceMultiplier: 0.8,
    streets: ['Ηρώων Πολυτεχνείου', 'Φίλωνος', 'Κολοκοτρώνη', 'Καραΐσκου', 'Γούναρη', 'Βασιλέως Γεωργίου', 'Ζωσιμάδων', 'Μπουμπουλίνας', 'Τσαμαδού', 'Εθνικής Αντιστάσεως']
  },
  { 
    name: 'Kastella', 
    nameGr: 'Καστέλλα',
    coords: { lat: 37.9470, lng: 23.6580 },
    priceMultiplier: 1.0,
    streets: ['Βασιλέως Παύλου', 'Αλεξάνδρου Παπαναστασίου', 'Ιατρίδου', 'Φαληρέως', 'Προφήτη Ηλία', 'Κανθάρου', 'Τερψιθέας', 'Δεξαμενής', 'Αγίου Κωνσταντίνου', 'Μουτσοπούλου']
  },
  { 
    name: 'Pasalimani', 
    nameGr: 'Πασαλιμάνι',
    coords: { lat: 37.9420, lng: 23.6470 },
    priceMultiplier: 1.1,
    streets: ['Ακτή Μουτσοπούλου', 'Γρηγορίου Λαμπράκη', 'Μαρίνας Ζέας', 'Χατζηκυριάκου', 'Ακτή Θεμιστοκλέους', 'Μπουμπουλίνας', 'Κουντουριώτου', 'Ναυάρχου Νοταρά', 'Βασιλέως Γεωργίου', 'Φίλωνος']
  }
];

// Property types
const propertyTypes = [
  { type: 'apartment', gr: 'Διαμέρισμα', weight: 0.6 },
  { type: 'maisonette', gr: 'Μεζονέτα', weight: 0.15 },
  { type: 'studio', gr: 'Στούντιο', weight: 0.15 },
  { type: 'penthouse', gr: 'Ρετιρέ', weight: 0.05 },
  { type: 'loft', gr: 'Loft', weight: 0.05 }
];

// Property features
const features = [
  'Μπαλκόνι', 'Βεράντα', 'Κήπος', 'Πάρκινγκ', 'Αποθήκη',
  'Τζάκι', 'Συναγερμός', 'Κλιματισμός', 'Θέρμανση αυτόνομη',
  'Ηλιακός θερμοσίφωνας', 'Πόρτα ασφαλείας', 'Ανελκυστήρας',
  'Ανακαινισμένο', 'Θέα θάλασσα', 'Θέα βουνό', 'Φωτεινό',
  'Διαμπερές', 'Γωνιακό', 'Προσόψεως', 'Ήσυχο'
];

// Helper functions
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function weightedRandom<T>(items: { weight: number; value: T }[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) return item.value;
  }
  
  return items[items.length - 1].value;
}

// Generate a single property
function generateProperty(id: number): Property {
  const area = randomElement(athensAreas);
  const forSale = Math.random() > 0.4;
  const propertyType = weightedRandom(
    propertyTypes.map(p => ({ weight: p.weight, value: p }))
  );
  
  // Size based on property type
  let sqm: number;
  switch (propertyType.type) {
    case 'studio':
      sqm = randomBetween(25, 45);
      break;
    case 'apartment':
      sqm = randomBetween(50, 150);
      break;
    case 'maisonette':
      sqm = randomBetween(80, 200);
      break;
    case 'penthouse':
      sqm = randomBetween(100, 250);
      break;
    case 'loft':
      sqm = randomBetween(60, 120);
      break;
    default:
      sqm = randomBetween(50, 150);
  }
  
  // Calculate price
  const basePrice = forSale ? 2500 : 10; // per sqm
  const yearBuilt = randomBetween(1960, 2024);
  const ageMultiplier = yearBuilt > 2020 ? 1.2 : yearBuilt > 2010 ? 1.1 : yearBuilt > 2000 ? 1.0 : 0.9;
  const price = Math.round(basePrice * sqm * area.priceMultiplier * ageMultiplier);
  
  // Bedrooms based on size
  const bedrooms = propertyType.type === 'studio' ? 0 : 
                   sqm < 60 ? 1 :
                   sqm < 90 ? 2 :
                   sqm < 120 ? 3 :
                   randomBetween(3, 5);
  
  const bathrooms = Math.min(bedrooms || 1, randomBetween(1, 2));
  const floor = randomBetween(0, 6);
  
  // Use street from the specific area
  const street = randomElement(area.streets);
  const streetNumber = randomBetween(1, 150);
  
  // Random features
  const numFeatures = randomBetween(3, 8);
  const selectedFeatures: string[] = [];
  for (let i = 0; i < numFeatures; i++) {
    const feature = randomElement(features);
    if (!selectedFeatures.includes(feature)) {
      selectedFeatures.push(feature);
    }
  }
  
  // Get geocoded coordinates or fallback to area center
  const fallbackCoords = {
    lat: area.coords.lat + (Math.random() - 0.5) * 0.005,
    lng: area.coords.lng + (Math.random() - 0.5) * 0.005
  };
  
  const coordinates = getGeocodedCoordinates(street, streetNumber, area.name, fallbackCoords);
  
  return {
    id,
    title: `${propertyType.gr} ${sqm}τμ στο ${area.nameGr}`,
    price,
    address: `${street} ${streetNumber}`,
    city: 'Αθήνα',
    area: area.name,
    type: forSale ? 'sale' : 'rent',
    bedrooms,
    bathrooms,
    sqm,
    floor,
    yearBuilt,
    features: selectedFeatures,
    propertyType: propertyType.type,
    image: `/images/img_${(id % 10) + 1}.jpg`,
    coordinates
  };
}

// Generate multiple properties
export function generateAthensProperties(count: number = 100): Property[] {
  const properties: Property[] = [];
  for (let i = 1; i <= count; i++) {
    properties.push(generateProperty(i));
  }
  return properties;
}