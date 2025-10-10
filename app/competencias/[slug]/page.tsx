import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
  author: string;
}

export function generateStaticParams() {
  return [
    { slug: 'gran-triatlon-nacional-2025' },
    { slug: 'nuevos-records-maraton-montana' },
  ];
}

const articles: NewsArticle[] = [
  {
    id: '1',
    title: 'Gran Triatlón Nacional 2025: Inscripciones Abiertas',
    excerpt: 'El evento más esperado del año abre sus puertas. Participa en natación, ciclismo y carrera en un recorrido desafiante.',
    content: `El Gran Triatlón Nacional 2025 está oficialmente abierto para inscripciones. Este es el evento más importante del calendario deportivo nacional, reuniendo a los mejores atletas de resistencia del país.

La competencia incluirá tres disciplinas: natación de 1.5 km en aguas abiertas, ciclismo de 40 km en ruta montañosa, y carrera a pie de 10 km. El recorrido ha sido diseñado para poner a prueba la resistencia, técnica y determinación de cada participante.

**Fechas importantes:**
- Inicio de inscripciones: 1 de octubre de 2025
- Cierre de inscripciones: 1 de noviembre de 2025
- Fecha del evento: 15 de noviembre de 2025

**Categorías:**
- Elite (18-39 años)
- Master (40+ años)
- Por equipos

Los primeros 100 inscritos recibirán un kit de bienvenida especial con equipamiento técnico patrocinado por nuestros aliados. No pierdas esta oportunidad de demostrar tu capacidad y formar parte de la historia deportiva nacional.

Para más información sobre el reglamento, costos de inscripción y detalles del recorrido, visita nuestra sección de competencias o contacta directamente con nuestro equipo organizador.`,
    image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Competencias',
    date: '2025-10-01',
    readTime: '3 min',
    slug: 'gran-triatlon-nacional-2025',
    author: 'Equipo XXXXXX',
  },
  {
    id: '2',
    title: 'Nuevos Récords Alcanzados en la Maratón de Montaña',
    excerpt: 'Conoce a los atletas que rompieron récords históricos en la última competencia de trail running.',
    content: `La reciente edición de la Maratón de Montaña Los Picos fue testigo de momentos históricos, con múltiples récords rotos en diferentes categorías.

María González estableció un nuevo récord femenino al completar el recorrido de 42 km en 3 horas y 28 minutos, superando el récord anterior por más de 5 minutos. En la categoría masculina, Carlos Ramírez terminó en 2 horas y 52 minutos, también un nuevo récord nacional.

**Condiciones del evento:**
El clima fue desafiante, con temperaturas oscilando entre 8°C y 15°C, y una humedad del 65%. El recorrido incluyó un desnivel acumulado de 1,850 metros, atravesando bosques densos y zonas rocosas que pusieron a prueba a todos los participantes.

**Destacados:**
- 234 atletas completaron la competencia
- 12 nuevos récords personales registrados
- 100% de satisfacción de los participantes según encuesta post-evento

Felicitamos a todos los competidores por su esfuerzo y dedicación. Estos resultados demuestran el alto nivel de preparación de nuestra comunidad deportiva.`,
    image: 'https://images.pexels.com/photos/2803160/pexels-photo-2803160.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Resultados',
    date: '2025-09-28',
    readTime: '5 min',
    slug: 'nuevos-records-maraton-montana',
    author: 'Equipo XXXXXX',
  },
];

export default function NoticiaDetalladaPage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[400px] w-full overflow-hidden border-b border-border">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
      </div>

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link href="/noticias">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a noticias
            </Link>
          </Button>

          <Badge className="mb-4">{article.category}</Badge>

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
            <span>Por {article.author}</span>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="prose prose-invert max-w-none">
          <p className="text-xl leading-relaxed text-foreground/90">{article.excerpt}</p>

          <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-foreground/80">
            {article.content}
          </div>
        </div>

        <Separator className="my-12" />

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
