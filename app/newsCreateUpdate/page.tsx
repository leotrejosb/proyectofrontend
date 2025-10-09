'use client';

import { useState, useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
// import { Textarea } from '@/components/ui/textarea'; // Podríamos usarlo para una descripción
import { ListPlus, Edit } from 'lucide-react';

// Interfaz que definiste
interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Extremo';
  image: string; // URL de la imagen
  slug: string;
}

// --- Componente para Agregar Competencia (Columna Izquierda) ---
function AgregarCompetenciaForm() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    maxParticipants: 100,
    difficulty: 'Intermedio',
    image: '',
    slug: '',
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleSlugGeneration = () => {
    const newSlug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
      .replace(/[\s_-]+/g, '-') // Reemplazar espacios y guiones por uno solo
      .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio/final
    handleInputChange('slug', newSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando nueva competencia:', formData);
    
    // --- LÓGICA DE BACKEND ---
    // Aquí harías una petición POST a tu API de Django
    // try {
    //   const response = await fetch('/api/competencias/', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData),
    //   });
    //   if (response.ok) {
    //     alert('¡Competencia creada con éxito!');
    //     // Limpiar formulario o recargar la página/lista
    //   } else {
    //     alert('Error al crear la competencia.');
    //   }
    // } catch (error) {
    //   console.error('Error de red:', error);
    // }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListPlus className="h-6 w-6" />
          Agregar Nueva Competencia
        </CardTitle>
        <CardDescription>Completa los datos para registrar un nuevo evento.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... Aquí van todos los campos del formulario ... */}
          <div className="space-y-2">
            <Label htmlFor="title">Título del Evento</Label>
            <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} onBlur={handleSlugGeneration} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL amigable)</Label>
            <Input id="slug" value={formData.slug} onChange={(e) => handleInputChange('slug', e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" type="date" value={formData.date} onChange={(e) => handleInputChange('date', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input id="location" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} required />
            </div>
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="maxParticipants">Máx. Participantes</Label>
                <Input id="maxParticipants" type="number" value={formData.maxParticipants} onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value, 10))} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="difficulty">Dificultad</Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una dificultad" />
                    </SelectTrigger>
                    <SelectContent className='bg-background/95'>
                        <SelectItem value="Principiante">Principiante</SelectItem>
                        <SelectItem value="Intermedio">Intermedio</SelectItem>
                        <SelectItem value="Avanzado">Avanzado</SelectItem>
                        <SelectItem value="Extremo">Extremo</SelectItem>
                    </SelectContent>
                </Select>
            </div>
           </div>
          <div className="space-y-2">
            <Label htmlFor="image">Imagen Principal</Label>
            <Input id="image" type="file"  value={formData.image} onChange={(e) => handleInputChange('image', e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Crear Competencia</Button>
        </form>
      </CardContent>
    </Card>
  );
}

// --- Componente para Actualizar Competencia (Columna Derecha) ---
function ActualizarCompetenciaPanel() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [formData, setFormData] = useState<Partial<Event>>({});

  // --- LÓGICA DE BACKEND (Cargar eventos) ---
  useEffect(() => {
    // Simulación de fetch a tu API para obtener la lista de eventos
    const fetchEvents = async () => {
        // const response = await fetch('/api/competencias/');
        // const data = await response.json();
        // setEvents(data);
        
        // Datos de ejemplo mientras desarrollas
        const mockEvents: Event[] = [
            { id: '1', title: 'Carrera 5K Pereira', slug: 'carrera-5k-pereira', date: '2025-11-15', location: 'Parque Olaya Herrera', participants: 50, maxParticipants: 200, difficulty: 'Principiante', image: '' },
            { id: '2', title: 'Maratón del Eje Cafetero', slug: 'maraton-eje-cafetero', date: '2026-02-20', location: 'Salento, Quindío', participants: 120, maxParticipants: 500, difficulty: 'Avanzado', image: '' },
        ];
        setEvents(mockEvents);
    };
    fetchEvents();
  }, []);

  // Cargar datos del evento seleccionado en el formulario
  useEffect(() => {
    if (selectedEventId) {
        const selectedEvent = events.find(event => event.id === selectedEventId);
        setFormData(selectedEvent || {});
    } else {
        setFormData({});
    }
  }, [selectedEventId, events]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) {
        alert("Por favor, selecciona una competencia para actualizar.");
        return;
    }
    console.log(`Actualizando competencia ${selectedEventId}:`, formData);

    // --- LÓGICA DE BACKEND ---
    // Aquí harías una petición PUT o PATCH a tu API de Django
    // try {
    //   const response = await fetch(`/api/competencias/${formData.slug}/`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData),
    //   });
    //   if (response.ok) {
    //     alert('¡Competencia actualizada con éxito!');
    //   } else {
    //     alert('Error al actualizar la competencia.');
    //   }
    // } catch (error) {
    //   console.error('Error de red:', error);
    // }
  };

  return (
     <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Edit className="h-6 w-6" />
            Actualizar Competencia Existente
        </CardTitle>
        <CardDescription>Selecciona un evento y modifica sus datos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Selecciona una Competencia</Label>
            <Select onValueChange={setSelectedEventId}>
                <SelectTrigger>
                    <SelectValue placeholder="Elige un evento para editar..." />
                </SelectTrigger>
                <SelectContent>
                    {events.map(event => (
                        <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {selectedEventId && (
            <form onSubmit={handleSubmit} className="space-y-4 border-t pt-6">
               {/* Reutilizamos la misma estructura de formulario */}
               <div className="space-y-2">
                <Label htmlFor="update-title">Título del Evento</Label>
                <Input id="update-title" value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} required />
                </div>
                {/* ... Repetir todos los demás campos como en el otro formulario ... */}
                {/* Ejemplo con fecha: */}
                <div className="space-y-2">
                    <Label htmlFor="update-date">Fecha</Label>
                    <Input id="update-date" type="date" value={formData.date || ''} onChange={(e) => handleInputChange('date', e.target.value)} required />
                </div>
               <Button type="submit" className="w-full" variant="secondary">Actualizar Competencia</Button>
            </form>
        )}

      </CardContent>
    </Card>
  )
}


// --- Componente Principal de la Página ---
export default function GestionCompetenciasPage() {
  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                 <h1 className="text-3xl font-bold">Gestión de Competencias</h1>
                 <p className="text-muted-foreground">Crea nuevos eventos y actualiza los existentes desde este panel.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <AgregarCompetenciaForm />
                <ActualizarCompetenciaPanel />
            </div>
        </div>
    </div>
  );
}