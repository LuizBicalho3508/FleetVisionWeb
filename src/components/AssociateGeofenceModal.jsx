import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, List, ListItem,
  ListItemText, Paper, Typography, CircularProgress, Box, IconButton, Checkbox, ListItemIcon
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import apiClient from '../api/apiClient';

const AssociateGeofenceModal = ({ open, onClose, geofence }) => {
  const [loading, setLoading] = useState(true);
  const [allDevices, setAllDevices] = useState([]);
  const [associatedIds, setAssociatedIds] = useState(new Set());
  const [checked, setChecked] = useState([]);

  // Busca dispositivos ao abrir
  const fetchDevices = useCallback(async () => {
    if (open && geofence) {
      setLoading(true);
      try {
        const [allDevicesRes, geofenceDevicesRes] = await Promise.all([
          apiClient.get('/devices'), // Todos os dispositivos
          apiClient.get(`/devices?geofenceId=${geofence.id}`) // Já na cerca
        ]);
        setAllDevices(allDevicesRes.data);
        setAssociatedIds(new Set(geofenceDevicesRes.data.map(d => d.id)));
      } catch (error) {
        console.error("Erro ao buscar dispositivos:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [open, geofence]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Filtra as listas
  const availableDevices = allDevices.filter(d => !associatedIds.has(d.id));
  const associatedDevices = allDevices.filter(d => associatedIds.has(d.id));

  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) newChecked.push(value);
    else newChecked.splice(currentIndex, 1);
    setChecked(newChecked);
  };

  const handleMove = async (direction) => {
    const devicesToMove = checked;
    setLoading(true);

    try {
      const requests = devicesToMove.map(deviceId => {
        const permission = { deviceId, geofenceId: geofence.id };
        // Se for 'associate' faz POST, se 'disassociate' faz DELETE
        if (direction === 'associate') {
            return apiClient.post('/permissions', permission);
        } else {
            // Axios delete com body requer config 'data'
            return apiClient.delete('/permissions', { data: permission });
        }
      });

      await Promise.all(requests);
      setChecked([]);
      fetchDevices(); // Atualiza as listas
    } catch (error) {
      console.error(`Erro ao mover dispositivos:`, error);
      setLoading(false);
    }
  };

  // Estilo Glass para as listas
  const listPaperStyle = {
    height: 300, 
    overflow: 'auto',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 2
  };

  const customList = (title, items) => (
    <Paper sx={listPaperStyle}>
      <Typography sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 'bold' }} variant="subtitle2">
        {title} ({items.length})
      </Typography>
      <List dense component="div" role="list">
        {items.map((device) => {
          const labelId = `transfer-list-item-${device.id}-label`;
          return (
            <ListItem key={device.id} role="listitem" button onClick={() => handleToggle(device.id)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(device.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: '#00e5ff' } }}
                />
              </ListItemIcon>
              <ListItemText 
                id={labelId} 
                primary={device.name} 
                primaryTypographyProps={{ color: '#e0e0e0' }}
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );

  // Estilo do Modal Principal
  const modalPaperProps = {
    style: {
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#fff',
      borderRadius: 16
    },
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={modalPaperProps}>
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        Associar Veículos: {geofence?.name}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
            <Grid item xs={5}>{customList('Disponíveis', availableDevices)}</Grid>
            <Grid item xs={2}>
              <Grid container direction="column" alignItems="center">
                <Button
                  sx={{ my: 0.5, color: '#00e5ff', borderColor: 'rgba(255,255,255,0.1)' }}
                  variant="outlined"
                  size="small"
                  onClick={() => handleMove('associate')}
                  disabled={checked.length === 0}
                >
                  &gt;
                </Button>
                <Button
                  sx={{ my: 0.5, color: '#ff1744', borderColor: 'rgba(255,255,255,0.1)' }}
                  variant="outlined"
                  size="small"
                  onClick={() => handleMove('disassociate')}
                  disabled={checked.length === 0}
                >
                  &lt;
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={5}>{customList('Associados', associatedDevices)}</Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#fff' }}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssociateGeofenceModal;