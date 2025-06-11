# 📋 ΠΛΗΡΗΣ ΑΝΑΛΥΣΗ ΑΡΧΕΙΩΝ - Real Estate Athens

## 🔴 ΧΡΗΣΙΜΟΠΟΙΟΥΝΤΑΙ ΣΙΓΟΥΡΑ (ΜΗΝ ΔΙΑΓΡΑΨΕΙΣ)

### Core Application Files
- ✅ `/app/page.tsx` - Main page
- ✅ `/app/layout.tsx` - Root layout  
- ✅ `/app/globals.css` - Global styles
- ✅ `/app/styles/custom.css` - Custom styles
- ✅ `/app/styles/properties.css` - Property styles

### Components που ΧΡΗΣΙΜΟΠΟΙΟΥΝΤΑΙ
- ✅ `/app/components/Navbar.tsx` - από page.tsx
- ✅ `/app/components/Footer.tsx` - από page.tsx
- ✅ `/app/components/PropertyDetailModal.tsx` - από page.tsx
- ✅ `/app/components/ClientBootstrap.tsx` - από layout.tsx
- ✅ `/app/components/Map/DynamicMap.tsx` - από page.tsx
- ✅ `/app/components/Map/SimpleLeafletMap.tsx` - από DynamicMap
- ✅ `/app/components/UI/PropertyCard.tsx` - από page.tsx
- ✅ `/app/components/UI/PropertyList.tsx` - από page.tsx
- ✅ `/app/components/UI/PropertySearch.tsx` - από page.tsx

### Data & Services που ΧΡΗΣΙΜΟΠΟΙΟΥΝΤΑΙ
- ✅ `/app/data/properties-real-addresses.json` - ΚΥΡΙΑ ΒΑΣΗ (1.8MB)
- ✅ `/app/lib/propertyDataService.ts` - από page.tsx

### APIs που ΧΡΗΣΙΜΟΠΟΙΟΥΝΤΑΙ
- ✅ `/app/api/streets/autocomplete/route.ts` - χρησιμοποιεί attica_master.db
- ✅ `/app/api/geocode/route.ts` - χρησιμοποιεί attica_master.db
- ✅ `/app/api/properties/route.ts` - property API
- ⚠️ `/app/api/coordinates/route.ts` - χρησιμοποιεί property_coordinates.db (CHECK!)

### Databases που ΧΡΗΣΙΜΟΠΟΙΟΥΝΤΑΙ
- ✅ `attica_master.db` - από APIs (37.27 MB)
- ⚠️ `property_coordinates.db` - από coordinates API (μπορεί να μην χρειάζεται)

### Configuration Files
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ `tsconfig.json`
- ✅ `next.config.ts`
- ✅ `.gitignore`
- ✅ `eslint.config.mjs`
- ✅ `next-env.d.ts`

### Documentation
- ✅ `README.md`
- ✅ `PROJECT_SUMMARY.md`
- ✅ `CLEANUP_GUIDE.md`
- ✅ `COMPONENTS_USAGE_CHECK.md`

## 🟡 ΧΡΗΣΙΜΟΠΟΙΟΥΝΤΑΙ ΑΠΟ ΑΛΛΑ (CHAIN DEPENDENCIES)

### Map/Interactive Components (χρησιμοποιούνται από map/page.tsx και favorites)
- ⚠️ `/app/map/page.tsx` - χρησιμοποιεί InteractiveMap
- ⚠️ `/app/components/InteractiveMap.tsx` - από map/page.tsx
- ⚠️ `/app/components/InteractiveMapWithFilters.tsx`
- ⚠️ `/app/components/MapFilters.tsx` - από InteractiveMap
- ⚠️ `/app/components/EnhancedPropertyCard.tsx` - από InteractiveMap
- ⚠️ `/app/components/PriceRangeSlider.tsx` - από InteractiveMapWithFilters
- ⚠️ `/app/components/ExportProperties.tsx` - από InteractiveMapWithFilters

### Old Map Components (χρησιμοποιούνται από παλιά components)
- ⚠️ `/app/components/SimpleMap.tsx`
- ⚠️ `/app/components/MapWithProperties.tsx`
- ⚠️ `/app/components/MapWithPropertiesEnhanced.tsx`
- ⚠️ `/app/components/MapWithPropertiesFixed.tsx`
- ⚠️ `/app/components/MapWithClustering.tsx`

### Favorites System (αλυσίδα dependencies)
- ⚠️ `/app/favorites/page.tsx` - χρησιμοποιεί PropertyCardWithFavorites
- ⚠️ `/app/components/PropertyCardWithFavorites.tsx` - από favorites & InteractiveMapWithFilters
- ⚠️ `/app/lib/favoritesManager.ts` - από PropertyCardWithFavorites

### Form Components (αλυσίδα)
- ⚠️ `/app/components/PropertyAddForm.tsx` - χρησιμοποιεί AddressAutocomplete
- ⚠️ `/app/components/AddressAutocomplete.tsx` - από PropertyAddForm

