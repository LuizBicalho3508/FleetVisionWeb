// Local: src/components/EditVehicleModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Box, Alert,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { adminApiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const EditVehicleModal = ({ open, onClose, onSuccess, vehicle }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [clientes, setClientes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      // Carrega clientes da filial
      adminApiClient.get('/users').then(res => {
        const meusClientes = res.data.filter(u => u.attributes?.filialId === user.id);
        setClientes(meusClientes);
      });

      // Preenche dados
      if (vehicle) {
        setFormData({ name: vehicle.name, ...vehicle.attributes });
        setSelectedClientId(vehicle.attributes?.ownerId || '');
      }
    }
  }, [open, vehicle, user.id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const updatedData = {
        id: vehicle.id,
        uniqueId: vehicle.uniqueId,
        name: formData.name,
        attributes: { ...formData, ownerId: selectedClientId }
      };

      await adminApiClient.put(`/devices/${vehicle.id}`, updatedData);
      
      // Atualiza permissão se mudou de dono (Remove do antigo, adiciona no novo)
      // Nota: Para simplificar, apenas adicionamos a permissão ao novo.
      if (selectedClientId && selectedClientId !== vehicle.attributes?.ownerId) {
         await adminApiClient.post('/permissions', { userId: selectedClientId, deviceId: vehicle.id });
      }

      onSuccess();
    } catch (err) {
      setError("Erro ao atualizar veículo.");
    }
  };

  const glassProps = { style: { backgroundColor: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 4 } };
  const inputStyle = { sx: { '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, '& label': { color: '#aaa' }, '& .MuiSelect-icon': { color: '#fff' } } };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={glassProps}>
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Editar Veículo</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <FormControl fullWidth {...inputStyle}>
            <InputLabel>Cliente Proprietário</InputLabel>
            <Select value={selectedClientId} label="Cliente Proprietário" onChange={(e) => setSelectedClientId(e.target.value)}>
              {clientes.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField name="name" label="Placa" fullWidth required value={formData.name || ''} onChange={handleChange} {...inputStyle} /></Grid>
            <Grid item xs={6}><TextField name="modelo" label="Modelo" fullWidth value={formData.modelo || ''} onChange={handleChange} {...inputStyle} /></Grid>
            <Grid item xs={6}><TextField name="cor" label="Cor" fullWidth value={formData.cor || ''} onChange={handleChange} {...inputStyle} /></Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Button onClick={onClose} sx={{ color: '#fff' }}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditVehicleModal;