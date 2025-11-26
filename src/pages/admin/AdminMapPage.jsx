// Local: src/pages/admin/AdminMapPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Paper, Typography, CircularProgress, Grid, 
  FormControl, InputLabel, Select, MenuItem, Button 
} from '@mui/material';
import MapComponent from '../../components/MapComponent';
import apiClient from '../../api/apiClient';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

const AdminMapPage = () => {
  // Dados
  const [allDevices, setAllDevices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  // Dados para o Mapa
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [focusedPosition, setFocusedPosition] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [devicesRes, usersRes] = await Promise.all([
        apiClient.get('/devices'),
        apiClient.get('/users')
      ]);

      setAllDevices(devicesRes.data);
      // Admin vê todos os clientes
      setClients(usersRes.data.filter(u => u.attributes?.role === 'cliente'));

      // Se não houver filtros, mostra tudo
      if (!selectedClientId && !selectedDeviceId) {
        setFilteredDevices(devicesRes.data);
      }
    } catch (error) {
      console.error("Erro ao carregar monitoramento:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedClientId, selectedDeviceId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
        // Atualiza apenas posições a cada 10s
        apiClient.get('/devices').then(res => {
            if(Array.isArray(res.data)) setAllDevices(res.data);
        }).catch(console.error);
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Lógica de Filtragem
  useEffect(() => {
    let result = allDevices;

    if (selectedClientId) {
      result = result.filter(d => d.attributes?.ownerId === selectedClientId);
    }

    setFilteredDevices(result);

    if (selectedDeviceId) {
      const device = allDevices.find(d => d.id === selectedDeviceId);
      if (device && device.latitude && device.longitude) {
        setFocusedPosition({ latitude: device.latitude, longitude: device.longitude });
      }
    } else {
      setFocusedPosition(null);
    }
  }, [selectedClientId, selectedDeviceId, allDevices]);

  const handleClientChange = (e) => {
    setSelectedClientId(e.target.value);
    setSelectedDeviceId('');
  };

  const clearFilters = () => {
    setSelectedClientId('');
    setSelectedDeviceId('');
  };

  // Estilos
  const glassPaper = {
    p: 2, mb: 2,
    background: 'rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 1
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } },
    '& .MuiInputLabel-root': { color: '#aaa' },
    '& .MuiSelect-icon': { color: '#fff' }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* BARRA DE FILTROS */}
      <Paper sx={glassPaper}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small" sx={inputStyle}>
              <InputLabel>Filtrar por Cliente</InputLabel>
              <Select value={selectedClientId} label="Filtrar por Cliente" onChange={handleClientChange}>
                <MenuItem value=""><em>Todos os Clientes</em></MenuItem>
                {clients.map(client => (
                  <MenuItem key={client.id} value={client.id}>{client.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small" sx={inputStyle}>
              <InputLabel>Localizar Veículo</InputLabel>
              <Select 
                value={selectedDeviceId} 
                label="Localizar Veículo" 
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                disabled={filteredDevices.length === 0}
              >
                <MenuItem value=""><em>Selecione...</em></MenuItem>
                {filteredDevices.map(device => (
                  <MenuItem key={device.id} value={device.id}>
                    {device.name} {device.status === 'offline' ? '(Offline)' : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            {(selectedClientId || selectedDeviceId) && (
              <Button variant="outlined" color="error" startIcon={<FilterAltOffIcon />} onClick={clearFilters} fullWidth sx={{ borderColor: 'rgba(255,23,68,0.5)', color: '#ff1744' }}>
                Limpar
              </Button>
            )}
          </Grid>
          
          <Grid item xs={12} md={2} sx={{ textAlign: 'right' }}>
             <Typography variant="caption" sx={{ color: '#00e5ff', fontWeight: 'bold' }}>
                {filteredDevices.length} VEÍCULOS
             </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* MAPA */}
      {loading && allDevices.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
      ) : (
        <Paper sx={{ 
          flexGrow: 1, overflow: 'hidden', 
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, position: 'relative'
        }}>
          <MapComponent devices={filteredDevices} selectedPosition={focusedPosition} />
        </Paper>
      )}
    </Box>
  );
};

export default AdminMapPage;