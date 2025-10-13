'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ListPlus, Edit, Trash2 } from 'lucide-react';
import { SubmissionAlert } from '../../../components/ui/submission-alert';

// --- Interfaces para Noticias ---
interface News {
  id: number;
  title: string;
}

interface NewsForm {
  title: string;
  content: string;
  image: File | null;
}

// --- Componente para AGREGAR Noticia ---
function AgregarNoticiaForm() {
  const [formData, setFormData] = useState<NewsForm>({ title: '', content: '', image: null });
  const [loading, setLoading] = useState(false);
  const [alertState, setAlertState] = useState({ isOpen: false, title: '', description: '', isSuccess: false });

  const handleInputChange = (field: 'title' | 'content', value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({...prev, image: e.target.files![0]}));
    }
  };
  const resetForm = () => {
    setFormData({ title: '', content: '', image: null });
    const fileInput = document.getElementById('news-image-create') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const body = new FormData();
    body.append('title', formData.title);
    body.append('content', formData.content);
    if (formData.image) body.append('image', formData.image);

    try {
      const res = await fetch('https://backend.cerebria.co/api/v1/news/', { method: 'POST', body });
      if (res.ok) {
        setAlertState({ isOpen: true, title: 'Éxito', description: 'Noticia creada correctamente.', isSuccess: true });
      } else {
        const data = await res.json();
        throw new Error(JSON.stringify(data));
      }
    } catch (error) {
      // ✅ INICIO DE LA CORRECCIÓN
      let errorMessage = 'Ocurrió un error inesperado al crear la noticia.';
      if (error instanceof Error) {
        errorMessage = `No se pudo crear la noticia: ${error.message}`;
      }
      setAlertState({ 
        isOpen: true, 
        title: 'Error', 
        description: errorMessage, 
        isSuccess: false 
      });
      // ✅ FIN DE LA CORRECCIÓN
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = () => {
    setAlertState(prev => ({...prev, isOpen: false}));
    if(alertState.isSuccess) resetForm();
  };

  return (
    <>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ListPlus /> Crear Noticia</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="news-title">Título</Label><Input id="news-title" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} required/></div>
            <div className="space-y-2"><Label htmlFor="news-content">Contenido</Label><Textarea id="news-content" value={formData.content} onChange={e => handleInputChange('content', e.target.value)} rows={5} required/></div>
            <div className="space-y-2"><Label htmlFor="news-image-create">Imagen</Label><Input id="news-image-create" type="file" onChange={handleFileChange} required/></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Publicando...' : 'Publicar Noticia'}</Button>
          </form>
        </CardContent>
      </Card>
      <SubmissionAlert isOpen={alertState.isOpen} onClose={handleAlertClose} title={alertState.title} description={alertState.description} isSuccess={alertState.isSuccess} />
    </>
  );
}

// --- Componente para EDITAR/ELIMINAR Noticia ---
function ActualizarNoticiaPanel() {
  // Aquí iría la lógica completa de carga, actualización y eliminación
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Edit /> Editar o Eliminar Noticia</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Label>Seleccionar Noticia</Label>
        <Select><SelectTrigger><SelectValue placeholder="Elige una noticia..." /></SelectTrigger></Select>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline">Actualizar</Button>
          <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Eliminar</Button>
        </div>
      </CardContent>
    </Card>
  );
}


// --- Componente principal que agrupa los formularios de Noticias ---
export function GestionNoticias() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <AgregarNoticiaForm />
      <ActualizarNoticiaPanel />
    </div>
  );
}