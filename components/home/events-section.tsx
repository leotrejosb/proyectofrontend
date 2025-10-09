import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

type Difficulty = 'Principiante' | 'Intermedio' | 'Avanzado' | 'Extremo';

interface Event {
  id: string | number;
  title: string;
  date: string; // YYYY-MM-DD
  location: string;
  participants: number;
  maxParticipants: number;
  difficulty: Difficulty;
  image: string;
  slug: string;
}

function mapCompetitionToEvent(item: any): Event {
  return {
    id: item.id,
    title: item.name,
    date: item.start_date,
    location: item.location ?? '',
    participants: typeof item.participants_count === 'number' ? item.participants_count : 0,
    maxParticipants: typeof item.max_participants === 'number' ? item.max_participants : 0,
    difficulty: (item.difficulty as Difficulty) ?? 'Intermedio',
    image: item.image_url || 'https://placehold.co/800x450?text=Competencia',
    slug: item.slug,
  };
}

async function fetchCompetitions(): Promise<Event[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const url = `${base}/competitions/?ordering=start_date`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = await res.json();
  const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
  return results.map(mapCompetitionToEvent);
}

const difficultyColors: Record<Difficulty, string> = {
  Principiante: 'bg-green-100 text-green-700',
  Intermedio: 'bg-yellow-100 text-yellow-700',
  Avanzado: 'bg-orange-600 text-orange-100',
  Extremo: 'bg-red-600 text-red-100',
};

export async function EventsSection() {
  const events = await fetchCompetitions();
  const limited = (events ?? []).slice(0, 3); // nunca más de 3 renderizadas

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
          {limited.map((event, idx) => {
            const safeMax = Math.max(event.maxParticipants || 0, 1);
            const spotsLeft = Math.max(safeMax - (event.participants || 0), 0);
            const percentageFull = Math.min(((event.participants || 0) / safeMax) * 100, 100);

            // La tercera card (idx === 2) se oculta en mobile y md, aparece en lg+
            const visibility = idx === 2 ? 'hidden lg:block' : '';

            return (
              <Card
                key={event.id}
                className={`group overflow-hidden transition-all hover:shadow-lg ${visibility}`}
              >
                <CardHeader className="p-0">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
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
                      <span>{event.location || 'Por definir'}</span>
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

        {!events.length && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Aún no hay competencias publicadas.
          </p>
        )}

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
