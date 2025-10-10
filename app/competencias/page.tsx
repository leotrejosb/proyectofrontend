'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Search, Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

// --- Interfaces de Datos ---

// Interfaz para los datos "crudos" que vienen de la API de Django
interface ApiCompetition {
  id: string | number;
  name: string;
  start_date: string;
  location?: string;
  participants_count?: number;
  max_participants?: number;
  difficulty?: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Extremo';
  image_url?: string;
  slug: string;
}

// Interfaz para los datos "limpios" que usará nuestro componente
interface Competition {
  id: string | number;
  slug: string;
  title: string;
  date: string;
  location: string;
  image: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Extremo';
  participants: number;
  maxParticipants: number;
}

// --- Función Adaptador (Mapper) ---

// Transforma los datos de la API al formato que necesita el frontend
function mapApiToCompetition(item: ApiCompetition): Competition {
  return {
    id: item.id,
    title: item.name,
    date: item.start_date,
    location: item.location ?? 'Ubicación por definir',
    participants: item.participants_count ?? 0,
    maxParticipants: item.max_participants ?? 100,
    difficulty: item.difficulty ?? 'Intermedio',
    image: item.image_url || `https://placehold.co/800x450?text=${item.name.replace(/\s/g, "+")}`,
    slug: item.slug,
  };
}


// --- Constantes para Estilos ---
const difficulties = ['Todas', 'Principiante', 'Intermedio', 'Avanzado', 'Extremo'];

const difficultyColors: { [key: string]: string } = {
  Principiante: 'bg-green-100 text-green-700',
  Intermedio: 'bg-yellow-100 text-yellow-700',
  Avanzado: 'bg-orange-600 text-orange-100',
  Extremo: 'bg-red-600 text-red-100',
};


// --- Componente de la Página ---
export default function CompetenciasPage() {
  const [allCompetitions, setAllCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todas');

  // --- Lógica de Conexión con Backend ---
  useEffect(() => {
    const fetchCompetitions = async () => {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

      try {
        const res = await fetch(`${apiUrl}/competitions/?ordering=start_date`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch competitions');
        }

        const data = await res.json();
        
        const rawResults: ApiCompetition[] = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
        const cleanedData = rawResults.map(mapApiToCompetition);

        setAllCompetitions(cleanedData);

      } catch (error) {
        console.error("Error fetching competitions:", error);
        setAllCompetitions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  // --- Lógica de Filtrado (en el cliente) ---
  const filteredCompetitions = useMemo(() => {
    return allCompetitions.filter((competition) => {
      const matchesSearch = competition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            competition.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'Todas' || competition.difficulty === selectedDifficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [allCompetitions, searchQuery, selectedDifficulty]);

  return (
    <div className="min-h-screen bg-background">
      {/* Encabezado */}
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Próximas Competencias
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Encuentra tu próximo desafío y prepárate para competir.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Barra de Búsqueda y Filtros */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre o lugar..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid de Competencias */}
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground">Cargando competencias...</div>
        ) : filteredCompetitions.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompetitions.map((comp) => {
              const isFull = comp.participants >= comp.maxParticipants;

              return (
                <Card key={comp.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
                  <CardHeader className="p-0">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={comp.image}
                        alt={comp.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <Badge variant="outline" className={`absolute right-4 top-4 border ${difficultyColors[comp.difficulty]}`}>
                        {comp.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow p-6">
                    <h3 className="mb-2 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      <Link href={`/competencias/${comp.slug}`}>{comp.title}</Link>
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(comp.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {comp.location}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col items-start p-6 pt-0">
                      <div className="w-full space-y-1 text-xs text-muted-foreground mb-4">
                          <div className="flex justify-between">
                              <span>Participantes</span>
                              <span>{comp.participants} / {comp.maxParticipants}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                              <div className="h-full bg-primary" style={{ width: `${(comp.participants / comp.maxParticipants) * 100}%` }}/>
                          </div>
                      </div>
                      
                      {/* Botón dinámico */}
                      {isFull ? (
                        <Button variant="ghost" disabled className="w-full">
                          Cupos agotados
                        </Button>
                      ) : (
                        <Button asChild variant="default" className="w-full">
                          <Link href={`/competencias/${comp.slug}`}>Inscríbete ahora</Link>
                        </Button>
                      )}

                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No se encontraron competencias que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}