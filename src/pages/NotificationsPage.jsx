import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, 
  Chip, IconButton, Button, ToggleButton, ToggleButtonGroup, CircularProgress 
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import dayjs from 'dayjs';

// Ícones
import WarningIcon from '@mui/icons-material/Warning';
import SpeedIcon from '@mui/icons-material/Speed';
import PowerIcon from '@mui/icons-material/Power';
import FenceIcon from '@mui/icons-material/Fence';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FilterListIcon from '@mui/icons-material/FilterList';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all');

  // Busca eventos do servidor (simulado via API do Traccar /reports/events)
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      // Busca últimas 24h por padrão
      const from = dayjs().subtract(24, 'hour').toISOString();
      const to = dayjs().toISOString();
      // Nota: Em produção, você precisa passar os deviceIds. Aqui pegamos "todos" da conta.
      const devicesRes = await apiClient.get('/devices');
      const deviceIds = devicesRes.data.map(d => d.id);
      
      if (deviceIds.length === 0) return [];

      const res = await apiClient.get('/reports/events', {
        params: { deviceId: deviceIds, from, to },
        paramsSerializer: { indexes: null } // Importante para arrays no Axios
      });
      return res.data.reverse(); // Mais recentes primeiro
    },
    refetchInterval: 30000 // Atualiza a cada 30s
  });

  const getEventIcon = (type) => {
    switch(type) {
      case 'deviceOverspeed': return <SpeedIcon />;
      case 'geofenceEnter':
      case 'geofenceExit': return <FenceIcon />;
      case 'ignitionOn':
      case 'ignitionOff': return <PowerIcon />;
      case 'alarm': return <WarningIcon />;
      default: return <CheckCircleIcon />;
    }
  };

  const getEventColor = (type) => {
    if (type === 'alarm' || type === 'deviceOverspeed') return '#ff1744'; // Vermelho
    if (type.includes('geofence')) return '#00e5ff'; // Azul Cyan
    if (type.includes('ignition')) return '#ff9100'; // Laranja
    return '#00e676'; // Verde
  };

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return events;
    if (filter === 'critical') return events.filter(e => e.type === 'alarm' || e.type === 'deviceOverspeed');
    if (filter === 'geofence') return events.filter(e => e.type.includes('geofence'));
    return events;
  }, [events, filter]);

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto' }}>
      
      {/* Header e Filtros */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>Central de Alertas</Typography>
          <Typography variant="body2" color="text.secondary">Histórico das últimas 24 horas</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(e, v) => v && setFilter(v)}
            size="small"
            sx={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <ToggleButton value="all" sx={{ color: '#fff' }}>Todos</ToggleButton>
            <ToggleButton value="critical" sx={{ color: '#ff1744' }}>Críticos</ToggleButton>
            <ToggleButton value="geofence" sx={{ color: '#00e5ff' }}>Cercas</ToggleButton>
          </ToggleButtonGroup>
          
          <Button variant="outlined" startIcon={<DeleteSweepIcon />} color="error" size="small">
            Limpar
          </Button>
        </Box>
      </Box>

      {/* Lista de Alertas */}
      <Paper sx={{ 
        background: 'rgba(30, 41, 59, 0.4)', 
        backdropFilter: 'blur(16px)', 
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 2,
        maxHeight: '75vh',
        overflow: 'auto'
      }}>
        <List>
          {filteredEvents.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', opacity: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography>Nenhum alerta registrado no período.</Typography>
            </Box>
          ) : (
            filteredEvents.map((event) => {
              const color = getEventColor(event.type);
              const deviceName = events.find(e => e.deviceId === event.deviceId)?.deviceName || `Veículo #${event.deviceId}`; // O endpoint de events as vezes não traz nome, idealmente fazer um map com useVehicles

              return (
                <ListItem 
                  key={event.id} 
                  divider 
                  sx={{ 
                    '&:hover': { background: 'rgba(255,255,255,0.03)' },
                    borderLeft: `4px solid ${color}`
                  }}
                  secondaryAction={
                    <Typography variant="caption" sx={{ color: '#aaa' }}>
                      {dayjs(event.serverTime).format('HH:mm')}
                    </Typography>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${color}22`, color: color }}>
                      {getEventIcon(event.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: '#fff' }}>
                          {event.type}
                        </Typography>
                        {event.attributes?.alarm && <Chip label={event.attributes.alarm} size="small" color="error" />}
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        Veículo ID: {event.deviceId} • {dayjs(event.serverTime).format('DD/MM/YYYY')}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default NotificationsPage;