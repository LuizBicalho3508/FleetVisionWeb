import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Grid, CircularProgress } from '@mui/material';
import apiClient from '../api/apiClient';

const EditVehiclePage = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/devices?id=${vehicleId}`).then(res => {
      if(res.data[0]) setFormData(res.data[0]);
      setLoading(false);
    });
  }, [vehicleId]);

  const handleSave = async () => {
    await apiClient.put(`/devices/${vehicleId}`, formData);
    navigate('/dashboard/vehicles');
  };

  if (loading) return <CircularProgress />;

  // Estilo input glass
  const inputStyle = { 
    sx: { '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, InputLabelProps: { style: { color: '#aaa' } } } 
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 800, background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', borderRadius: 4 }}>
        <Typography variant="h5" sx={{ color: '#fff', mb: 3 }}>Editar Veículo</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}><TextField label="Nome" fullWidth value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} {...inputStyle} /></Grid>
          <Grid item xs={12}><Button variant="contained" onClick={handleSave}>Salvar</Button></Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EditVehiclePage;