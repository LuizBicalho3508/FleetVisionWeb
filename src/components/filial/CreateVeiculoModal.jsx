// Local: src/components/filial/CreateVeiculoModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Box, Alert,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { adminApiClient } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';

const CreateVeiculoModal = ({ open, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [clientes, setClientes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchClientes = async () => {
        try {
          const response = await adminApiClient.get('/users');
          const meusClientes = response.data.filter(u => u.attributes?.filialId === user.id);
          setClientes(meusClientes);
        } catch (err) {
          console.error(err);
        }
      };
      fetchClientes();
    }
  }, [open, user.id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!formData.uniqueId || !formData.name || !selectedClientId) {
      setError('IMEI, Placa e Cliente são obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      const vehicleData = {
        name: formData.name,
        uniqueId: formData.uniqueId,
        attributes: {
          ...formData, // Salva modelo, cor, etc
          ownerId: selectedClientId // <--- A CORREÇÃO: Salva o dono no atributo
        }
      };

      // 1. Cria veículo
      const response = await adminApiClient.post('/devices', vehicleData);
      const newDeviceId = response.data.id;

      // 2. Permissões (Filial e Cliente)
      await Promise.all([
        adminApiClient.post('/permissions', { userId: user.id, deviceId: newDeviceId }),
        adminApiClient.post('/permissions', { userId: selectedClientId, deviceId: newDeviceId })
      ]);

      onSuccess();
      setFormData({});
      setSelectedClientId('');
    } catch (err) {
      setError('Erro ao cadastrar. Verifique se o IMEI já existe.');
    } finally {
      setLoading(false);
    }
  };

  // Estilos Glass
  const glassProps = { style: { backgroundColor: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 4 } };
  const inputStyle = { sx: { '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, '& label': { color: '#aaa' }, '& .MuiSelect-icon': { color: '#fff' } } };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={glassProps}>
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Novo Veículo</DialogTitle>
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
            <Grid item xs={6}><TextField name="uniqueId" label="IMEI" fullWidth required onChange={handleChange} {...inputStyle} /></Grid>
            <Grid item xs={6}><TextField name="name" label="Placa" fullWidth required onChange={handleChange} {...inputStyle} /></Grid>
            <Grid item xs={4}><TextField name="fabricante" label="Fabricante" fullWidth onChange={handleChange} {...inputStyle} /></Grid>
            <Grid item xs={4}><TextField name="modelo" label="Modelo" fullWidth onChange={handleChange} {...inputStyle} /></Grid>
            <Grid item xs={4}><TextField name="cor" label="Cor" fullWidth onChange={handleChange} {...inputStyle} /></Grid>
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

export default CreateVeiculoModal;