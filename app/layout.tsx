import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Old Texas BBQ - CRM',
  description: 'Sistema de gestión integral para Old Texas BBQ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
