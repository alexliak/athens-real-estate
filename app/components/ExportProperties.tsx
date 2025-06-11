'use client';

import React from 'react';
import { Property } from './PropertyCard';

interface ExportPropertiesProps {
  properties: Property[];
  type?: 'all' | 'filtered' | 'favorites';
}

const ExportProperties: React.FC<ExportPropertiesProps> = ({ properties, type = 'filtered' }) => {
  
  const getAreaInGreek = (area: string) => {
    const areaMap: { [key: string]: string } = {
      'Kolonaki': 'Κολωνάκι',
      'Exarchia': 'Εξάρχεια',
      'Plaka': 'Πλάκα',
      'Glyfada': 'Γλυφάδα',
      'Kifisia': 'Κηφισιά',
      'Marousi': 'Μαρούσι',
      'Pagrati': 'Παγκράτι',
      'Psiri': 'Ψυρρή',
      'Koukaki': 'Κουκάκι',
      'Nea Smyrni': 'Νέα Σμύρνη',
    };
    return areaMap[area] || area;
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Τίτλος', 'Τιμή', 'Τύπος', 'Διεύθυνση', 'Περιοχή', 'Υπνοδωμάτια', 'Μπάνια', 'Τ.μ.'];
    
    const csvContent = [
      headers.join(','),
      ...properties.map(p => [
        p.id,
        `"${p.title}"`,
        p.price,
        p.type === 'sale' ? 'Πώληση' : 'Ενοικίαση',
        `"${p.address}"`,
        getAreaInGreek(p.area),
        p.bedrooms,
        p.bathrooms,
        p.sqm
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `properties_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const dataToExport = properties.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      type: p.type === 'sale' ? 'Πώληση' : 'Ενοικίαση',
      address: p.address,
      area: getAreaInGreek(p.area),
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      sqm: p.sqm,
      coordinates: p.coordinates
    }));

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `properties_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printProperties = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Real Estate Athens - Properties List</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 20px;
          }
          h1 {
            color: #2c3e50;
            border-bottom: 2px solid #e85a1b;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .price {
            color: #e85a1b;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          @media print {
            th {
              background-color: #f5f5f5 !important;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <h1>🏠 Real Estate Athens - Λίστα Ακινήτων</h1>
        <p>Ημερομηνία: ${new Date().toLocaleDateString('el-GR')}</p>
        <p>Σύνολο ακινήτων: ${properties.length}</p>
        
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Τίτλος</th>
              <th>Τιμή</th>
              <th>Τύπος</th>
              <th>Διεύθυνση</th>
              <th>Περιοχή</th>
              <th>Υπν.</th>
              <th>Μπ.</th>
              <th>Τ.μ.</th>
            </tr>
          </thead>
          <tbody>
            ${properties.map((p, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${p.title}</td>
                <td class="price">€${p.price.toLocaleString('el-GR')}${p.type === 'rent' ? '/μήνα' : ''}</td>
                <td>${p.type === 'sale' ? 'Πώληση' : 'Ενοικίαση'}</td>
                <td>${p.address}</td>
                <td>${getAreaInGreek(p.area)}</td>
                <td>${p.bedrooms}</td>
                <td>${p.bathrooms}</td>
                <td>${p.sqm}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Real Estate Athens © ${new Date().getFullYear()}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  };

  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    }}>
      <span style={{ marginRight: '10px', color: '#666', fontSize: '14px' }}>
        Εξαγωγή:
      </span>
      
      <button
        onClick={exportToCSV}
        style={{
          padding: '8px 16px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#218838';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#28a745';
        }}
      >
        📊 Excel (CSV)
      </button>
      
      <button
        onClick={exportToJSON}
        style={{
          padding: '8px 16px',
          background: '#17a2b8',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#138496';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#17a2b8';
        }}
      >
        📄 JSON
      </button>
      
      <button
        onClick={printProperties}
        style={{
          padding: '8px 16px',
          background: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#5a6268';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#6c757d';
        }}
      >
        🖨️ Εκτύπωση
      </button>
    </div>
  );
};

export default ExportProperties;