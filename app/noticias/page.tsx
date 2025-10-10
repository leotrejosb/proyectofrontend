'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Search } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
}

const allNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Gran Triatlón Nacional 2025: Inscripciones Abiertas',
    excerpt: 'El evento más esperado del año abre sus puertas. Participa en natación, ciclismo y carrera en un recorrido desafiante.',
    image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Competencias',
    date: '2025-10-01',
    readTime: '3 min',
    slug: 'gran-triatlon-nacional-2025',
  },
  {
    id: '2',
    title: 'Nuevos Récords Alcanzados en la Maratón de Montaña',
    excerpt: 'Conoce a los atletas que rompieron récords históricos en la última competencia de trail running.',
    image: 'https://images.pexels.com/photos/2803160/pexels-photo-2803160.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Resultados',
    date: '2025-09-28',
    readTime: '5 min',
    slug: 'nuevos-records-maraton-montana',
  },
  {
    id: '3',
    title: 'Beneficios de la Membresía: Todo lo que Necesitas Saber',
    excerpt: 'Descubre todas las ventajas de ser parte de nuestra comunidad y cómo aprovechar al máximo tu afiliación.',
    image: 'https://images.pexels.com/photos/2803162/pexels-photo-2803162.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Comunidad',
    date: '2025-09-25',
    readTime: '4 min',
    slug: 'beneficios-membresia',
  },
  {
    id: '4',
    title: 'Guía de Entrenamiento: Preparación para Triatlones',
    excerpt: 'Consejos esenciales de nuestros entrenadores profesionales para maximizar tu rendimiento.',
    image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Entrenamiento',
    date: '2025-09-20',
    readTime: '8 min',
    slug: 'guia-entrenamiento-triatlones',
  },
  {
    id: '5',
    title: 'Nutrición Deportiva: Plan de Alimentación Pre-Competencia',
    excerpt: 'Lo que debes comer antes, durante y después de una competencia de resistencia.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Nutrición',
    date: '2025-09-15',
    readTime: '6 min',
    slug: 'nutricion-deportiva-plan-alimentacion',
  },
  {
    id: '6',
    title: 'Equipo Recomendado para Ciclismo de Montaña',
    excerpt: 'Revisión completa del equipamiento esencial para enfrentar terrenos exigentes con seguridad.',
    image: 'https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Equipo',
    date: '2025-09-10',
    readTime: '7 min',
    slug: 'equipo-recomendado-ciclismo-montana',
  },
];

const categories = ['Todas', 'Competencias', 'Resultados', 'Comunidad', 'Entrenamiento', 'Nutrición', 'Equipo'];

export default function NoticiasPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const filteredNews = allNews.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Noticias y Artículos
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Mantente informado con las últimas novedades de nuestra comunidad
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar noticias..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {filteredNews.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((article) => (
              <Card key={article.id} className="group overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="p-0">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge className="absolute right-4 top-4 bg-primary text-primary-foreground">
                      {article.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(article.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    <Link href={`/noticias/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild variant="ghost" className="w-full">
                    <Link href={`/noticias/${article.slug}`}>Leer más</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No se encontraron noticias que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
