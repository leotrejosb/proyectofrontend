'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2 } from 'lucide-react';
import { SubmissionAlert } from '../../../components/ui/submission-alert';

// --- Interfaces ---
interface News {
  id: number;
  title: string;
}
interface NewsDetails extends News {
  summary: string;
  body: string;
  publish_at: string;
  is_published: boolean;
  author: string;
  category: string;
}

export function ActualizarNoticiaPanel() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NewsDetails>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState({ list: true, details: false, action: false });
  const [alertState, setAlertState] = useState({ isOpen: false, title: '', description: '', isSuccess: false });

  const fetchNews = async () => {
    setLoading(prev => ({ ...prev, list: true }));
    try {
      const res = await fetch('https://backend.cerebria.co/api/v1/posts/');
      if (!res.ok) throw new Error('Failed to fetch news');
      const data = await res.json();
      setNewsList(data.results || data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, list: false }));
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (!selectedNewsId) {
      setFormData({});
      return;
    }
    const fetchDetails = async () => {
      setLoading(prev => ({ ...prev, details: true }));
      try {
        const res = await fetch(`https://backend.cerebria.co/api/v1/posts/${selectedNewsId}/`);
        const data: NewsDetails = await res.json();
        data.publish_at = new Date(data.publish_at).toISOString().slice(0, 16);
        setFormData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(prev => ({ ...prev, details: false }));
      }
    };
    fetchDetails();
  }, [selectedNewsId]);
  
  const resetForm = () => {
    setSelectedNewsId(null);
    setFormData({});
    setImageFile(null);
  };

  const handleInputChange = (field: keyof Omit<NewsDetails, 'id'>, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedNewsId) return;
    setLoading(prev => ({...prev, action: true}));

    const body = new FormData();
    if(formData.title) body.append('title', formData.title);
    if(formData.summary) body.append('summary', formData.summary);
    if(formData.body) body.append('body', formData.body);
    if(formData.publish_at) body.append('publish_at', new Date(formData.publish_at).toISOString());
    if(formData.author) body.append('author', formData.author);
    if(formData.category) body.append('category', formData.category);
    body.append('is_published', String(formData.is_published));
    if (imageFile) body.append('image', imageFile);

    try {
      const res = await fetch(`https://backend.cerebria.co/api/v1/posts/${selectedNewsId}/`, { method: 'PATCH', body, credentials: 'include' });
      if (res.ok) {
        setAlertState({ isOpen: true, title: 'Éxito', description: 'Noticia actualizada.', isSuccess: true });
        resetForm();
        fetchNews();
      } else {
        const data = await res.json(); throw new Error(JSON.stringify(data));
      }
    } catch (error) {
      let msg = 'No se pudo actualizar.';
      if (error instanceof Error) msg += ` ${error.message}`;
      setAlertState({ isOpen: true, title: 'Error', description: msg, isSuccess: false });
    } finally {
      setLoading(prev => ({...prev, action: false}));
    }
  };

  const handleDelete = async () => {
    if (!selectedNewsId || !confirm('¿Seguro que deseas eliminar esta noticia?')) return;
    setLoading(prev => ({...prev, action: true}));
    try {
      const res = await fetch(`https://backend.cerebria.co/api/v1/posts/${selectedNewsId}/`, { method: 'DELETE', credentials: 'include' });
      if (res.ok || res.status === 204) {
        setAlertState({ isOpen: true, title: 'Éxito', description: 'Noticia eliminada.', isSuccess: true });
        resetForm();
        fetchNews();
      } else {
        const data = await res.json(); throw new Error(JSON.stringify(data));
      }
    } catch (error) {
      let msg = 'No se pudo eliminar.';
      if (error instanceof Error) msg += ` ${error.message}`;
      setAlertState({ isOpen: true, title: 'Error', description: msg, isSuccess: false });
    } finally {
      setLoading(prev => ({...prev, action: false}));
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Edit /> Editar o Eliminar Noticia</CardTitle>
          <CardDescription>Selecciona un artículo para modificarlo o borrarlo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Seleccionar Noticia</Label>
          <Select onValueChange={setSelectedNewsId} value={selectedNewsId || ''} disabled={loading.list}>
            {/* ✅ Se añade la clase 'truncate' para el texto seleccionado */}
            <SelectTrigger className="truncate">
              <SelectValue placeholder={loading.list ? "Cargando..." : "Elige una noticia..."} />
            </SelectTrigger>
            <SelectContent>
              {newsList.map(item => (
                // ✅ Se añade la clase 'truncate' a cada opción del menú
                <SelectItem key={item.id} value={item.id.toString()} className="truncate">
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loading.details && <p className="text-sm text-muted-foreground">Cargando detalles...</p>}
          {selectedNewsId && formData.id && (
            <div className="space-y-4 pt-4 border-t">
              <Input placeholder="Título" value={formData.title || ''} onChange={e => handleInputChange('title', e.target.value)} required />
              <Textarea placeholder="Cuerpo..." value={formData.body || ''} onChange={e => handleInputChange('body', e.target.value)} rows={4} required />
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="update_is_published" checked={!!formData.is_published} onCheckedChange={checked => handleInputChange('is_published', checked)} />
                <Label htmlFor="update_is_published">Publicado</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-image">Cambiar Imagen (opcional)</Label>
                <Input id="update-image" type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleUpdate} disabled={loading.action}>{loading.action ? 'Actualizando...' : 'Actualizar'}</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={loading.action}><Trash2 className="mr-2 h-4 w-4" /> {loading.action ? 'Eliminando...' : 'Eliminar'}</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <SubmissionAlert isOpen={alertState.isOpen} onClose={() => setAlertState(prev => ({...prev, isOpen: false}))} title={alertState.title} description={alertState.description} isSuccess={alertState.isSuccess} />
    </>
  );
}