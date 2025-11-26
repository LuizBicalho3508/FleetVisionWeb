// Local: src/components/admin/EditFilialModal.jsx

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography,
  FormControl, InputLabel, Select, MenuItem, Grid, Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import apiClient from '../../api/apiClient';
import dayjs from 'dayjs';

const EditFilialModal = ({ open, onClose, onSuccess, filial }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', deviceLimit: -1, paymentStatus: 'ativo' });
  const [dates, setDates] = useState({ start: null, end: null });
  const [error, setError] = useState('');

  useEffect(() => {
    if (filial) {
      setFormData({
        name: filial.name || '',
        email: filial.email || '',
        password: '',
        deviceLimit: filial.deviceLimit === null ? -1 : filial.deviceLimit,
        paymentStatus: filial.attributes?.paymentStatus || 'ativo',
      });
      setDates({
        start: filial.attributes?.contractStart ? dayjs(filial.attributes.contractStart) : null,
        end: filial.attributes?.contractEnd ? dayjs(filial.attributes.contractEnd) : null,
      });
    }
  }, [filial]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.email) {
      setError('Nome e email são obrigatórios.');
      return;
    }
    setError('');
    try {
      const filialDataToUpdate = {
        id: filial.id,
        name: formData.name,
        email: formData.email,
        deviceLimit: formData.deviceLimit,
        attributes: {
          ...filial.attributes,
          paymentStatus: formData.paymentStatus,
          contractStart: dates.start ? dates.start.toISOString() : null,
          contractEnd: dates.end ? dates.end.toISOString() : null,
        },
      };
      if (formData.password) filialDataToUpdate.password = formData.password;

      await apiClient.put(`/users/${filial.id}`, filialDataToUpdate);
      onSuccess();
    } catch (err) {
      console.error('Erro ao atualizar filial:', err);
      setError('Não foi possível atualizar a filial.');
    }
  };

  // Estilos Glass
  const glassProps = { style: { backgroundColor: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 4 } };
  const inputStyle = { 
    sx: { 
        '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, 
        '& label': { color: '#aaa' },
        '& .MuiSelect-icon': { color: '#fff' },
        '& .MuiIconButton-root': { color: '#fff' }
    } 
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={glassProps}>
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Editar Filial: {filial?.name}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <TextField name="name" label="Nome da Filial" value={formData.name} onChange={handleChange} required {...inputStyle} />
          <TextField name="email" label="Email de Acesso" type="email" value={formData.email} onChange={handleChange} required {...inputStyle} />
          <TextField name="password" label="Nova Senha (Opcional)" type="password" onChange={handleChange} {...inputStyle} />
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField name="deviceLimit" label="Limite Dispositivos" type="number" value={formData.deviceLimit} onChange={handleChange} fullWidth {...inputStyle} />
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth {...inputStyle}>
                    <InputLabel id="payment-status-label">Status Pagamento</InputLabel>
                    <Select
                    labelId="payment-status-label"
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    label="Status Pagamento"
                    onChange={handleChange}
                    >
                    <MenuItem value="ativo">Ativo</MenuItem>
                    <MenuItem value="inadimplente">Inadimplente</MenuItem>
                    </Select>
                </FormControl>
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
        <Button onClick={handleUpdate} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFilialModal;