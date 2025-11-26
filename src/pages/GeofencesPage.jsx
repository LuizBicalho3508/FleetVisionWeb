import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Paper, List, ListItem, ListItemText, IconButton, 
  Button, CircularProgress, Divider, Chip, Tooltip 
} from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import apiClient from '../api/apiClient';
import GeofenceMap from '../components/GeofenceMap';
import SaveGeofenceModal from '../components/SaveGeofenceModal';
import AssociateGeofenceModal from '../components/AssociateGeofenceModal';

const GeofencesPage = () => {
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newShapeWkt, setNewShapeWkt] = useState('');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
  // Estado para modal de associação (vincular veículo à cerca)
  const [selectedGeofence, setSelectedGeofence] = useState(null);
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);

  const fetchGeofences = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/geofences');
      setGeofences(response.data);
    } catch (error) {
      console.error("Erro ao buscar cercas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGeofences();
  }, [fetchGeofences]);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta cerca?")) return;
    try {
      await apiClient.delete(`/geofences/${id}`);
      fetchGeofences();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const handleShapeComplete = (wkt) => {
    setNewShapeWkt(wkt);
    setIsSaveModalOpen(true);
  };

  const handleSaveSuccess = () => {
    setIsSaveModalOpen(false);
    setIsCreating(false);
    fetchGeofences();
  };

  // Estilos Glass
  const glassStyle = {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 4
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 120px)', gap: 2 }}>
      
      {/* PAINEL LATERAL (LISTA) */}
      <Paper sx={{ ...glassStyle, width: 400, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>Cercas Virtuais</Typography>
          {!isCreating ? (
            <Button 
              variant="contained" 
              size="small"
              startIcon={<AddLocationAltIcon />}
              onClick={() => setIsCreating(true)}
              sx={{ background: 'linear-gradient(45deg, #00e5ff, #00b0ff)', fontWeight: 'bold' }}
            >
              Nova
            </Button>
          ) : (
            <Button variant="outlined" size="small" onClick={() => setIsCreating(false)} sx={{ color: '#ff1744', borderColor: '#ff1744' }}>
              Cancelar
            </Button>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <List sx={{ overflow: 'auto', flexGrow: 1 }}>
            {geofences.length === 0 && !isCreating && (
              <Typography sx={{ textAlign: 'center', mt: 4, color: 'rgba(255,255,255,0.5)' }}>
                Nenhuma cerca criada.
              </Typography>
            )}
            
            {geofences.map((geo) => (
              <ListItem 
                key={geo.id} 
                divider 
                sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                secondaryAction={
                  <Box>
                    <Tooltip title="Vincular Veículos">
                      <IconButton onClick={() => { setSelectedGeofence(geo); setIsAssociateModalOpen(true); }} sx={{ color: '#00e5ff' }}>
                        <LinkIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton onClick={() => handleDelete(geo.id)} sx={{ color: '#ff1744' }}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemText 
                  primary={<Typography sx={{ color: '#fff', fontWeight: 'medium' }}>{geo.name}</Typography>}
                  secondary={<Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>{geo.description || 'Sem descrição'}</Typography>}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* ÁREA DO MAPA */}
      <Paper sx={{ ...glassStyle, flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        {isCreating ? (
          <GeofenceMap onShapeComplete={handleShapeComplete} />
        ) : (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: 0.5 }}>
            <AddLocationAltIcon sx={{ fontSize: 80, color: '#fff', mb: 2 }} />
            <Typography sx={{ color: '#fff' }}>Clique em "Nova" para desenhar uma cerca.</Typography>
          </Box>
        )}
      </Paper>

      {/* MODAIS */}
      <SaveGeofenceModal 
        open={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)} 
        onSuccess={handleSaveSuccess} 
        areaWkt={newShapeWkt} 
      />

      {selectedGeofence && (
        <AssociateGeofenceModal
          open={isAssociateModalOpen}
          onClose={() => setIsAssociateModalOpen(false)}
          geofence={selectedGeofence}
        />
      )}
    </Box>
  );
};

export default GeofencesPage;