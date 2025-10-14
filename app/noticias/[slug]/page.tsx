// app/noticias/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';

// ---------------- Tipos de la API ----------------
interface ApiPost {
  id: string | number;
  title: string;
  excerpt?: string | null;
  content?: string | null; // algunos backends usan "content"
  body?: string | null;    // tu backend usa "body"
  image?: string | null;
  category?: string | null;
  date?: string | null;        // ISO (ej: "2025-10-12T18:05:00-05:00")
  publish_at?: string | null;  // Soporte alterno
  readTime?: string | null;
  slug: string;
  author?: string | null;
}

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

type ApiResponse = Paginated<ApiPost> | ApiPost[];

// ---------------- Tipo del modelo limpio ----------------
interface NewsArticle {
  id: string | number;
  title: string;
  excerpt: string;
  content: string; // unificamos aquí el "body/content" de la API
  image: string;
  category: string;
  date: string; // ISO
  readTime: string;
  slug: string;
  author: string;
}

// ✅ Tipado para App Router (Next 15) usando `params` como Promise
interface NoticiaPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ---------------- Utils ----------------
function unwrapApi(data: ApiResponse): ApiPost[] {
  return Array.isArray((data as Paginated<ApiPost>)?.results)
    ? (data as Paginated<ApiPost>).results
    : (data as ApiPost[]);
}

function hasHTML(text: string): boolean {
  // detección básica de HTML para decidir el render
  return /<\/?[a-z][\s\S]*>/i.test(text);
}

function mapApiPostToNews(item: ApiPost): NewsArticle {
  const date = item.date ?? item.publish_at ?? new Date().toISOString();
  // Unificamos el contenido priorizando "content" y luego "body"
  const unifiedContent = (item.content ?? item.body ?? '').trim();

  return {
    id: item.id,
    title: item.title,
    excerpt: item.excerpt ?? '',
    content: unifiedContent,
    image: item.image || 'https://placehold.co/1600x900?text=Noticia',
    category: item.category || 'Noticias',
    date,
    readTime: item.readTime || '1 min',
    slug: item.slug,
    author: item.author || 'Equipo Editorial',
  };
}

// ---------------- Fetchers ----------------
async function getArticle(slug: string): Promise<NewsArticle | null> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    console.error('Falta NEXT_PUBLIC_API_BASE_URL');
    return null;
  }

  try {
    // Soportamos backend paginado y no paginado
    const res = await fetch(`${base}/posts/?slug=${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as ApiResponse;
    const raw = unwrapApi(data);
    const found = raw.find((p) => p.slug === slug);
    if (!found) return null;

    return mapApiPostToNews(found);
  } catch (err: unknown) {
    console.error('Error fetching article:', err);
    return null;
  }
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return [];

  try {
    const res = await fetch(`${base}/posts/?ordering=-publish_at`, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as ApiResponse;
    const raw = unwrapApi(data);

    return raw
      .filter((p) => typeof p.slug === 'string' && p.slug.length > 0)
      .map((p) => ({ slug: p.slug }));
  } catch (err: unknown) {
    console.error('Error generating static params (noticias):', err);
    return [];
  }
}

// ---------------- Página ----------------
export default async function NoticiaDetalladaPage({ params }: NoticiaPageProps) {
  const { slug } = await params; // Next 15: params es Promise
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const showHTML = article.content && hasHTML(article.content);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[400px] w-full overflow-hidden border-b border-border">
        <Image
          src={article.image}
          alt={article.title}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back & Header */}
        <div className="mb-8">
            <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link href="/noticias">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a noticias
            </Link>
            </Button>

            <div className="mb-4">
            <Badge>{article.category}</Badge>
            </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(article.date).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readTime} de lectura
            </span>
            {article.author && <span>Por {article.author}</span>}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Contenido ordenado */}
        <div className="prose prose-invert max-w-none">
          {/* Extracto destacado si llega desde la API */}
          {article.excerpt && (
            <p className="text-xl leading-relaxed text-foreground/90">{article.excerpt}</p>
          )}

          {/* Contenido: si hay HTML lo renderizamos como tal; si no, texto con saltos de línea */}
          <div className="mt-8 text-base leading-relaxed text-foreground/80">
            {showHTML ? (
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <div className="whitespace-pre-line">{article.content || article.excerpt}</div>
            )}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Footer Nav */}
        <div className="flex items-center justify-between">
          <Button asChild variant="outline">
            <Link href="/noticias">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ver más noticias
            </Link>
          </Button>

          <Button variant="ghost" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
        </div>
      </article>
    </div>
  );
}
