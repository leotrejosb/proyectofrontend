'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ListPlus } from 'lucide-react';

interface EventForm {
  title: string;
  date: string;
  location: string;
  maxParticipants: number;
  difficulty: string;
  image: File | null;
}

export default function AgregarCompetenciaForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<EventForm>({
    title: '',
    date: '',
    location: '',
    maxParticipants: 100,
    difficulty: 'Intermedio',
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof EventForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body = new FormData();
      body.append('name', formData.title);
      body.append('start_date', formData.date);
      body.append('location', formData.location);
      body.append('max_participants', formData.maxParticipants.toString());
      body.append('difficulty', formData.difficulty);
      body.append('status', 'ABIERTO');
      if (formData.image) body.append('image', formData.image);

      const res = await fetch('https://backend.cerebria.co/api/v1/competitions/', {
        method: 'POST',
        body,
      });

      if (res.ok) {
        router.push('/exito/page');
      } else {
        const data = await res.json();
        alert('Error al crear competencia: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error al enviar los datos.');
    } finally {
      setLoading(false);
    }
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
          <div className="space-y-2">
            <Label htmlFor="title">Título del Evento</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Máx. Participantes</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value, 10))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Dificultad</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => handleInputChange('difficulty', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una dificultad" />
                </SelectTrigger>
                <SelectContent className="bg-background/95">
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
            <Input
              id="image"
              type="file"
              onChange={(e) => handleInputChange('image', e.target.files?.[0] || null)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Competencia'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
