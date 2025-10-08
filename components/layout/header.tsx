// components/layout/header.js

'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Quienes Somos', href: '/quienes-somos' },
    { name: 'Noticias', href: '/noticias' },
    { name: 'Competencias', href: '/competencias' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Agregar/Actualizar', href: '/newsCreateUpdate' },
  ];

  const mobileMenuPanel = (
    <div className="lg:hidden">
      <div 
        className="fixed inset-0 z-40 bg-black/15"
        onClick={() => setMobileMenuOpen(false)} 
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background/80 px-4 py-4 sm:max-w-sm backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="-m-1.5 p-1.5">
            <span className="text-xl font-bold text-primary"></span>
          </div>
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">Cerrar menú</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-border">
            <div className="space-y-2 py-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-card"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="py-6 space-y-2">
              <Button asChild className="w-full">
                <Link href="/afiliacion" onClick={() => setMobileMenuOpen(false)}>
                  Afiliarme Ahora
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-2xl font-bold text-primary">XXXXXX</span>
            </Link>
          </div>

          {/* 👇 AQUÍ ESTÁ EL CAMBIO APLICADO 👇 */}
          { !mobileMenuOpen && (
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Abrir menú principal</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          )}
          
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-foreground transition-colors hover:text-primary">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Button asChild size="sm">
              <Link href="/afiliacion">Afiliarme Ahora</Link>
            </Button>
          </div>
        </nav>
      </header>

      {isMounted && mobileMenuOpen && createPortal(
        mobileMenuPanel,
        document.getElementById('mobile-menu-portal')!
      )}
    </>
  );
}