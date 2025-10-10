import Image from 'next/image';
import Link from 'next/link';
import { Heart, Lightbulb, Users, Shield, Award, Target } from 'lucide-react';
import { Button } from '../../components/ui/button'; // Ajusta la ruta a tus componentes

export default function QuienesSomosPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* --- Sección Hero --- */}
      <section className="py-20 text-center bg-muted/30">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Apasionados por el rendimiento, dedicados a la comunidad
          </h1>
          <img src="https://thumbs.dreamstime.com/b/foto-horizontal-del-joven-atleta-con-buen-aspecto-entrenando-la-pelota-de-medicina-en-el-gimnasio-modelo-hombre-fitness-haciendo-380285778.jpg" alt="" className=" w-200 h-100 object-cover rounded-3xl mx-auto my-10" />
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Somos más que una plataforma; somos un movimiento de atletas, entrenadores y entusiastas unidos por el amor al deporte y la superación personal.
          </p>
        </div>
      </section>

      {/* --- Sección Misión y Visión --- */}
      <section className="py-24 sm:py-32" >
        <div className="mx-auto max-w-7xl px-4">

            
            {/* ✅ SECCIÓN CORREGIDA PARA SER RESPONSIVA */}
            <div className="grid grid-cols-1 gap-40 max-w-3l  md:grid-cols-2  mx-auto">
                
                {/* Columna 1: Misión */}
                <div>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3 justify-center">
                    <Target className="h-8 w-8 text-primary " />
                    Nuestra Misión
                </h2>
                <p className="mt-4 text-muted-foreground text-center">
                    Proveer a cada atleta, sin importar su nivel, las herramientas, el conocimiento y la comunidad necesarios para alcanzar su máximo potencial. Creemos en un enfoque integral que combina entrenamiento, nutrición y apoyo mutuo.
                </p>
                </div>

                {/* Columna 2: Visión */}
                <div>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3 justify-center">
                    <Award className="h-8 w-8 text-primary" />
                    Nuestra Visión
                </h2>
                <p className="mt-4 text-muted-foreground text-center">
                    Ser la comunidad deportiva digital más grande y solidaria de Latinoamérica, donde cada miembro se sienta inspirado para superar sus límites y celebrar cada logro, grande o pequeño.
                </p>
                </div>
                
            </div>
            
        </div>
        </section>

      {/* --- Sección de Valores --- */}
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Los Pilares que nos Guían
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Nuestras acciones y decisiones se basan en estos principios fundamentales.
          </p>
          <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Pasión</h3>
              <p className="mt-2 text-muted-foreground">
                Vivimos y respiramos por el deporte. Esta pasión es el motor que impulsa todo lo que hacemos.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Innovación</h3>
              <p className="mt-2 text-muted-foreground">
                Buscamos constantemente las mejores herramientas y metodologías para potenciar tu entrenamiento.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Comunidad</h3>
              <p className="mt-2 text-muted-foreground">
                Creemos que juntos somos más fuertes. Fomentamos un ambiente de apoyo, respeto y camaradería.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* --- Sección del Equipo --- */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Conoce al Equipo Fundador
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Las personas que convirtieron una idea en una realidad.
          </p>
          <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* Miembro del equipo 1 */}
            <div className="flex flex-col items-center">
              <img src="https://th.bing.com/th/id/OIP.rAzD2jdKAoX6FNR7NBDTqgHaFg?w=231&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3" alt="" className="w-64 h-64 object-cover rounded-full border-3 border-white shadow-md"/>
              <h3 className="mt-4 text-xl font-semibold">Juan Pérez</h3>
              <p className="text-primary">CEO y Fundador</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Atleta de toda la vida y visionario. Creó la plataforma para resolver los problemas que él mismo enfrentó.
              </p>
            </div>
            {/* Miembro del equipo 2 */}
            <div className="flex flex-col items-center">
              <img src="https://img.freepik.com/fotos-premium/mujer-negocios-retrato-oficina-trabajadora-empresa-vision-corporativa-e-innovacion-sonrisa-mujer-negra-feliz-lista-crecimiento-empresarial-gestion-web-planificacion-estrategias-empleados_590464-109839.jpg" alt=""  className="w-64 h-64 object-cover rounded-full border-3 border-white shadow-md"/>
              <h3 className="mt-4 text-xl font-semibold">Amina Diallo</h3>
              <p className="text-primary">Directora de Comunidad</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Experta en crear conexiones y la responsable de que nuestra comunidad se sienta como una gran familia.
              </p>
            </div>
            {/* Miembro del equipo 3 */}
            <div className="flex flex-col items-center">
              <img src="https://as2.ftcdn.net/v2/jpg/05/99/61/35/1000_F_599613531_s1POlzHAggfwGa9GrZFKRsJGOqBxCCdi.jpg" alt="" className="w-64 h-64 object-cover rounded-full border-3 border-white shadow-md"/>
              <h3 className="mt-4 text-xl font-semibold">Carlos Rodriguez</h3>
              <p className="text-primary">Jefe de Tecnología</p>
              <p className="mt-2 text-sm text-muted-foreground">
                El arquitecto detrás de nuestra plataforma, asegurando que sea rápida, confiable y fácil de usar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Sección de Llamada a la Acción (CTA) --- */}
      <section className="bg-primary/5 border-t border-primary/10 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            ¿Listo para unirte a la comunidad?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Crea tu perfil, explora nuestros planes de entrenamiento y conéctate con atletas que comparten tu misma pasión. Tu próximo récord personal te está esperando.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/registro">Empieza ahora, es gratis</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}