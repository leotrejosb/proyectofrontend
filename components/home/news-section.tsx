import Link from 'next/link';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';

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

const mockNews: NewsArticle[] = [
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
];

export function NewsSection() {
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

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mockNews.map((article) => (
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
                <Button asChild variant="ghost" className="group/btn w-full">
                  <Link href={`/noticias/${article.slug}`}>
                    Leer más
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

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
