# 🚀 GitHub Setup & Deployment Guide

## 1. Προετοιμασία για GitHub

### Καθαρισμός πριν το commit
```bash
# 1. Διάγραψε τα cleanup scripts
rm -f SAFE_*.sh REMOVE_*.sh FIX_*.sh

# 2. Διάγραψε build files
rm -rf .next/

# 3. Έλεγξε το .gitignore
```

### Ενημέρωση .gitignore
```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/

# Production
dist/

# Misc
.DS_Store
*.pem
.vscode/
.idea/
*.iml

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# OS
Thumbs.db

# Backup folders
backup*/
backup_*/

# Temporary
temp/
tmp/
*.tmp
*.backup

# Keep these
!attica_master.db
!public/images/
!scripts/
EOF
```

## 2. Δημιουργία Repository στο GitHub

1. Πήγαινε στο https://github.com/new
2. Δημιούργησε νέο repository:
   - **Repository name**: `athens-real-estate`
   - **Description**: "Real Estate Map Application for Athens - CLD6001 Undergraduate Research Project"
   - **Public** repository
   - ❌ ΜΗΝ προσθέσεις README (έχουμε ήδη)
   - ❌ ΜΗΝ προσθέσεις .gitignore (έχουμε ήδη)

## 3. Initial Commit & Push

```bash
# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Create first commit
git commit -m "Initial commit: Athens Real Estate Map Application

- Next.js 14 with TypeScript
- Interactive Leaflet map
- 1000 properties with real Athens addresses
- SQLite database with 118k geocoded addresses
- Bootstrap 5 UI
- Responsive design"

# 4. Add remote (αντικατάστησε YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/athens-real-estate.git

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

## 4. GitHub Repository Settings

### Προσθήκη Topics
Πήγαινε στο Settings → Topics και πρόσθεσε:
- `nextjs`
- `react`
- `typescript`
- `leaflet`
- `real-estate`
- `sqlite`
- `bootstrap`
- `openstreetmap`

### About Section
- **Description**: Real Estate Map Application for Athens
- **Website**: Το deployment URL (αν έχεις)
- ✅ **Include in the home page**

## 5. Create GitHub Release

```bash
# 1. Tag the version
git tag -a v1.0.0 -m "Version 1.0.0 - Initial Release"

# 2. Push tag
git push origin v1.0.0
```

Στο GitHub:
1. Πήγαινε στο **Releases** → **Create a new release**
2. **Tag**: v1.0.0
3. **Release title**: Athens Real Estate v1.0.0
4. **Description**:
```markdown
## 🎉 Initial Release

### Features
- 🗺️ Interactive map with 1000 properties
- 📍 Real Athens addresses from OpenStreetMap
- 🔍 Advanced search and filtering
- 📱 Responsive design
- ⚡ High-performance SQLite database

### Technical Details
- 118,489 geocoded addresses
- 23,258 unique streets
- 22 municipalities coverage
- Built with Next.js 14 and React 18

### Documentation
- See README for installation instructions
- Check /docs for technical documentation
```

## 6. Προσθήκη GitHub Actions (Optional)

Δημιούργησε `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run build
      run: npm run build
      
    - name: Run tests
      run: npm test -- --passWithNoTests
```

## 7. Deployment Options

### Option A: Vercel (Recommended)
1. Πήγαινε στο https://vercel.com
2. Import από GitHub
3. Select repository
4. Deploy (automatic)

### Option B: Netlify
1. Πήγαινε στο https://netlify.com
2. New site from Git
3. Connect to GitHub
4. Deploy settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### Option C: GitHub Pages (Static Export)
```bash
# 1. Update next.config.ts
# Add: output: 'export'

# 2. Build
npm run build

# 3. Deploy
npx gh-pages -d out
```

## 8. Διαμοιρασμός με τον Καθηγητή

### Email Template
```
Subject: CLD6001 - Athens Real Estate Project Submission

Dear Professor,

I am submitting my undergraduate research project for CLD6001.

Project: Athens Real Estate Map Application

GitHub Repository: https://github.com/YOUR_USERNAME/athens-real-estate
Live Demo: [Deployment URL]

Key Features:
- Interactive map with 1000 real properties
- 118,489 geocoded Athens addresses
- Advanced search functionality
- Responsive design

Technical Stack:
- Next.js 14, React 18, TypeScript
- SQLite database (37MB)
- Leaflet.js for mapping
- Bootstrap 5 for UI

Documentation is available in the /docs folder.

Best regards,
Alexa
```

## 9. Maintenance

### Regular Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Commit updates
git add package*.json
git commit -m "chore: Update dependencies"
git push
```

### Bug Fixes
```bash
git checkout -b fix/issue-description
# Make fixes
git add .
git commit -m "fix: Description of fix"
git push origin fix/issue-description
# Create Pull Request on GitHub
```

## 10. Checklist πριν την Παράδοση

- [ ] Όλα τα tests περνάνε
- [ ] Το README είναι πλήρες
- [ ] Η documentation είναι ενημερωμένη
- [ ] Δεν υπάρχουν hardcoded credentials
- [ ] Το .gitignore είναι σωστό
- [ ] Το deployment δουλεύει
- [ ] Ο καθηγητής έχει access στο repo
- [ ] Υπάρχει live demo link

## 🎯 Success!

Το project σου είναι έτοιμο για παράδοση! 🎉
