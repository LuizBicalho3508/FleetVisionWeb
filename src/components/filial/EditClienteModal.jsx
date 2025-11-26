import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Alert, Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { adminApiClient } from '../../api/apiClient';
import dayjs from 'dayjs';

const EditClienteModal = ({ open, onClose, onSuccess, cliente }) => {
  const [formData, setFormData] = useState({});
  const [dates, setDates] = useState({ start: null, end: null });
  const [error, setError] = useState('');

  useEffect(() => {
    if (cliente) {
      setFormData({ name: cliente.name, email: cliente.email, deviceLimit: cliente.deviceLimit });
      setDates({
        start: cliente.attributes?.contractStart ? dayjs(cliente.attributes.contractStart) : null,
        end: cliente.attributes?.contractEnd ? dayjs(cliente.attributes.contractEnd) : null
      });
    }
  }, [cliente]);

  const handleSave = async () => {
    try {
      const updatedData = {
        id: cliente.id,
        ...formData,
        attributes: {
          ...cliente.attributes,
          contractStart: dates.start ? dates.start.toISOString() : null,
          contractEnd: dates.end ? dates.end.toISOString() : null,
        }
      };
      if (formData.password) updatedData.password = formData.password;

      await adminApiClient.put(`/users/${cliente.id}`, updatedData);
      onSuccess();
    } catch (err) {
      setError('Erro ao atualizar cliente.');
    }
  };

  const glassProps = { style: { backgroundColor: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 4 } };
  const inputStyle = { sx: { '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, '& label': { color: '#aaa' } } };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={glassProps}>
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Editar Cliente</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Nome" fullWidth value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} {...inputStyle} />
          <TextField label="Email" fullWidth value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} {...inputStyle} />
          <TextField label="Nova Senha (Opcional)" type="password" fullWidth onChange={e => setFormData({...formData, password: e.target.value})} {...inputStyle} />
          <TextField label="Limite Veículos" type="number" fullWidth value={formData.deviceLimit || 0} onChange={e => setFormData({...formData, deviceLimit: e.target.value})} {...inputStyle} />
          <Grid container spacing={2}>
            <Grid item xs={6}><DatePicker label="Início Contrato" value={dates.start} onChange={(v) => setDates({...dates, start: v})} slotProps={{ textField: inputStyle }} /></Grid>
            <Grid item xs={6}><DatePicker label="Fim Contrato" value={dates.end} onChange={(v) => setDates({...dates, end: v})} slotProps={{ textField: inputStyle }} /></Grid>
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

export default EditClienteModal;