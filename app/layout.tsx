import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '../components/layout/header';


import { Footer } from '../components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Comunidad Deportiva',
  description: 'Plataforma digital para afiliados y eventos deportivos.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <div id="mobile-menu-portal"></div> {/* <-- AÑADE ESTA LÍNEA AQUÍ */}
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer/>
        </div>
      </body>
    </html>
  );
}
