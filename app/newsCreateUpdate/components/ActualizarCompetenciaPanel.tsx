'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Edit, Trash2 } from 'lucide-react';
import { SubmissionAlert } from '../../../components/ui/submission-alert';

// --- Interfaces para los datos ---
interface Competition {
  id: number;
  name: string;
}

interface CompetitionDetails {
  id: number;
  name: string;
  start_date: string;
  location: string;
  max_participants: number;
  difficulty: string;
}

export default function ActualizarCompetenciaPanel() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CompetitionDetails>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState({ list: true, details: false, action: false });
  const [alertState, setAlertState] = useState({ isOpen: false, title: '', description: '', isSuccess: false });

  const fetchCompetitions = async () => {
    setLoading(prev => ({ ...prev, list: true }));
    try {
      const res = await fetch('https://backend.cerebria.co/api/v1/competitions/');
      if (!res.ok) throw new Error('Failed to fetch competitions');
      const data = await res.json();
      setCompetitions(data.results || data);
    } catch (error) {
      console.error("Error fetching competitions:", error);
    } finally {
      setLoading(prev => ({ ...prev, list: false }));
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  useEffect(() => {
    if (!selectedCompId) {
      setFormData({});
      return;
    }
    const fetchDetails = async () => {
      setLoading(prev => ({ ...prev, details: true }));
      try {
        const res = await fetch(`https://backend.cerebria.co/api/v1/competitions/${selectedCompId}/`);
        if (!res.ok) throw new Error('Failed to fetch competition details');
        const data: CompetitionDetails = await res.json();
        data.start_date = data.start_date.split('T')[0];
        setFormData(data);
      } catch (error) {
        console.error("Error fetching details:", error);
        setAlertState({ isOpen: true, title: 'Error', description: 'No se pudieron cargar los detalles de la competencia.', isSuccess: false });
        setSelectedCompId(null);
      } finally {
        setLoading(prev => ({ ...prev, details: false }));
      }
    };
    fetchDetails();
  }, [selectedCompId]);

  // ✅ 1. Función para resetear el formulario
  const resetForm = () => {
    setSelectedCompId(null);
    setFormData({});
    setImageFile(null);
    const fileInput = document.getElementById('update-image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleInputChange = (field: keyof Omit<CompetitionDetails, 'id'>, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    if (!formData.name?.trim() || !formData.start_date?.trim() || !formData.location?.trim()) {
        setAlertState({
            isOpen: true,
            title: 'Campos Incompletos',
            description: 'El título, la fecha y la ubicación son obligatorios.',
            isSuccess: false,
        });
        return;
    }
    if ((formData.max_participants ?? 0) < 2) {
        setAlertState({ isOpen: true, title: 'Dato Inválido', description: 'El número de participantes debe ser 2 o más.', isSuccess: false });
        return;
    }

    if (!selectedCompId) return;
    setLoading(prev => ({...prev, action: true}));

    const body = new FormData();
    body.append('name', formData.name);
    body.append('start_date', formData.start_date);
    body.append('location', formData.location);
    if (formData.max_participants) body.append('max_participants', formData.max_participants.toString());
    if (formData.difficulty) body.append('difficulty', formData.difficulty);
    if (imageFile) body.append('image', imageFile);

    try {
      const res = await fetch(`https://backend.cerebria.co/api/v1/competitions/${selectedCompId}/`, {
        method: 'PATCH',
        body,
      });
      if (res.ok) {
        setAlertState({ isOpen: true, title: 'Éxito', description: 'Competencia actualizada correctamente.', isSuccess: true });
        fetchCompetitions();
        resetForm(); // ✅ 2. Limpia el formulario en caso de éxito
      } else {
        const data = await res.json();
        throw new Error(JSON.stringify(data));
      }
    } catch (error) {
      let errorMessage = 'Ocurrió un error inesperado al actualizar.';
      if (error instanceof Error) errorMessage = `No se pudo actualizar: ${error.message}`;
      setAlertState({ isOpen: true, title: 'Error', description: errorMessage, isSuccess: false });
    } finally {
      setLoading(prev => ({...prev, action: false}));
    }
  };

  const handleDelete = async () => {
    if (!selectedCompId) return;
    if (!confirm('¿Estás seguro de que deseas eliminar esta competencia? Esta acción es irreversible.')) return;
    
    setLoading(prev => ({...prev, action: true}));
    try {
      const res = await fetch(`https://backend.cerebria.co/api/v1/competitions/${selectedCompId}/`, {
        method: 'DELETE',
      });
      if (res.ok || res.status === 204) {
        setAlertState({ isOpen: true, title: 'Éxito', description: 'Competencia eliminada correctamente.', isSuccess: true });
        resetForm(); // Limpia el formulario después de eliminar
        fetchCompetitions();
      } else {
        const data = await res.json();
        throw new Error(JSON.stringify(data));
      }
    } catch (error) {
      let errorMessage = 'Ocurrió un error inesperado al eliminar.';
      if (error instanceof Error) errorMessage = `No se pudo eliminar: ${error.message}`;
      setAlertState({ isOpen: true, title: 'Error', description: errorMessage, isSuccess: false });
    } finally {
      setLoading(prev => ({...prev, action: false}));
    }
  };

  const handleAlertClose = () => setAlertState({ ...alertState, isOpen: false });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Edit /> Editar o Eliminar Competencia</CardTitle>
          <CardDescription>Selecciona un evento para modificarlo o borrarlo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Seleccionar Competencia</Label>
          <Select onValueChange={setSelectedCompId} value={selectedCompId || ''} disabled={loading.list}>
            <SelectTrigger><SelectValue placeholder={loading.list ? "Cargando..." : "Elige un evento..."} /></SelectTrigger>
            <SelectContent>
              {competitions.map(comp => <SelectItem key={comp.id} value={comp.id.toString()}>{comp.name}</SelectItem>)}
            </SelectContent>
          </Select>
          
          {loading.details && <p className="text-muted-foreground text-sm">Cargando detalles...</p>}

          {selectedCompId && formData.id && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="update-name">Título del Evento</Label>
                <Input id="update-name" value={formData.name || ''} onChange={e => handleInputChange('name', e.target.value)} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="update-date">Fecha</Label>
                  <Input id="update-date" type="date" value={formData.start_date || ''} onChange={e => handleInputChange('start_date', e.target.value)} required className="[color-scheme:dark]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-location">Ubicación</Label>
                  <Input id="update-location" value={formData.location || ''} onChange={e => handleInputChange('location', e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="update-participants">Máx. Participantes</Label>
                  <Input 
                    id="update-participants" 
                    type="number"
                    min="2"
                    value={formData.max_participants || ''} 
                    onChange={e => handleInputChange('max_participants', parseInt(e.target.value, 10) || 0)} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-difficulty">Dificultad</Label>
                   <Select value={formData.difficulty || ''} onValueChange={(value) => handleInputChange('difficulty', value)} required>
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
                <Label htmlFor="update-image">Cambiar Imagen (opcional)</Label>
                <Input id="update-image" type="file" onChange={handleFileChange} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleUpdate} disabled={loading.action}>{loading.action ? 'Actualizando...' : 'Actualizar'}</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={loading.action}><Trash2 className="mr-2 h-4 w-4" /> {loading.action ? 'Eliminando...' : 'Eliminar'}</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <SubmissionAlert isOpen={alertState.isOpen} onClose={handleAlertClose} title={alertState.title} description={alertState.description} isSuccess={alertState.isSuccess} />
    </>
  );
}