'use client';

// La importación de AgregarCompetenciaForm ya estaba correcta.
import { AgregarCompetenciaForm }  from '@/app/newsCreateUpdate/components/AgregarCompetenciaForm'; 

// ✅ CORRECCIÓN: Se quitan las llaves y se corrige la ruta.
import ActualizarCompetenciaPanel from './ActualizarCompetenciaPanel';

export function GestionCompetencias() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <AgregarCompetenciaForm />
      <ActualizarCompetenciaPanel />
    </div>
  );
}