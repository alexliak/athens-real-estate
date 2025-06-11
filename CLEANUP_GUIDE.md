# 🧹 Real Estate Athens - ΠΡΟΣΕΚΤΙΚΟΣ Οδηγός Καθαρισμού

## ⚠️ ΠΡΟΣΟΧΗ: Διάβασε ΟΛΟΚΛΗΡΟ τον οδηγό πριν διαγράψεις οτιδήποτε!

## 📁 Αρχεία που ΣΙΓΟΥΡΑ Χρειάζονται (ΜΗΝ ΔΙΑΓΡΑΨΕΙΣ)

### ✅ Core Application Files
```
/app
├── page.tsx                    # ✅ Main home page - ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ
├── layout.tsx                  # ✅ Root layout με Bootstrap - ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ
├── globals.css                 # ✅ Global styles - ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ
├── /components
│   ├── /Map
│   │   ├── DynamicMap.tsx     # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ στο page.tsx
│   │   └── SimpleLeafletMap.tsx # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ από DynamicMap
│   ├── /UI
│   │   ├── PropertyCard.tsx   # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ στο page.tsx
│   │   ├── PropertyList.tsx   # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ στο page.tsx
│   │   └── PropertySearch.tsx # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ στο page.tsx
│   ├── Navbar.tsx             # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ στο page.tsx
│   ├── Footer.tsx             # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ στο page.tsx
│   ├── PropertyDetailModal.tsx # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ στο page.tsx
│   └── ClientBootstrap.tsx    # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ στο layout.tsx
├── /lib
│   ├── propertyDataService.ts # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ παντού
│   └── geocodingService.ts    # ✅ ΠΙΘΑΝΟΝ χρησιμοποιείται στα APIs
├── /styles
│   ├── custom.css            # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ στο layout.tsx
│   └── properties.css        # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ στο layout.tsx
├── /data
│   └── properties-real-addresses.json # ✅ ΚΥΡΙΑ ΒΑΣΗ ΔΕΔΟΜΕΝΩΝ
└── /api
    ├── /properties/route.ts          # ✅ API endpoint
    ├── /streets/autocomplete/route.ts # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ για autocomplete
    ├── /geocode/route.ts             # ✅ Geocoding API
    └── /coordinates/route.ts         # ✅ Coordinates API
```

### ✅ Public Assets (ΜΗΝ ΔΙΑΓΡΑΨΕΙΣ)
```
/public
├── /images
│   ├── img_1.jpg through img_8.jpg  # ✅ ΧΡΗΣΙΜΟΠΟΙΟΥΝΤΑΙ στα components
│   └── hero_bg_*.jpg               # ✅ Μπορεί να χρησιμοποιούνται
└── /leaflet
    ├── marker-icon.png             # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ από Leaflet
    ├── marker-icon-2x.png          # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ από Leaflet
    └── marker-shadow.png           # ✅ ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ από Leaflet
```

### ✅ Database (ΜΗΝ ΔΙΑΓΡΑΨΕΙΣ)
```
/attica_master.db     # ✅ ΚΥΡΙΑ ΒΑΣΗ - ΧΡΗΣΙΜΟΠΟΙΕΙΤΑΙ από APIs
```

### ✅ Configuration Files (ΜΗΝ ΔΙΑΓΡΑΨΕΙΣ)
```
package.json          # ✅ ΑΠΑΡΑΙΤΗΤΟ
package-lock.json     # ✅ ΑΠΑΡΑΙΤΗΤΟ
tsconfig.json        # ✅ ΑΠΑΡΑΙΤΗΤΟ
next.config.ts       # ✅ ΑΠΑΡΑΙΤΗΤΟ
.gitignore          # ✅ ΑΠΑΡΑΙΤΗΤΟ
README.md           # ✅ Documentation
```

### ✅ Scripts (ΚΡΑΤΑ για reference - ΜΗΝ ΔΙΑΓΡΑΨΕΙΣ)
```
/scripts
├── generatePropertiesWithRealAddresses.js  # ✅ Δημιούργησε τα data
├── fixAreaNames.js                        # ✅ Διόρθωσε τις περιοχές
├── consolidateDatabases.js                # ✅ Δημιούργησε master DB
└── [άλλα scripts για reference]
```

### ✅ Documentation (ΜΗΝ ΔΙΑΓΡΑΨΕΙΣ)
```
/docs
├── PROJECT_DOCUMENTATION.md
└── DESIGN_DOCUMENTATION.md
CLEANUP_GUIDE.md
PROJECT_SUMMARY.md
```

## 🗑️ Αρχεία που ΜΠΟΡΕΙΣ να Διαγράψεις (με ΠΡΟΣΟΧΗ)

### 1. Test/Debug Pages (ΕΛΕΓΞΕ ότι δεν χρησιμοποιούνται)
```
❓ /app/test/page.tsx          # Αν είσαι σίγουρος ότι δεν χρειάζεται
❓ /app/test-image/page.tsx    # Test page για εικόνες
❓ /app/debug-properties/page.tsx # Debug page
```

### 2. Duplicate/Old Components (ΕΛΕΓΞΕ imports πρώτα!)
```
# ΠΡΟΣΟΧΗ: Έλεγξε αν κάποιο από αυτά χρησιμοποιείται!

# Map Components που ΔΕΝ χρησιμοποιούνται:
❓ /app/components/Map/PropertyMap.tsx
❓ /app/components/Map/PropertyMapClient.tsx  
❓ /app/components/Map/PropertyMapWithClusters.tsx
❓ /app/components/Map/SimplePropertyMap.tsx

# Old Components στο root:
❓ /app/components/PropertyCard.tsx # ΑΝ υπάρχει duplicate (έχουμε UI/PropertyCard.tsx)
❓ /app/components/SimpleMap.tsx
❓ /app/components/MapWith*.tsx (όλα)
❓ /app/components/Interactive*.tsx (όλα)
```

