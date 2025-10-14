'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Search } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

// --------- Tipos ---------
interface ApiPost {
  id: string | number;
  title: string;
  excerpt?: string | null;
  image?: string | null;
  category?: string | null;
  date?: string | null; // ISO
  readTime?: string | null;
  slug: string;
}

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

type ApiResponse = Paginated<ApiPost> | ApiPost[];

interface NewsArticle {
  id: string | number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
}

// --------- Utils ---------
function mapApiPostToNews(item: ApiPost): NewsArticle {
  return {
    id: item.id,
    title: item.title,
    excerpt: item.excerpt ?? '',
    image: item.image || 'https://placehold.co/800x450?text=Noticia',
    category: item.category || 'Noticias',
    date: item.date || new Date().toISOString(),
    readTime: item.readTime || '3 min',
    slug: item.slug,
  };
}

function unwrapApi(data: ApiResponse): ApiPost[] {
  return Array.isArray((data as Paginated<ApiPost>)?.results)
    ? (data as Paginated<ApiPost>).results
    : (data as ApiPost[]);
}

function isAbortError(err: unknown): boolean {
  if (err && typeof err === 'object' && 'name' in (err as Record<string, unknown>)) {
    const name = (err as { name?: unknown }).name;
    return typeof name === 'string' && name === 'AbortError';
  }
  return false;
}

// --------- Página ---------
export default function NoticiasPage() {
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  useEffect(() => {
    const ctrl = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!base) throw new Error('Falta NEXT_PUBLIC_API_BASE_URL');

        // Trae la primera página OR el arreglo completo
        const url = `${base}/posts/?ordering=-publish_at`;
        const res = await fetch(url, { signal: ctrl.signal, headers: { accept: 'application/json' } });
        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = (await res.json()) as ApiResponse;
        const raw = unwrapApi(data);

        // Si tu backend es paginado y quieres traer TODO:
        // puedes iterar "next" aquí (loop) hasta completar, si lo necesitas.
        // Por simplicidad, usamos el primer batch (o arreglo).

        const cleaned = raw.map(mapApiPostToNews);
        setAllNews(cleaned);
      } catch (e: unknown) {
        if (isAbortError(e)) return;
        setError('No se pudieron cargar las noticias.');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => ctrl.abort();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>(['Todas']);
    allNews.forEach(n => set.add(n.category));
    return Array.from(set);
  }, [allNews]);

  const filteredNews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allNews.filter((article) => {
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === 'Todas' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allNews, searchQuery, selectedCategory]);

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
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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

        {loading && (
          <div className="py-12 text-center text-muted-foreground">Cargando noticias…</div>
        )}

        {!loading && error && (
          <div className="py-12 text-center text-red-600">{error}</div>
        )}

        {!loading && !error && (
          filteredNews.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredNews.map((article) => (
                <Card key={article.id} className="group overflow-hidden transition-all hover:shadow-lg">
                  <CardHeader className="p-0">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                          day: 'numeric', month: 'long', year: 'numeric',
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
          )
        )}
      </div>
    </div>
  );
}
