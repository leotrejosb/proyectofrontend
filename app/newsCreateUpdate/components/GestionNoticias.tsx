'use client';

// Importamos los dos componentes de formulario que crearemos a continuación
import { AgregarNoticiaForm } from './AgregarNoticiaForm';
import { ActualizarNoticiaPanel } from './ActualizarNoticiaPanel';

// Usamos 'export function' para que coincida con tu ejemplo de GestionCompetencias
export function GestionNoticias() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <AgregarNoticiaForm />
      <ActualizarNoticiaPanel />
    </div>
  );
}