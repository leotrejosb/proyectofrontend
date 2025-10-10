'use client';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, Clock } from 'lucide-react';
import Link from 'next/link';


export default function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  const socialLinks = [
    { name: 'Facebook', href: '/', icon: Facebook },
    { name: 'Instagram', href: '/', icon: Instagram },
    { name: 'Twitter', href: '/', icon: Twitter },
  ];


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    alert('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
    setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* --- Sección Hero --- */}
      <section className="py-20 text-center bg-muted/30">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Estamos aquí para ayudarte 😊
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            ¿Tienes preguntas, sugerencias o simplemente quieres saludar? Nos encantaría saber de ti. Tu opinión nos ayuda a crecer juntos.
          </p>
        </div>
      </section>

      {/* --- Sección de Formulario y Datos de Contacto --- */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            
            {/* Columna 1: Formulario de Contacto */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-8">
                Envíanos un mensaje
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="asunto" className="block text-sm font-medium mb-2">
                    Asunto
                  </label>
                  <input
                    type="text"
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>
                
                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={6}
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Cuéntanos más sobre tu consulta..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Enviar mensaje
                </button>
              </form>
            </div>

            {/* Columna 2: Información de Contacto */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-8">
                Información de contacto
              </h2>
              <div className="space-y-8">
                
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">contacto@tuplatforma.com</p>
                    <p className="text-muted-foreground">soporte@tuplatforma.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Teléfono</h3>
                    <p className="text-muted-foreground">+57 300 123 4567</p>
                    <p className="text-sm text-muted-foreground mt-1">Lun - Vie: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Ubicación</h3>
                    <p className="text-muted-foreground">Dosquebradas, Risaralda</p>
                    <p className="text-muted-foreground">Colombia</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Horario de atención</h3>
                    <p className="text-muted-foreground">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                    <p className="text-muted-foreground">Sábados: 10:00 AM - 2:00 PM</p>
                    <p className="text-muted-foreground">Domingos: Cerrado</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Sección de Preguntas Frecuentes --- */}
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Preguntas Frecuentes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Encuentra respuestas rápidas a las consultas más comunes
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-background rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold mb-2">¿Cuánto tiempo tarda la respuesta?</h3>
              <p className="text-muted-foreground">
                Normalmente respondemos dentro de las 24 horas hábiles. Para consultas urgentes, puedes llamarnos directamente.
              </p>
            </div>

            <div className="bg-background rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold mb-2">¿Ofrecen soporte técnico?</h3>
              <p className="text-muted-foreground">
                ¡Por supuesto! Nuestro equipo técnico está disponible para ayudarte con cualquier problema relacionado con la plataforma.
              </p>
            </div>

            <div className="bg-background rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold mb-2">¿Puedo programar una llamada?</h3>
              <p className="text-muted-foreground">
                Sí, envíanos un mensaje indicando tu disponibilidad y coordinaremos una llamada contigo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Sección de Redes Sociales --- */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Síguenos en redes sociales
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Únete a nuestra comunidad y mantente al día con las últimas novedades, tips de entrenamiento y contenido exclusivo.
          </p>
          <div className="mt-16 flex flex-col gap-20 items-center md:gap-60 md:flex-row md:justify-center">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label={item.name}
                >
                  <Icon className="h-10 w-10 md:h-15 md:w-15"/>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- Sección CTA Final --- */}
      <section className="bg-primary/5 border-t border-primary/10 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            ¿Aún no eres parte de la comunidad?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Regístrate gratis y comienza tu viaje hacia tus objetivos deportivos hoy mismo.
          </p>
          <div className="mt-8">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-lg">
              Únete ahora
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}