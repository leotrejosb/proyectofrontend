import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Noticias', href: '/noticias' },
      { name: 'Competencias', href: '/competencias' },
      { name: 'Afiliación', href: '/afiliacion' },
    ],
    legal: [
      { name: 'Contacto', href: '/contacto' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: '/', icon: Facebook },
    { name: 'Instagram', href: '/', icon: Instagram },
    { name: 'Twitter', href: '/', icon: Twitter },
    { name: 'Email', href: '/', icon: Mail },
  ];

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* === BLOQUE 1: Logo, Eslogan y Redes Sociales (Centrado) === */}
        <div className="flex flex-col items-center text-center">
          <Link href="/">
            <span className="text-2xl font-bold text-primary">XXXXXX</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Compite, Conquista y Repite.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label={item.name}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* === BLOQUE 2: Columnas de Enlaces (Izquierda y Derecha) === */}
        <div className="mt-8 border-t border-border pt-8">
          <div className="flex flex-col gap-8 text-center sm:flex-row sm:justify-between sm:text-left">
            
            {/* Columna Izquierda: Plataforma */}
            <div>
              <h3 className="text-sm font-semibold text-foreground">Plataforma</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.platform.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna Derecha: Más Información */}
            <div>
              <h3 className="text-sm font-semibold text-foreground">Más Información</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* === BLOQUE 3: Copyright === */}
        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} XXXXXX. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}