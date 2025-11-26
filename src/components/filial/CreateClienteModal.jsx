import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Alert, Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { adminApiClient } from '../../api/apiClient';
import dayjs from 'dayjs';

const CreateClienteModal = ({ open, onClose, onSuccess, filialId }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', deviceLimit: 1 });
  const [dates, setDates] = useState({ start: dayjs(), end: dayjs().add(1, 'year') });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      const clienteData = {
        ...formData,
        deviceReadonly: false,
        attributes: {
          role: 'cliente',
          filialId: filialId,
          contractStart: dates.start ? dates.start.toISOString() : null,
          contractEnd: dates.end ? dates.end.toISOString() : null,
        },
      };

      const response = await adminApiClient.post('/users', clienteData);
      await adminApiClient.post('/permissions', { userId: filialId, managedUserId: response.data.id });

      onSuccess();
      setFormData({ name: '', email: '', password: '', deviceLimit: 1 });
    } catch (err) {
      setError(err.response?.data?.message || 'Falha ao criar cliente.');
    } finally {
      setLoading(false);
    }
  };

  // Estilos e Configuração Glass (Mantidos da resposta anterior)
  const paperProps = { style: { backgroundColor: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6 } };
  const inputStyles = {
    InputLabelProps: { style: { color: '#aaa' } },
    sx: { '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, color: '#fff' }, '& input': { color: '#fff' }, '& .MuiIconButton-root': {color: '#fff'} }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={paperProps}>
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Novo Cliente & Contrato</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField name="name" label="Nome do Cliente" onChange={handleChange} required {...inputStyles} />
          <TextField name="email" label="Email" type="email" onChange={handleChange} required {...inputStyles} />
          <TextField name="password" label="Senha" type="password" onChange={handleChange} required {...inputStyles} />
          <TextField name="deviceLimit" label="Limite Veículos" type="number" defaultValue={1} onChange={handleChange} {...inputStyles} />
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <DatePicker label="Início Contrato" value={dates.start} onChange={(v) => setDates({...dates, start: v})} slotProps={{ textField: inputStyles }} />
            </Grid>
            <Grid item xs={6}>
              <DatePicker label="Fim Contrato" value={dates.end} onChange={(v) => setDates({...dates, end: v})} slotProps={{ textField: inputStyles }} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Button onClick={onClose} sx={{ color: '#fff' }}>Cancelar</Button>
        <Button onClick={handleCreate} variant="contained" disabled={loading}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateClienteModal;