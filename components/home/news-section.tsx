'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';

interface NewsArticle {
  id: string | number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string; // ISO
  readTime: string;
  slug: string;
}

interface ApiPost {
  id: string | number;
  title: string;
  excerpt: string;
  image?: string | null;
  category?: string | null;
  date?: string | null;
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

// ---- Utils ----
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

function isAbortError(err: unknown): boolean {
  // Compatible en navegador y ambientes donde DOMException no esté presente
  if (err && typeof err === 'object' && 'name' in (err as Record<string, unknown>)) {
    const name = (err as { name?: unknown }).name;
    return typeof name === 'string' && name === 'AbortError';
  }
  return false;
}

function unwrapApi(data: ApiResponse): ApiPost[] {
  return Array.isArray((data as Paginated<ApiPost>)?.results)
    ? (data as Paginated<ApiPost>).results
    : (data as ApiPost[]);
}

export function NewsSection() {
  const [posts, setPosts] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!base) {
          throw new Error('La URL base de la API no está configurada (NEXT_PUBLIC_API_BASE_URL).');
        }

        const url = `${base}/posts/?ordering=-publish_at`;
        const res = await fetch(url, {
          signal: ctrl.signal,
          headers: { accept: 'application/json' },
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = (await res.json()) as ApiResponse;
        const raw = unwrapApi(data);
        setPosts(raw.map(mapApiPostToNews));
      } catch (e: unknown) {
        if (isAbortError(e)) return; // se canceló la petición, no hacer nada
        setError('No se pudieron cargar las noticias.');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => ctrl.abort();
  }, []);

  const limited = useMemo(() => posts.slice(0, 3), [posts]);

  return (
    <section className="border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Últimas Noticias
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Mantente al día con las novedades de la comunidad
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/noticias">
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Estados */}
        {loading && (
          <p className="mt-12 text-center text-sm text-muted-foreground">Cargando noticias…</p>
        )}
        {!loading && error && (
          <p className="mt-12 text-center text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {limited.map((article, idx) => {
                const visibility = idx === 2 ? 'hidden lg:block' : '';
                return (
                  <Card
                    key={article.id}
                    className={`group overflow-hidden transition-all hover:shadow-lg ${visibility}`}
                  >
                    <CardHeader className="p-0">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        {article.category && (
                          <Badge className="absolute right-4 top-4 bg-primary text-primary-foreground">
                            {article.category}
                          </Badge>
                        )}
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
                      <Button asChild variant="ghost" className="group/btn w-full">
                        <Link href={`/noticias/${article.slug}`}>
                          Leer más
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {!posts.length && (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                Aún no hay noticias publicadas.
              </p>
            )}
          </>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="ghost">
            <Link href="/noticias">
              Ver todas las noticias
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
