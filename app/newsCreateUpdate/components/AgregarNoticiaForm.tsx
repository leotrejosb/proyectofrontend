'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ListPlus } from 'lucide-react';
import { SubmissionAlert } from '../../../components/ui/submission-alert';

// 1. Interfaz actualizada sin 'publish_at'
interface NewsFormState {
  title: string;
  summary: string;
  body: string;
  is_published: boolean;
  author: string;
  image: File | null;
  category: string;
}

export function AgregarNoticiaForm() {
  // 2. Estado inicial actualizado sin 'publish_at'
  const [formData, setFormData] = useState<NewsFormState>({
    title: '', summary: '', body: '', 
    is_published: true, author: '', image: null, category: 'Competencias'
  });
  const [loading, setLoading] = useState(false);
  const [alertState, setAlertState] = useState({ isOpen: false, title: '', description: '', isSuccess: false });

  const handleInputChange = (field: 'title' | 'summary' | 'body' | 'author' | 'category', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    } else {
      setFormData(prev => ({ ...prev, image: null }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', summary: '', body: '', 
      is_published: true, author: '', image: null, category: 'Competencias'
    });
    const fileInput = document.getElementById('news-image-create') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body = new FormData();
    body.append('title', formData.title);
    body.append('summary', formData.summary);
    body.append('body', formData.body);
    // 3. Se elimina la línea que añadía 'publish_at'
    body.append('is_published', String(formData.is_published));
    body.append('author', formData.author);
    body.append('category', formData.category);
    if (formData.image) {
      body.append('image', formData.image);
    }

    try {
      const res = await fetch('https://backend.cerebria.co/api/v1/posts/', { 
        method: 'POST', 
        body,
        credentials: 'include',
      });
      
      if (res.ok) {
        setAlertState({ isOpen: true, title: 'Éxito', description: 'Noticia creada correctamente.', isSuccess: true });
        resetForm();
      } else {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
      }
    } catch (error) {
      let errorMessage = 'Ocurrió un error inesperado.';
      if (error instanceof Error) {
        errorMessage = `No se pudo crear la noticia: ${error.message}`;
      }
      setAlertState({ isOpen: true, title: 'Error', description: errorMessage, isSuccess: false });
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = () => setAlertState({ ...alertState, isOpen: false });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ListPlus /> Crear Noticia</CardTitle>
          <CardDescription>Completa los campos para publicar un nuevo artículo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Título" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} required />
            <Textarea placeholder="Resumen corto" value={formData.summary} onChange={e => handleInputChange('summary', e.target.value)} required />
            <Textarea placeholder="Cuerpo de la noticia..." value={formData.body} onChange={e => handleInputChange('body', e.target.value)} rows={6} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input placeholder="Autor" value={formData.author} onChange={e => handleInputChange('author', e.target.value)} required />
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} required>
                <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Competencias">Competencias</SelectItem>
                  <SelectItem value="Entrenamiento">Entrenamiento</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* 4. El bloque del input de fecha ha sido eliminado del JSX */}

            <div className="space-y-2">
              <Label htmlFor="news-image-create">Imagen Principal</Label>
              <Input id="news-image-create" type="file" onChange={handleFileChange} accept="image/*" required />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="is_published" checked={formData.is_published} onCheckedChange={checked => setFormData(prev => ({...prev, is_published: checked}))} />
              <Label htmlFor="is_published">Publicar inmediatamente</Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Publicando...' : 'Publicar Noticia'}</Button>
          </form>
        </CardContent>
      </Card>
      <SubmissionAlert isOpen={alertState.isOpen} onClose={handleAlertClose} title={alertState.title} description={alertState.description} isSuccess={alertState.isSuccess} />
    </>
  );
}