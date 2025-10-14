'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Newspaper, Trophy, UserPlus } from 'lucide-react';

// Importa los nuevos componentes de gestión
import { GestionCompetencias } from '../newsCreateUpdate/components/GestionCompetencia';
import { GestionNoticias } from '../newsCreateUpdate/components/GestionNoticias';
import { GestionParticipantes } from '../newsCreateUpdate/components/GestionParticipantes';

export default function NewsCreateUpdatePage() {
  const [activeView, setActiveView] = useState<'competencias' | 'noticias' | 'participantes'>('competencias');

  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona el contenido de la plataforma desde aquí.</p>
        </div>
        
        {/* Navegación Dinámica */}
        <div className="flex flex-col sm:flex-row gap-1 mb-8 border-b">
          <Button 
            variant={activeView === 'competencias' ? 'default' : 'ghost'} 
            onClick={() => setActiveView('competencias')} 
            className="flex items-center justify-start gap-1 w-full sm:w-auto" 
          >
            <Trophy className="h-4 w-4" /> Competencias
          </Button>
          <Button 
            variant={activeView === 'noticias' ? 'default' : 'ghost'} 
            onClick={() => setActiveView('noticias')} 
            className="flex items-center justify-start gap-1 w-full sm:w-auto" 
          >
            <Newspaper className="h-4 w-4" /> Noticias
          </Button>
          <Button 
            variant={activeView === 'participantes' ? 'default' : 'ghost'} 
            onClick={() => setActiveView('participantes')} 
            className="flex items-center justify-start gap-1 w-full sm:w-auto" 
          >
            <UserPlus className="h-4 w-4" /> Participantes
          </Button>
        </div>
        
        {/* Contenido Dinámico */}
        <div>
          {activeView === 'competencias' && <GestionCompetencias />}
          {activeView === 'noticias' && <GestionNoticias />}
          {activeView === 'participantes' && <GestionParticipantes />}
        </div>
      </div>
    </div>
  );
}