### Lib Dependencies
- ⚠️ `/app/lib/generateAthensProperties.ts` - από πολλά old components
- ⚠️ `/app/lib/geocodingService.ts` - χρησιμοποιεί manualCoordinates
- ⚠️ `/app/lib/manualCoordinates.ts` - από geocodingService
- ⚠️ `/app/lib/imageHelpers.ts` - ΔΕΝ χρησιμοποιείται πουθενά

### Data Files
- ⚠️ `/app/data/athensAreas.json` - μπορεί να χρησιμοποιείται

## 🔴 ΔΕΝ ΧΡΗΣΙΜΟΠΟΙΟΥΝΤΑΙ (ΑΣΦΑΛΗ ΓΙΑ ΔΙΑΓΡΑΦΗ)

### Test/Debug Pages
- ❌ `/app/test/page.tsx`
- ❌ `/app/test-image/page.tsx`
- ❌ `/app/debug-properties/page.tsx`

### Unused Map Components
- ❌ `/app/components/Map/PropertyMap.tsx`
- ❌ `/app/components/Map/PropertyMapClient.tsx`
- ❌ `/app/components/Map/PropertyMapWithClusters.tsx`
- ❌ `/app/components/Map/SimplePropertyMap.tsx`

### Duplicate/Old Components
- ❌ `/app/components/PropertyCard.tsx` - έχουμε το UI/PropertyCard.tsx
- ❌ `/app/components/Layout.tsx` - δεν χρησιμοποιείται

### Unused Files
- ❌ `/app/page.module.css` - δεν χρησιμοποιείται
- ❌ `/app/lib/imageHelpers.ts` - δεν χρησιμοποιείται πουθενά

### Temporary Folders
- ❌ `/temp/` - όλος ο φάκελος (old templates)
- ❌ `/extracted/` - όλος ο φάκελος
- ❌ `/templates/` - όλος ο φάκελος

### Old Scripts/Files
- ❌ `FIX_MAP_ISSUES.md`
- ❌ `copy-images.sh`
- ❌ `setup-map.sh`
- ❌ `manage-properties.sh`
- ❌ `download_missing_municipalities.txt`
- ❌ `municipality_boundaries.json`
- ❌ `real-estate-athens.iml`

### Old Databases
- ❌ `attica_streets.db` - αντικαταστάθηκε από master
- ❌ `attica_geocoded.db` - αντικαταστάθηκε από master
- ❌ `attica_streets.geojson` - μεγάλο αρχείο, δεν χρειάζεται

## ⚠️ ΧΡΕΙΑΖΟΝΤΑΙ ΑΠΟΦΑΣΗ

### Scripts folder
- `/scripts/*` - ΔΕΝ χρησιμοποιούνται runtime, αλλά είναι χρήσιμα για reference
  - Πρόταση: ΚΡΑΤΑ τα για το dissertation

### Property Coordinates DB
- `property_coordinates.db` - χρησιμοποιείται από `/api/coordinates/route.ts`
  - Έλεγξε αν το API χρησιμοποιείται

### Map/Favorites Features
Αν θέλεις να κρατήσεις το `/map` και `/favorites`:
- ΚΡΑΤΑ όλα τα components με ⚠️
  
Αν ΔΕΝ τα χρειάζεσαι:
- ΔΙΑΓΡΑΨΕ `/app/map/` και `/app/favorites/`
- ΔΙΑΓΡΑΨΕ όλα τα related components

## 📊 ΣΥΝΟΨΗ ΜΕΓΕΘΩΝ

Μεγάλα αρχεία που βρέθηκαν:
- `attica_master.db` - 37.27 MB (ΚΡΑΤΑ)
- `app/data/properties-real-addresses.json` - 1.8 MB (ΚΡΑΤΑ)
- `attica_streets.geojson` - >1MB (ΔΙΑΓΡΑΨΕ)
- Databases στο .next - build files (auto-generated)

## 🎯 ΠΡΟΤΕΙΝΟΜΕΝΗ ΕΝΕΡΓΕΙΑ

1. **ΔΙΑΓΡΑΨΕ ΑΜΕΣΑ** (100% ασφαλές):
```bash
rm -rf temp/ extracted/ templates/
rm -f FIX_MAP_ISSUES.md copy-images.sh setup-map.sh manage-properties.sh
rm -f real-estate-athens.iml
rm -f attica_streets.geojson municipality_boundaries.json
rm -f download_missing_municipalities.txt
rm -rf app/test app/test-image app/debug-properties
rm -f app/page.module.css
rm -f app/lib/imageHelpers.ts
rm -f app/components/Layout.tsx
rm -f app/components/PropertyCard.tsx
```

2. **ΑΠΟΦΑΣΙΣΕ** για map/favorites:
- Αν τα κρατάς: κράτα όλα τα dependencies
- Αν όχι: διάγραψε και τα related components

3. **ΚΡΑΤΑ** τα scripts για reference

4. **ΕΛΕΓΞΕ** αν χρησιμοποιείται το `/api/coordinates`
