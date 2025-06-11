'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  currentPage?: 'home' | 'map' | 'properties' | 'about' | 'contact';
}

const Navbar: React.FC<NavbarProps> = ({ currentPage = 'home' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Αρχική', page: 'home' },
    { href: '/map', label: 'Χάρτης', page: 'map' },
    { href: '/properties', label: 'Ακίνητα', page: 'properties' },
    { href: '/about', label: 'Σχετικά', page: 'about' },
    { href: '/contact', label: 'Επικοινωνία', page: 'contact' }
  ];

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1050
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>
          {/* Logo */}
          <Link href="/" style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>🏠</span>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                Real Estate Athens
              </h1>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#666'
              }}>
                Τα καλύτερα ακίνητα στην Αθήνα
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div style={{
            display: 'flex',
            gap: '30px',
            alignItems: 'center'
          }} className="desktop-nav">
            {navItems.map(item => (
              <Link
                key={item.page}
                href={item.href}
                style={{
                  textDecoration: 'none',
                  color: currentPage === item.page ? '#e85a1b' : '#333',
                  fontWeight: currentPage === item.page ? 'bold' : 'normal',
                  fontSize: '16px',
                  transition: 'color 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== item.page) {
                    e.currentTarget.style.color = '#e85a1b';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== item.page) {
                    e.currentTarget.style.color = '#333';
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Call to Action Button */}
            <button style={{
              background: '#e85a1b',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#d14810'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#e85a1b'}
            >
              <span style={{ marginRight: '5px' }}>📞</span>
              210 123 4567
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '70px',
            left: 0,
            right: 0,
            background: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            padding: '20px'
          }}>
            {navItems.map(item => (
              <Link
                key={item.page}
                href={item.href}
                style={{
                  display: 'block',
                  padding: '10px 0',
                  textDecoration: 'none',
                  color: currentPage === item.page ? '#e85a1b' : '#333',
                  fontWeight: currentPage === item.page ? 'bold' : 'normal',
                  fontSize: '16px',
                  borderBottom: '1px solid #eee'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button style={{
              background: '#e85a1b',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '20px',
              width: '100%'
            }}>
              <span style={{ marginRight: '5px' }}>📞</span>
              210 123 4567
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;