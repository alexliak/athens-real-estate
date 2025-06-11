'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar currentPage="map" />
      <main style={{ minHeight: 'calc(100vh - 120px)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}