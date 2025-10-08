import Link from 'next/link';
import { CircleCheck as CheckCircle2, Mail, Chrome as Home, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

export default function AfiliacionExitoPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            ¡Solicitud Recibida con Éxito!
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tu solicitud de afiliación ha sido enviada y está siendo procesada
          </p>
        </div>

        <Card className="mt-12">
          <CardContent className="p-8">
            <h2 className="mb-6 text-xl font-semibold text-foreground">Próximos Pasos</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Revisa tu correo</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Te hemos enviado un correo de confirmación con los detalles de tu solicitud y los siguientes pasos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Verificación</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Nuestro equipo revisará tu solicitud en las próximas 24-48 horas. Te notificaremos cuando tu cuenta esté activa.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Comienza a competir</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Una vez activada tu cuenta, podrás inscribirte en competencias y acceder a todos los beneficios de tu membresía.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/competencias">
              <Calendar className="mr-2 h-4 w-4" />
              Ver Competencias
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
