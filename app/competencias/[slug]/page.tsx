import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, ArrowLeft, Share2, Users, Clock, Trophy, Info } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';

// --- Interfaces ---
interface ApiCompetition {
  id: string | number;
  name: string;
  description?: string;
  start_date: string;
  location?: string;
  participants_count?: number;
  max_participants?: number;
  difficulty?: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Extremo';
  image_url?: string;
  slug: string;
  registration_deadline?: string;
  distance?: string;
  start_time?: string;
  categories?: string[];
  prizes?: string[];
  requirements?: string[];
}

interface Competition {
  id: string | number;
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  date: string;
  location: string;
  image: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Extremo';
  participants: number;
  maxParticipants: number;
  registrationDeadline: string;
  distance: string;
  startTime: string;
  categories: string[];
  prizes: string[];
  requirements: string[];
}

// ✅ INICIO DE LA CORRECCIÓN: Se define la interfaz para las props de la página
interface CompetenciaPageProps {
  params: {
    slug: string;
  };
}
// ✅ FIN DE LA CORRECCIÓN

const difficultyColors: { [key: string]: string } = {
  Principiante: 'border-green-500/50 bg-green-500/10 text-green-600',
  Intermedio: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-600',
  Avanzado: 'border-orange-500/50 bg-orange-500/10 text-orange-600',
  Extremo: 'border-red-500/50 bg-red-500/10 text-red-600',
};

// --- Mapper ---
function mapApiToCompetition(item: ApiCompetition): Competition {
  return {
    id: item.id,
    slug: item.slug,
    title: item.name,
    description: item.description || 'Descripción no disponible',
    fullDescription: item.description || 'Información completa próximamente.',
    date: item.start_date,
    location: item.location || 'Ubicación por definir',
    image: item.image_url || `https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1200`,
    difficulty: item.difficulty || 'Intermedio',
    participants: item.participants_count || 0,
    maxParticipants: item.max_participants || 100,
    registrationDeadline: item.registration_deadline || item.start_date,
    distance: item.distance || 'Por definir',
    startTime: item.start_time || '07:00 AM',
    categories: item.categories || ['General'],
    prizes: item.prizes || ['Medallas para todos los finishers'],
    requirements: item.requirements || ['Certificado médico vigente', 'Edad mínima: 18 años'],
  };
}

// --- Fetch Competition ---
async function getCompetition(slug: string): Promise<Competition | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!apiUrl) {
    console.error('API URL not configured');
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/competitions/?slug=${slug}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
    
    // ✅ Filtrar por slug en el cliente
    const competition = results.find((comp: any) => comp.slug === slug);
    
    if (!competition) {
      return null;
    }

    return mapApiToCompetition(competition);
  } catch (error) {
    console.error('Error fetching competition:', error);
    return null;
  }
}

// --- Generate Static Params ---
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!apiUrl) {
    return [];
  }

  try {
    const res = await fetch(`${apiUrl}/competitions/`);
    if (!res.ok) return [];
    
    const data = await res.json();
    const results: ApiCompetition[] = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
    
    return results.map((comp) => ({
      slug: comp.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}


// --- Component ---
// ✅ INICIO DE LA CORRECCIÓN: Se utiliza la nueva interfaz en la firma del componente
export default async function CompetenciaDetalladaPage({ params }: CompetenciaPageProps) {
// ✅ FIN DE LA CORRECCIÓN
  const { slug } = params;
  const competition = await getCompetition(slug);

  if (!competition) {
    notFound();
  }

  const isFull = competition.participants >= competition.maxParticipants;
  const spotsLeft = competition.maxParticipants - competition.participants;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-[400px] w-full overflow-hidden border-b border-border">
        <img
          src={competition.image} 
          alt={competition.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link href="/competencias">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a competencias
            </Link>
          </Button>

          {/* Header Info */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" className={`border ${difficultyColors[competition.difficulty]}`}>
              {competition.difficulty}
            </Badge>
            {isFull && (
              <Badge variant="destructive">Cupos agotados</Badge>
            )}
            {!isFull && spotsLeft <= 20 && (
              <Badge variant="outline" className="border-orange-500/50 bg-orange-500/10 text-orange-600">
                ¡Solo {spotsLeft} cupos disponibles!
              </Badge>
            )}
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {competition.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-6">
            {competition.description}
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs">Fecha del evento</div>
                <div className="font-medium text-foreground">
                  {new Date(competition.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs">Ubicación</div>
                <div className="font-medium text-foreground">{competition.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs">Hora de inicio</div>
                <div className="font-medium text-foreground">{competition.startTime}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs">Participantes</div>
                <div className="font-medium text-foreground">
                  {competition.participants} / {competition.maxParticipants}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Info className="h-6 w-6 text-primary" />
                Sobre la Competencia
              </h2>
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-line text-base leading-relaxed text-foreground/80">
                  {competition.fullDescription}
                </div>
              </div>
            </div>

            {/* Distance */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Distancias y Recorrido
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-foreground">{competition.distance}</p>
              </CardContent>
            </Card>

            {/* Categories */}
            <div>
              <h3 className="text-xl font-bold mb-4">Categorías</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {competition.categories.map((category, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg border border-border bg-muted/30 text-sm"
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>

            {/* Prizes */}
            <div>
              <h3 className="text-xl font-bold mb-4">Premios</h3>
              <ul className="space-y-2">
                {competition.prizes.map((prize, index) => (
                  <li key={index} className="flex items-start gap-2 text-foreground/80">
                    <Trophy className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span>{prize}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-xl font-bold mb-4">Requisitos</h3>
              <ul className="space-y-2">
                {competition.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-foreground/80">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - CTA Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Cierre de inscripciones
                  </div>
                  <div className="font-semibold text-foreground">
                    {new Date(competition.registrationDeadline).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Cupos disponibles</span>
                    <span className="font-medium text-foreground">
                      {spotsLeft} de {competition.maxParticipants}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full bg-primary transition-all" 
                      style={{ width: `${(competition.participants / competition.maxParticipants) * 100}%` }}
                    />
                  </div>
                </div>

                <Separator />

                {isFull ? (
                  <Button disabled className="w-full" size="lg">
                    Cupos agotados
                  </Button>
                ) : (
                  <Button className="w-full" size="lg">
                    Inscríbete ahora
                  </Button>
                )}

                <Button variant="outline" className="w-full" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartir competencia
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Al inscribirte aceptas nuestros términos y condiciones
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between">
          <Button asChild variant="outline">
            <Link href="/competencias">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ver todas las competencias
            </Link>
          </Button>

          {!isFull && (
            <Button asChild size="lg">
              <Link href="#">Inscríbete ahora</Link>
            </Button>
          )}
        </div>
      </article>
    </div>
  );
}