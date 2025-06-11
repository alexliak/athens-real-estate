import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping από Αγγλικά σε Ελληνικά
const areaMapping = {
  'Kolonaki': 'Κολωνάκι',
  'Kypseli': 'Κυψέλη',
  'Plaka': 'Πλάκα',
  'Glyfada': 'Γλυφάδα',
  'Psiri': 'Ψυρρή',
  'Palaio Faliro': 'Παλαιό Φάληρο',
  'Koukaki': 'Κουκάκι',
  'Nea Smyrni': 'Νέα Σμύρνη',
  'Exarchia': 'Εξάρχεια',
  'Pagrati': 'Παγκράτι',
  'Marousi': 'Μαρούσι',
  'Peristeri': 'Περιστέρι',
  'Piraeus': 'Πειραιάς',
  'Voula': 'Βούλα',
  'Petroupoli': 'Πετρούπολη',
  'Neo Psychiko': 'Νέο Ψυχικό',
  'Kifisia': 'Κηφισιά',
  'Chalandri': 'Χαλάνδρι',
  'Ilioupoli': 'Ηλιούπολη',
  'Zografou': 'Ζωγράφου'
};

console.log('🔄 Διόρθωση ονομάτων περιοχών...');

try {
  // Διάβασε το αρχείο
  const filePath = path.join(__dirname, '..', 'app', 'data', 'properties-real-addresses.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  let changedCount = 0;
  
  // Ενημέρωσε τις περιοχές
  data.forEach(property => {
    const currentArea = property.location.area;
    
    // Αν είναι στα Αγγλικά, μετάτρεψε σε Ελληνικά
    if (areaMapping[currentArea]) {
      property.location.area = areaMapping[currentArea];
      changedCount++;
    }
  });
  
  // Αποθήκευσε το ενημερωμένο αρχείο
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  
  console.log(`✅ Διορθώθηκαν ${changedCount} περιοχές`);
  console.log('📊 Στατιστικά ανά περιοχή:');
  
  const areaCounts = {};
  data.forEach(p => {
    areaCounts[p.location.area] = (areaCounts[p.location.area] || 0) + 1;
  });
  
  Object.entries(areaCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([area, count]) => {
      console.log(`   - ${area}: ${count} ακίνητα`);
    });
    
} catch (error) {
  console.error('❌ Σφάλμα:', error.message);
}
