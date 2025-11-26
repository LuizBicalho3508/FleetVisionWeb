import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Alert } from '@mui/material';
import { adminApiClient } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';

const CreateDriverModal = ({ open, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', uniqueId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!formData.name || !formData.uniqueId) { setError("Preencha todos os campos."); return; }
    setLoading(true);
    try {
      const res = await adminApiClient.post('/drivers', formData);
      await adminApiClient.post('/permissions', { userId: user.id, driverId: res.data.id });
      onSuccess();
      setFormData({ name: '', uniqueId: '' });
    } catch (err) { setError("Erro ao criar."); } 
    finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ style: { backgroundColor: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 4 } }}>
      <DialogTitle sx={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>Novo Motorista</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Nome" fullWidth onChange={e => setFormData({...formData, name: e.target.value})} sx={{'& input':{color:'#fff'}, '& fieldset':{borderColor:'rgba(255,255,255,0.2)'}}} />
          <TextField label="Identificador (CPF)" fullWidth onChange={e => setFormData({...formData, uniqueId: e.target.value})} sx={{'& input':{color:'#fff'}, '& fieldset':{borderColor:'rgba(255,255,255,0.2)'}}} />
        </Box>
      </DialogContent>
      <DialogActions sx={{borderTop:'1px solid rgba(255,255,255,0.1)', p:2}}>
        <Button onClick={onClose} sx={{color:'#fff'}}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};
export default CreateDriverModal;