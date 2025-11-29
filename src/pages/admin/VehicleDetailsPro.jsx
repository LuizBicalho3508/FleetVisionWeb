import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Grid, Paper, Tabs, Tab, Button, Avatar, Chip, IconButton, Divider, LinearProgress 
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import apiClient from '../../api/apiClient';

// Ícones
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import TimelineIcon from '@mui/icons-material/Timeline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EditIcon from '@mui/icons-material/Edit';

// Dados Mockados para gráficos
const costData = [
  { month: 'Jan', manutencao: 120, combustivel: 800 },
  { month: 'Fev', manutencao: 0, combustivel: 750 },
  { month: 'Mar', manutencao: 450, combustivel: 820 },
  { month: 'Abr', manutencao: 0, combustivel: 780 },
  { month: 'Mai', manutencao: 200, combustivel: 850 },
];

const VehicleDetailsPro = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  // Busca dados
  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: async () => {
      const res = await apiClient.get('/devices', { params: { id: vehicleId } });
      return res.data[0];
    }
  });

  if (isLoading || !vehicle) return <LinearProgress />;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold">{vehicle.name}</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip label={vehicle.status === 'online' ? 'Online' : 'Offline'} color={vehicle.status === 'online' ? 'success' : 'error'} size="small" />
              <Typography variant="body2" color="text.secondary">{vehicle.model || 'Modelo não especificado'} • {vehicle.uniqueId}</Typography>
            </Box>
          </Box>
        </Box>
        <Button variant="outlined" startIcon={<EditIcon />}>Editar Veículo</Button>
      </Box>

      {/* Grid Principal */}
      <Grid container spacing={3}>
        {/* Coluna Esquerda: Info Rápida */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mb: 2 }}>
                <DirectionsCarIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6">{vehicle.name}</Typography>
              <Typography variant="body2" color="text.secondary">Última atualização: {new Date(vehicle.lastUpdate).toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">ODÔMETRO</Typography>
                <Typography variant="body1" fontWeight="bold">{(vehicle.attributes.totalDistance / 1000).toFixed(0)} km</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">HORÍMETRO</Typography>
                <Typography variant="body1" fontWeight="bold">{(vehicle.attributes.hours / 3600000).toFixed(1)} h</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">LOCALIZAÇÃO</Typography>
                <Typography variant="body2" noWrap>{vehicle.address || 'Processando endereço...'}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Saúde do Veículo</Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Bateria</Typography>
                <Typography variant="body2" color="success.main">12.4 V</Typography>
              </Box>
              <LinearProgress variant="determinate" value={80} color="success" />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Sinal GPS</Typography>
                <Typography variant="body2" color="primary.main">Forte</Typography>
              </Box>
              <LinearProgress variant="determinate" value={90} />
            </Box>
          </Paper>
        </Grid>

        {/* Coluna Direita: Dados Detalhados */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%', borderRadius: 3, overflow: 'hidden' }}>
            <Tabs 
              value={tabIndex} 
              onChange={(e, v) => setTabIndex(v)} 
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<TimelineIcon />} label="Performance" iconPosition="start" />
              <Tab icon={<ReceiptLongIcon />} label="Custos" iconPosition="start" />
              <Tab icon={<BuildIcon />} label="Manutenção" iconPosition="start" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* ABA 0: PERFORMANCE */}
              {tabIndex === 0 && (
                <Box sx={{ height: 300 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Utilização Semanal</Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={costData}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: 8 }} />
                      <Line type="monotone" dataKey="combustivel" stroke="#00e5ff" strokeWidth={3} name="Km Rodados" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {/* ABA 1: CUSTOS */}
              {tabIndex === 1 && (
                <Box sx={{ height: 300 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Análise de Custos (R$)</Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costData}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', borderRadius: 8 }} />
                      <Bar dataKey="manutencao" fill="#ff1744" name="Manutenção" stackId="a" />
                      <Bar dataKey="combustivel" fill="#00e676" name="Combustível" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {/* ABA 2: MANUTENÇÃO (Lista Simples) */}
              {tabIndex === 2 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Histórico recente de serviços
                  </Typography>
                  {/* Reutilizar MaintenanceList aqui se desejar */}
                  <Button variant="contained" fullWidth>Registrar Nova Manutenção</Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VehicleDetailsPro;