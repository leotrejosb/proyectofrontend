import Link from 'next/link';
import { ArrowRight, Trophy, Users, Calendar } from 'lucide-react';
import { Button } from '../ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-background to-muted">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Comunidad de Atletas
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Supera tus límites.{' '}
              <span className="text-primary">Únete a XXXXXX</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground">
              Compite con los mejores. Accede a competencias exclusivas, monitorea tu progreso y forma parte de una comunidad con la excelencia deportiva.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="group">
                <Link href="#">
                  Afiliarme Ahora
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/competencias">Ver Competencias</Link>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-primary">
                  <Trophy className="h-5 w-5" />
                  <span className="text-2xl font-bold">40+</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Eventos Anuales</p>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-primary">
                  <Users className="h-5 w-5" />
                  <span className="text-2xl font-bold">160+</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Afiliados Activos</p>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-primary">
                  <Calendar className="h-5 w-5" />
                  <span className="text-2xl font-bold">8</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Años de Trayectoria</p>
              </div>
            </div>
          </div>

          <div className="relative lg:mt-0">
            <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              <img
                src="https://images.pexels.com/photos/2803158/pexels-photo-2803158.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Atleta corriendo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-2xl bg-primary/20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
