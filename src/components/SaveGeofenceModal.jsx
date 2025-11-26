import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Alert
} from '@mui/material';
import apiClient from '../api/apiClient';

const SaveGeofenceModal = ({ open, onClose, onSuccess, areaWkt }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name) {
      setError('O nome da cerca é obrigatório.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const geofenceData = {
        name,
        description,
        area: areaWkt, // O formato WKT gerado pelo mapa
      };
      await apiClient.post('/geofences', geofenceData);
      
      setName('');
      setDescription('');
      onSuccess(); // Fecha o modal e atualiza a lista
    } catch (err) {
      console.error("Erro ao salvar cerca:", err);
      setError("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Estilos Glass para o Modal
  const paperProps = {
    style: {
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#fff',
      borderRadius: 16
    },
  };

  const inputStyles = {
    InputLabelProps: { style: { color: '#aaa' } },
    sx: { 
      '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
        color: '#fff'
      },
      '& input': { color: '#fff' }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={paperProps}>
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Salvar Cerca Virtual</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {error && <Alert severity="error" variant="filled">{error}</Alert>}
          <TextField 
            label="Nome da Cerca" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            autoFocus
            {...inputStyles}
          />
          <TextField 
            label="Descrição (opcional)" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            {...inputStyles}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Button onClick={onClose} sx={{ color: '#fff' }}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveGeofenceModal;