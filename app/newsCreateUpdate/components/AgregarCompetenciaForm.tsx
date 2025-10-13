'use client';

import { useState } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ListPlus } from 'lucide-react';
import { SubmissionAlert } from '../../../components/ui/submission-alert';

interface CompetitionForm {
  title: string;
  date: string;
  location: string;
  maxParticipants: number;
  difficulty: string;
  image: File | null;
}

export function AgregarCompetenciaForm() {
  const [formData, setFormData] = useState<CompetitionForm>({
    title: '', date: '', location: '', maxParticipants: 100, difficulty: 'Intermedio', image: null,
  });
  const [loading, setLoading] = useState(false);
  const [alertState, setAlertState] = useState({ isOpen: false, title: '', description: '', isSuccess: false });

  const handleInputChange = (field: 'title' | 'date' | 'location' | 'difficulty', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleNumberChange = (field: 'maxParticipants', value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleFileChange = (field: 'image', value: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const resetForm = () => {
    setFormData({ title: '', date: '', location: '', maxParticipants: 100, difficulty: 'Intermedio', image: null });
    const fileInput = document.getElementById('image-create') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.maxParticipants < 2) {
      setAlertState({ isOpen: true, title: 'Dato Inválido', description: 'El número máximo de participantes debe ser 2 o más.', isSuccess: false });
      return;
    }
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
      
      const res = await fetch('https://backend.cerebria.co/api/v1/competitions/', { method: 'POST', body });
      if (res.ok) {
        setAlertState({ isOpen: true, title: '¡Éxito!', description: 'La competencia se ha creado correctamente.', isSuccess: true });
      } else {
        const data = await res.json();
        setAlertState({ isOpen: true, title: 'Error al Crear', description: `Hubo un problema: ${JSON.stringify(data)}`, isSuccess: false });
      }
    } catch (error) {
      setAlertState({ isOpen: true, title: 'Error de Red', description: 'No se pudo conectar con el servidor.', isSuccess: false });
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = () => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
    if (alertState.isSuccess) resetForm();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ListPlus /> Agregar Competencia</CardTitle>
          <CardDescription>Crea un nuevo evento desde cero.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del Evento</Label>
              <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input id="date" type="date" value={formData.date} onChange={(e) => handleInputChange('date', e.target.value)} required className="[color-scheme:dark]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input id="location" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Máx. Participantes</Label>
                <Input id="maxParticipants" type="number" value={formData.maxParticipants} onChange={(e) => handleNumberChange('maxParticipants', parseInt(e.target.value, 10))} min="2" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificultad</Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)} required>
                  <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
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
              <Label htmlFor="image-create">Imagen Principal</Label>
              <Input id="image-create" type="file" onChange={(e) => handleFileChange('image', e.target.files?.[0] || null)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creando...' : 'Crear Competencia'}</Button>
          </form>
        </CardContent>
      </Card>
      <SubmissionAlert isOpen={alertState.isOpen} onClose={handleAlertClose} title={alertState.title} description={alertState.description} isSuccess={alertState.isSuccess} />
    </>
  );
}