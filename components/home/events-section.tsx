import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Extremo';
  image: string;
  slug: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Triatlón Sprint Costa del Sol',
    date: '2025-11-15',
    location: 'Playa Central, Costa del Sol',
    participants: 87,
    maxParticipants: 150,
    difficulty: 'Intermedio',
    image: 'https://images.pexels.com/photos/2524739/pexels-photo-2524739.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'triatlon-sprint-costa-del-sol',
  },
  {
    id: '2',
    title: 'Maratón de Montaña Los Picos',
    date: '2025-11-22',
    location: 'Parque Nacional Los Picos',
    participants: 134,
    maxParticipants: 200,
    difficulty: 'Avanzado',
    image: 'https://images.pexels.com/photos/2803162/pexels-photo-2803162.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'maraton-montana-los-picos',
  },
  {
    id: '3',
    title: 'Ciclismo de Ruta Valle Verde',
    date: '2025-12-05',
    location: 'Valle Verde, Ruta Panorámica',
    participants: 56,
    maxParticipants: 100,
    difficulty: 'Principiante',
    image: 'https://images.pexels.com/photos/2803168/pexels-photo-2803168.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'ciclismo-ruta-valle-verde',
  },
];

const difficultyColors = {
  Principiante: 'bg-green-100 text-green-700',
  Intermedio: 'bg-yellow-100 text-yellow-700',
  Avanzado: 'bg-orange-600 text-orange-100',
  Extremo: 'bg-red-600 text-red-100',
};

export function EventsSection() {
  return (
    <section className="border-b border-border bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Próximas Competencias
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Inscríbete y demuestra tu capacidad
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/competencias">
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mockEvents.map((event) => {
            const spotsLeft = event.maxParticipants - event.participants;
            const percentageFull = (event.participants / event.maxParticipants) * 100;

            return (
              <Card key={event.id} className="group overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="p-0">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge
                      className={`absolute right-4 top-4 border ${difficultyColors[event.difficulty]}`}
                      variant="outline"
                    >
                      {event.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="mb-3 text-xl group-hover:text-primary transition-colors">
                    <Link href={`/competencias/${event.slug}`}>{event.title}</Link>
                  </CardTitle>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>
                        {new Date(event.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>
                        {event.participants} / {event.maxParticipants} participantes
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>Cupos disponibles</span>
                      <span className="font-medium">{spotsLeft} restantes</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${percentageFull}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full group/btn">
                    <Link href={`/competencias/${event.slug}`}>
                      Inscribirme
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="ghost">
            <Link href="/competencias">
              Ver todas las competencias
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
