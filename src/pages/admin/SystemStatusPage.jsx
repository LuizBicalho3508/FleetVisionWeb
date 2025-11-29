import React from 'react';
import { 
  Box, Typography, Grid, Paper, Chip, List, ListItem, ListItemText, ListItemIcon, LinearProgress 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import StorageIcon from '@mui/icons-material/Storage';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import SpeedIcon from '@mui/icons-material/Speed';

const ServiceStatus = ({ name, status, latency }) => {
  let color = '#00e676';
  let icon = <CheckCircleIcon sx={{ color }} />;
  let label = 'Operacional';

  if (status === 'warning') { color = '#ff9100'; icon = <WarningIcon sx={{ color }} />; label = 'Lentidão'; }
  if (status === 'error') { color = '#ff1744'; icon = <ErrorIcon sx={{ color }} />; label = 'Fora do Ar'; }

  return (
    <ListItem sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', py: 2 }}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText 
        primary={<Typography fontWeight="bold" color="#fff">{name}</Typography>} 
        secondary={<Typography variant="caption" color="text.secondary">{latency ? `${latency}ms` : ''}</Typography>} 
      />
      <Chip label={label} size="small" sx={{ bgcolor: `${color}22`, color: color, fontWeight: 'bold', border: `1px solid ${color}44` }} />
    </ListItem>
  );
};

const SystemStatusPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff', mb: 4 }}>Saúde do Sistema</Typography>

      <Grid container spacing={3}>
        {/* SERVIÇOS CRÍTICOS */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 0, bgcolor: 'rgba(30, 41, 59, 0.4)', borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="h6" color="#fff">Core Services</Typography>
            </Box>
            <List>
              <ServiceStatus name="API Gateway" status="ok" latency={45} />
              <ServiceStatus name="Banco de Dados (MySQL)" status="ok" latency={12} />
              <ServiceStatus name="WebSocket (Traccar)" status="warning" latency={350} />
              <ServiceStatus name="Serviço de Relatórios" status="ok" latency={120} />
              <ServiceStatus name="Geocodificação (Google Maps)" status="ok" latency={80} />
            </List>
          </Paper>
        </Grid>

        {/* MÉTRICAS DE INFRAESTRUTURA */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: 'rgba(30, 41, 59, 0.4)', borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" color="#fff" sx={{ mb: 3 }}>Recursos do Servidor</Typography>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="#aaa" display="flex" gap={1}><SpeedIcon fontSize="small"/> CPU Usage</Typography>
                <Typography variant="body2" fontWeight="bold" color="#fff">42%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={42} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#00e5ff' } }} />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="#aaa" display="flex" gap={1}><StorageIcon fontSize="small"/> Memory Usage</Typography>
                <Typography variant="body2" fontWeight="bold" color="#fff">3.4GB / 8GB</Typography>
              </Box>
              <LinearProgress variant="determinate" value={45} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#7c4dff' } }} />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="#aaa" display="flex" gap={1}><CloudQueueIcon fontSize="small"/> Disk Space</Typography>
                <Typography variant="body2" fontWeight="bold" color="#fff">78%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={78} color="warning" sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemStatusPage;