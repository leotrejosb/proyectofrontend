'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { UserPlus, Trash2 } from 'lucide-react';
import { SubmissionAlert } from '../../../components/ui/submission-alert';
import { Badge } from '../../../components/ui/badge';

// --- Interfaces para los datos de la API ---
// ✅ 1. Nueva Interfaz: Se añade 'max_participants' a la competencia
interface Competition {
  id: number;
  name: string;
  max_participants: number; // Campo para el límite de cupos
}

interface Registration {
  id: number;
  affiliate_name: string;
  status: string;
}

export function GestionParticipantes() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null); // ✅ 2. Nuevo Estado: Para guardar el objeto completo de la competencia
  const [loading, setLoading] = useState({ competitions: true, registrations: false });
  const [newParticipantName, setNewParticipantName] = useState('');
  const [alertState, setAlertState] = useState({ isOpen: false, title: '', description: '', isSuccess: false });

  // Cargar la lista de competencias
  useEffect(() => {
    const fetchCompetitions = async () => {
      setLoading(prev => ({ ...prev, competitions: true }));
      try {
        const res = await fetch('https://backend.cerebria.co/api/v1/competitions/');
        if (!res.ok) throw new Error('Failed to fetch competitions');
        const data = await res.json();
        setCompetitions(data.results || data);
      } catch (error) {
        console.error(error);
        setAlertState({ isOpen: true, title: 'Error de Carga', description: 'No se pudieron cargar las competencias.', isSuccess: false });
      } finally {
        setLoading(prev => ({ ...prev, competitions: false }));
      }
    };
    fetchCompetitions();
  }, []);

  // Función para recargar los participantes
  const refreshRegistrations = async (competitionId: string) => {
    setLoading(prev => ({ ...prev, registrations: true }));
    try {
      const res = await fetch(`https://backend.cerebria.co/api/v1/registrations/?competition=${competitionId}`);
      if (!res.ok) throw new Error('Failed to fetch registrations');
      const data = await res.json();
      setRegistrations(data.results || []);
    } catch (error) {
      console.error(error);
      setRegistrations([]);
      setAlertState({ isOpen: true, title: 'Error de Carga', description: 'No se pudieron cargar los participantes.', isSuccess: false });
    } finally {
      setLoading(prev => ({ ...prev, registrations: false }));
    }
  };
  
  // ✅ 3. Lógica Actualizada: Al cambiar la selección, se guarda el objeto completo
  const handleCompetitionChange = (competitionId: string) => {
    const competition = competitions.find(c => c.id.toString() === competitionId);
    setSelectedCompetition(competition || null);
    if (competitionId) {
      refreshRegistrations(competitionId);
    } else {
      setRegistrations([]);
    }
  };

  // Agregar un nuevo participante
  const handleAddParticipant = async () => {
    if (!selectedCompetition || !newParticipantName.trim()) {
      setAlertState({ isOpen: true, title: 'Datos incompletos', description: 'Por favor, selecciona una competencia y escribe un nombre.', isSuccess: false });
      return;
    }
    
    // ✅ 4. Lógica de Validación: Comprobar si los cupos están llenos
    if (registrations.length >= selectedCompetition.max_participants) {
      setAlertState({
        isOpen: true,
        title: 'Cupos Llenos',
        description: `La competencia "${selectedCompetition.name}" ha alcanzado su límite de ${selectedCompetition.max_participants} participantes.`,
        isSuccess: false,
      });
      return; // Detiene la ejecución
    }

    try {
      const res = await fetch(`https://backend.cerebria.co/api/v1/registrations/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competition: selectedCompetition.id,
          affiliate: newParticipantName,
          status: "CONFIRMADO"
        }),
      });

      if (res.ok) {
        setAlertState({ isOpen: true, title: 'Éxito', description: 'Participante agregado correctamente.', isSuccess: true });
        setNewParticipantName('');
        refreshRegistrations(String(selectedCompetition.id));
      } else {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
      }
    } catch (error) {
      let errorMessage = 'Ocurrió un error inesperado.';
      if (error instanceof Error) {
        errorMessage = `No se pudo agregar el participante. Detalles: ${error.message}`;
      }
      setAlertState({ isOpen: true, title: 'Error al Agregar', description: errorMessage, isSuccess: false });
    }
  };

  // Eliminar un participante
  const handleDeleteParticipant = async (registrationId: number) => {
    // ... (sin cambios en esta función)
  };

  const handleAlertClose = () => setAlertState({ ...alertState, isOpen: false });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserPlus /> Gestionar Participantes</CardTitle>
          <CardDescription>Inscribe o elimina participantes de una competencia existente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Seleccionar Competencia</Label>
            <Select onValueChange={handleCompetitionChange} disabled={loading.competitions}>
              <SelectTrigger>
                <SelectValue placeholder={loading.competitions ? "Cargando..." : "Elige una competencia..."} />
              </SelectTrigger>
              <SelectContent>
                {competitions.map((comp) => (
                  <SelectItem key={comp.id} value={comp.id.toString()}>{comp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedCompetition && (
            <>
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Inscribir Nuevo Participante</h3>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="space-y-2 flex-1 w-full">
                    <Label>Nombre del Afiliado</Label>
                    <Input 
                      placeholder="Nombre completo" 
                      value={newParticipantName} 
                      onChange={(e) => setNewParticipantName(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddParticipant}>Agregar</Button>
                </div>
              </div>

              <div className="border-t pt-6">
                {/* ✅ 5. Mejora Visual: Mostrar contador de cupos */}
                <h3 className="font-semibold mb-4">
                  Participantes Inscritos ({registrations.length} / {selectedCompetition.max_participants})
                </h3>
                {loading.registrations ? (
                  <p className="text-muted-foreground">Cargando participantes...</p>
                ) : (
                  <ul className="space-y-2">
                    {registrations.length > 0 ? registrations.map(reg => (
                      <li key={reg.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{reg.affiliate_name}</span>
                            <Badge variant={reg.status === 'CONFIRMADO' ? 'default' : 'secondary'}>{reg.status}</Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteParticipant(reg.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    )) : (
                      <p className="text-muted-foreground">No hay participantes inscritos en esta competencia.</p>
                    )}
                  </ul>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <SubmissionAlert isOpen={alertState.isOpen} onClose={handleAlertClose} title={alertState.title} description={alertState.description} isSuccess={alertState.isSuccess} />
    </>
  );
}