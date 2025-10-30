import type { Metadata } from 'next';
import './globals.css';
import { ReactQueryProvider } from '@/lib/react-query/provider';
import { Toaster } from 'sonner';

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
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand={false}
          toastOptions={{
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </body>
    </html>
  );
}
