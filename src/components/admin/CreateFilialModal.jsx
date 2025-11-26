// Local: src/components/admin/CreateFilialModal.jsx

import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, Grid, Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import apiClient from '../../api/apiClient';
import dayjs from 'dayjs';

const CreateFilialModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', deviceLimit: -1,
  });
  const [dates, setDates] = useState({ start: dayjs(), end: dayjs().add(1, 'year') });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Nome, email e senha são obrigatórios.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const filialData = {
        ...formData,
        manager: true, // Filial é um gerente
        attributes: {
          role: 'filial',
          paymentStatus: 'ativo',
          contractStart: dates.start ? dates.start.toISOString() : null,
          contractEnd: dates.end ? dates.end.toISOString() : null,
        },
      };
      await apiClient.post('/users', filialData);
      onSuccess();
      setFormData({ name: '', email: '', password: '', deviceLimit: -1 });
    } catch (err) {
      console.error('Erro ao criar filial:', err);
      setError('Não foi possível criar a filial. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  // Estilos Glass
  const glassProps = { style: { backgroundColor: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 4 } };
  const inputStyle = { 
    sx: { '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, '& label': { color: '#aaa' }, '& .MuiIconButton-root': {color: '#fff'} } 
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={glassProps}>
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Adicionar Nova Filial</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {error && <Alert severity="error" sx={{ borderRadius: 1 }}>{error}</Alert>}
          
          <TextField name="name" label="Nome da Filial" onChange={handleChange} required {...inputStyle} />
          <TextField name="email" label="Email de Acesso" type="email" onChange={handleChange} required {...inputStyle} />
          <TextField name="password" label="Senha" type="password" onChange={handleChange} required {...inputStyle} />
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
               <TextField name="deviceLimit" label="Limite de Dispositivos" type="number" defaultValue={-1} onChange={handleChange} fullWidth {...inputStyle} helperText="-1 para ilimitado" sx={{...inputStyle.sx, '& .MuiFormHelperText-root': {color:'#aaa'}}} />
            </Grid>
            <Grid item xs={6}>
               {/* Espaço reservado ou outro campo */}
            </Grid>
            <Grid item xs={6}>
              <DatePicker label="Início Contrato" value={dates.start} onChange={(v) => setDates({...dates, start: v})} slotProps={{ textField: { fullWidth: true, ...inputStyle } }} />
            </Grid>
            <Grid item xs={6}>
              <DatePicker label="Fim Contrato" value={dates.end} onChange={(v) => setDates({...dates, end: v})} slotProps={{ textField: { fullWidth: true, ...inputStyle } }} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Button onClick={onClose} sx={{ color: '#fff' }}>Cancelar</Button>
        <Button onClick={handleCreate} variant="contained" disabled={loading}>Criar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFilialModal;