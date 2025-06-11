#!/bin/bash
echo "Setting up Leaflet marker icons..."

# Create leaflet directory in public
mkdir -p public/leaflet

# Download marker icons from unpkg
curl -o public/leaflet/marker-icon.png https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png
curl -o public/leaflet/marker-icon-2x.png https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png
curl -o public/leaflet/marker-shadow.png https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png

echo "✅ Leaflet icons downloaded successfully!"
