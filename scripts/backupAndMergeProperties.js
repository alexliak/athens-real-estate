// Script για backup και merge των properties
import fs from 'fs';
import path from 'path';

console.log('🔄 Property Data Management\n');

const dataDir = './app/data';
const backupDir = './app/data/backups';

// Δημιούργησε backup directory
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log('📁 Created backup directory\n');
}

// Βρες όλα τα property files
const propertyFiles = fs.readdirSync(dataDir)
  .filter(file => file.includes('properties') && file.endsWith('.json'))
  .map(file => ({
    name: file,
    path: path.join(dataDir, file),
    stats: fs.statSync(path.join(dataDir, file))
  }));

console.log(`📂 Found ${propertyFiles.length} property files:\n`);

propertyFiles.forEach(file => {
  const data = JSON.parse(fs.readFileSync(file.path, 'utf8'));
  console.log(`📄 ${file.name}`);
  console.log(`   Size: ${(file.stats.size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Properties: ${data.length}`);
  console.log(`   Modified: ${file.stats.mtime.toLocaleString()}`);
  console.log('');
});

// Επιλογές
console.log('🎯 Options:\n');
console.log('1. Backup all property files');
console.log('2. Update existing properties with real addresses');
console.log('3. Generate new properties with real addresses');
console.log('4. Merge all properties into one file');
console.log('5. Clean up old files\n');

// Αυτόματο backup για ασφάλεια
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
propertyFiles.forEach(file => {
  const backupPath = path.join(backupDir, `${timestamp}-${file.name}`);
  fs.copyFileSync(file.path, backupPath);
});

console.log(`✅ Auto-backup completed to: ${backupDir}\n`);

// Δημιούργησε script για εύκολη εκτέλεση
const runScript = `#!/bin/bash
# Property Management Script

echo "🏠 Athens Real Estate - Property Management"
echo ""

case "$1" in
  update)
    echo "Updating existing properties with real addresses..."
    node scripts/updateExistingPropertiesWithRealAddresses.js
    ;;
  generate)
    echo "Generating new properties with real addresses..."
    node scripts/generatePropertiesWithRealAddresses.js
    ;;
  compare)
    echo "Comparing property files..."
    node scripts/compareProperties.js
    ;;
  backup)
    echo "Creating backup..."
    node scripts/backupAndMergeProperties.js
    ;;
  *)
    echo "Usage: $0 {update|generate|compare|backup}"
    echo ""
    echo "  update   - Update existing properties with real addresses"
    echo "  generate - Generate new properties with real addresses"
    echo "  compare  - Compare all property files"
    echo "  backup   - Backup all property files"
    exit 1
esac
`;

fs.writeFileSync('./manage-properties.sh', runScript);
fs.chmodSync('./manage-properties.sh', '755');

console.log('📝 Created manage-properties.sh script\n');
console.log('Usage examples:');
console.log('  ./manage-properties.sh update   # Update existing properties');
console.log('  ./manage-properties.sh generate # Generate new properties');
console.log('  ./manage-properties.sh compare  # Compare files');
