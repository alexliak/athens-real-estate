import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/custom.css";
import "./styles/properties.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ClientBootstrap from './components/ClientBootstrap';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Athens Real Estate - Ακίνητα Αθήνα",
  description: "Βρείτε το ιδανικό ακίνητο στην Αθήνα - Real Estate Athens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={inter.className}>
        {children}
        <ClientBootstrap />
      </body>
    </html>
  );
}