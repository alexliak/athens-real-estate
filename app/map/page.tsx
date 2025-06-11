'use client';

import dynamic from 'next/dynamic';
import Layout from '../components/Layout';

const InteractiveMap = dynamic(
  () => import('../components/InteractiveMap'),
  { 
    ssr: false,
    loading: () => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f5f5f5'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '40px', 
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          <h2>Loading map...</h2>
        </div>
      </div>
    )
  }
);

export default function MapPage() {
  return (
    <Layout currentPage="map" showFooter={false}>
      <InteractiveMap />
    </Layout>
  );
}