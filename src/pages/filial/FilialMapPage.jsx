// Local: src/pages/filial/FilialMapPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Paper, Typography, CircularProgress, Grid, 
  FormControl, InputLabel, Select, MenuItem, Button 
} from '@mui/material';
import MapComponent from '../../components/MapComponent';
import apiClient from '../../api/apiClient';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

const FilialMapPage = () => {
  // Dados Brutos (Banco de Dados)
  const [allDevices, setAllDevices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  // Dados Computados (O que vai para o mapa)
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [focusedPosition, setFocusedPosition] = useState(null);

  // --- 1. BUSCA DADOS INICIAIS ---
  const fetchData = useCallback(async () => {
    try {
      const [devicesRes, usersRes] = await Promise.all([
        apiClient.get('/devices'),
        apiClient.get('/users')
      ]);

      const devices = devicesRes.data || [];
      const users = usersRes.data || [];

      setAllDevices(devices);
      
      // Filtra apenas usuários que são clientes (não admins/outras filiais)
      // O endpoint /users da filial já deve retornar apenas o que ela pode ver
      const myClients = users.filter(u => !u.administrator && u.attributes?.role === 'cliente');
      setClients(myClients);

      // Inicialmente, mostra tudo
      if (!selectedClientId && !selectedDeviceId) {
        setFilteredDevices(devices);
      }

    } catch (error) {
      console.error("Erro ao carregar monitoramento:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedClientId, selectedDeviceId]);

  useEffect(() => {
    fetchData();
    // Polling de 10s para atualizar posições
    const interval = setInterval(() => {
        // Nota: Em um app real, faríamos apenas o refresh das posições aqui, não dos clientes
        apiClient.get('/devices').then(res => {
            if(Array.isArray(res.data)) {
                setAllDevices(res.data);
            }
        }).catch(console.error);
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // --- 2. LÓGICA DE FILTRAGEM ---
  useEffect(() => {
    let result = allDevices;

    // Filtro por Cliente
    if (selectedClientId) {
      result = result.filter(d => d.attributes?.ownerId === selectedClientId);
    }

    // Filtro por Veículo Específico (Para a lista do mapa)
    // Se selecionar um veículo, a lista filtrada pode ser só ele OU todos do cliente (depende da UX).
    // Vamos manter "Todos do Cliente" no mapa, mas FOCAR no selecionado.
    
    setFilteredDevices(result);

    // Lógica de Foco (Zoom)
    if (selectedDeviceId) {
      const device = allDevices.find(d => d.id === selectedDeviceId);
      if (device && device.latitude && device.longitude) {
        setFocusedPosition({ latitude: device.latitude, longitude: device.longitude });
      }
    } else {
      setFocusedPosition(null); // Remove foco específico (Mapa vai ajustar aos limites)
    }

  }, [selectedClientId, selectedDeviceId, allDevices]);

  // Handlers
  const handleClientChange = (e) => {
    setSelectedClientId(e.target.value);
    setSelectedDeviceId(''); // Reseta veículo ao mudar cliente
  };

  const handleDeviceChange = (e) => {
    setSelectedDeviceId(e.target.value);
  };

  const clearFilters = () => {
    setSelectedClientId('');
    setSelectedDeviceId('');
  };

  // Estilos
  const glassPaper = {
    p: 2,
    mb: 2,
    background: 'rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 1 // 4px
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } },
    '& .MuiInputLabel-root': { color: '#aaa' },
    '& .MuiSelect-icon': { color: '#fff' }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* BARRA DE FILTROS SUPERIOR */}
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
                onChange={handleDeviceChange}
                disabled={filteredDevices.length === 0}
              >
                <MenuItem value=""><em>Visão Geral da Frota</em></MenuItem>
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
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<FilterAltOffIcon />}
                onClick={clearFilters}
                fullWidth
                sx={{ borderColor: 'rgba(255,23,68,0.5)', color: '#ff1744' }}
              >
                Limpar
              </Button>
            )}
          </Grid>
          
          <Grid item xs={12} md={2} sx={{ textAlign: 'right' }}>
             <Typography variant="caption" sx={{ color: '#00e5ff', fontWeight: 'bold' }}>
                {filteredDevices.length} VEÍCULOS NO MAPA
             </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* MAPA */}
      {loading && allDevices.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
      ) : (
        <Paper sx={{ 
          flexGrow: 1, 
          overflow: 'hidden', 
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 1,
          position: 'relative'
        }}>
          <MapComponent 
            devices={filteredDevices} 
            selectedPosition={focusedPosition} 
          />
        </Paper>
      )}
    </Box>
  );
};

export default FilialMapPage;