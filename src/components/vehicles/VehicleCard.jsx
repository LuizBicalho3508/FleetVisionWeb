import React from 'react';
import { 
  Card, CardContent, Typography, Box, IconButton, Chip, Avatar, Tooltip 
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { motion } from 'framer-motion';

const VehicleCard = ({ vehicle, onEdit, onDelete, ownerName }) => {
  const isOnline = vehicle.status === 'online';
  const statusColor = isOnline ? '#00e676' : '#ff1744';

  return (
    <Card 
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 8px 20px rgba(0,229,255,0.15)' }}
      sx={{ 
        height: '100%', 
        background: 'rgba(30, 41, 59, 0.4)', 
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 3,
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {/* Status Dot */}
      <Box sx={{
        position: 'absolute', top: 16, right: 16, width: 12, height: 12,
        borderRadius: '50%', bgcolor: statusColor,
        boxShadow: `0 0 10px ${statusColor}`
      }} />

      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ 
            bgcolor: isOnline ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 23, 68, 0.1)', 
            color: statusColor, width: 56, height: 56, mr: 2 
          }}>
            <DirectionsCarIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
              {vehicle.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              {vehicle.attributes?.modelo || 'Modelo N/A'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={vehicle.uniqueId} size="small" variant="outlined" sx={{ borderRadius: 1 }} />
          {ownerName && <Chip icon={<Box sx={{width:10}}/>} label={ownerName} size="small" color="secondary" sx={{ borderRadius: 1 }} />}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
          <LocationOnIcon fontSize="inherit" />
          <Typography variant="caption" noWrap>
            {vehicle.address || 'Localização não disponível'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <SignalCellularAltIcon sx={{ color: isOnline ? '#00e676' : '#666', fontSize: 20 }} />
             <Typography variant="caption" sx={{ color: isOnline ? '#fff' : '#666' }}>
               {isOnline ? 'Conectado' : 'Sem sinal'}
             </Typography>
          </Box>
          
          <Box>
            <Tooltip title="Editar">
              <IconButton size="small" onClick={() => onEdit(vehicle)} sx={{ color: '#00e5ff' }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir">
              <IconButton size="small" onClick={() => onDelete(vehicle.id)} sx={{ color: '#ff1744' }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;