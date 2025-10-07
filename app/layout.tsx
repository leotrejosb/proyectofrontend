import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '../components/layout/header';
Header
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'XXXXXX - Comunidad Deportiva de Resistencia',
  description: 'Plataforma digital para afiliados y eventos deportivos de resistencia.',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <Header/>
          <main className="flex-1">{children}</main>
          
        </div>
      </body>
    </html>
  );
}