### 3. Unused Features (ΣΙΓΟΥΡΑ δεν χρησιμοποιούνται)
```
✅ ΜΠΟΡΕΙΣ ΝΑ ΔΙΑΓΡΑΨΕΙΣ:
/app/favorites/              # Feature που δεν υλοποιήθηκε
/app/map/page.tsx           # Duplicate route (έχουμε το main page)
/app/lib/favoritesManager.ts # Δεν χρησιμοποιείται
/app/lib/imageHelpers.ts    # Αντικαταστάθηκε
/app/lib/generateAthensProperties.ts # Παλιός generator
/app/lib/manualCoordinates.ts # Δεν χρειάζεται πια
```

### 4. Components που πιθανόν δεν χρησιμοποιούνται
```
# ΕΛΕΓΞΕ ΠΡΩΤΑ αν κάποιο component τα χρησιμοποιεί:
❓ /app/components/PropertyAddForm.tsx
❓ /app/components/AddressAutocomplete.tsx  
❓ /app/components/ExportProperties.tsx
❓ /app/components/PriceRangeSlider.tsx
❓ /app/components/MapFilters.tsx
❓ /app/components/EnhancedPropertyCard.tsx
❓ /app/components/PropertyCardWithFavorites.tsx
```

### 5. Temporary Files (ΣΙΓΟΥΡΑ μπορείς να διαγράψεις)
```
✅ ΔΙΑΓΡΑΨΕ:
/temp/                      # Temporary folder
/extracted/                 # Extraction folder
/templates/                 # Old templates
FIX_MAP_ISSUES.md          # Old notes
copy-images.sh             # Script που τρέξαμε
setup-map.sh               # Setup script
manage-properties.sh       # Management script
/app/page.module.css       # Unused CSS module
```

### 6. Old Databases (ΠΡΟΣΟΧΗ - κράτα backup!)
```
⚠️ ΚΑΝΕ BACKUP ΠΡΩΤΑ, μετά διάγραψε:
attica_streets.db          # Αντικαταστάθηκε από master
attica_geocoded.db         # Αντικαταστάθηκε από master
property_coordinates.db    # Αντικαταστάθηκε από master
attica_streets.geojson     # Large file, δεν χρειάζεται
municipality_boundaries.json # Δεν χρησιμοποιείται πια
download_missing_municipalities.txt # Notes file
```

### 7. IDE Files
```
✅ ΔΙΑΓΡΑΨΕ (και πρόσθεσε στο .gitignore):
real-estate-athens.iml
/.idea/              # IntelliJ IDEA files
```

## 🔍 Πώς να Ελέγξεις αν ένα Αρχείο Χρησιμοποιείται

Πριν διαγράψεις ΟΤΙΔΗΠΟΤΕ:

```bash
# 1. Έλεγξε για imports
grep -r "ComponentName" app/

# 2. Έλεγξε για references  
grep -r "filename" app/

# 3. Έλεγξε τα imports στο VS Code
# Ctrl+Shift+F και ψάξε το όνομα του αρχείου
```

## 🛡️ Ασφαλής Διαδικασία Cleanup

```bash
# 1. ΠΡΩΤΑ κάνε backup!
mkdir backup_before_cleanup
cp -r app backup_before_cleanup/
cp -r public backup_before_cleanup/
cp *.db backup_before_cleanup/

# 2. Διάγραψε ΜΟΝΟ τα σίγουρα
rm -rf temp extracted templates
rm -f FIX_MAP_ISSUES.md copy-images.sh setup-map.sh manage-properties.sh

# 3. Test folders (αν είσαι σίγουρος)
rm -rf app/test app/test-image app/debug-properties

# 4. Unused features (σίγουρα)
rm -rf app/favorites
rm -f app/map/page.tsx
rm -f app/lib/favoritesManager.ts
rm -f app/lib/imageHelpers.ts
rm -f app/lib/generateAthensProperties.ts
rm -f app/lib/manualCoordinates.ts

# 5. ΓΙΑ ΟΛΑ ΤΑ ΑΛΛΑ - έλεγξε πρώτα!
```

## 📝 Update .gitignore

```gitignore
# IDE
.idea/
*.iml

# Build
.next/
node_modules/

# Databases backups
*.db.backup
backup_*/

# Temporary
temp/
extracted/
templates/

# OS
.DS_Store
Thumbs.db

# Keep master database
!attica_master.db
```

## ⚠️ ΤΕΛΙΚΗ ΠΡΟΕΙΔΟΠΟΙΗΣΗ

1. **ΜΗΝ ΔΙΑΓΡΑΨΕΙΣ** τίποτα που δεν είσαι 100% σίγουρος
2. **ΚΑΝΕ BACKUP** πριν από κάθε διαγραφή
3. **ΤΡΕΞΕ ΤΟ APP** μετά από κάθε διαγραφή για να δεις ότι δουλεύει
4. **ΕΛΕΓΞΕ IMPORTS** πριν διαγράψεις components
5. **ΚΡΑΤΑ ΤΑ SCRIPTS** για reference

## ✅ Ασφαλή για Διαγραφή (100% Σίγουρα)

```bash
# Αυτά ΣΙΓΟΥΡΑ μπορείς να τα διαγράψεις:
rm -rf temp/ extracted/ templates/
rm -f FIX_MAP_ISSUES.md copy-images.sh setup-map.sh manage-properties.sh
rm -rf app/favorites/
rm -f app/lib/favoritesManager.ts
rm -f app/page.module.css
rm -f real-estate-athens.iml
```

Για όλα τα άλλα - ΕΛΕΓΞΕ ΠΡΩΤΑ! 🔍
