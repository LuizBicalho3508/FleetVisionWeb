import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, icon, color = 'primary.main', unit = '' }) => (
  <Card sx={{ 
    height: '100%', 
    // Adiciona um gradiente sutil ao passar o mouse
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 8px 24px -4px ${color}66`, // Sombra colorida (glow)
      border: `1px solid ${color}88`
    }
  }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3, '&:last-child': { pb: 3 } }}>
      {/* Ícone com fundo brilhante */}
      <Box sx={{ 
        bgcolor: `${color}22`, // Cor com transparência
        borderRadius: '12px', 
        p: 1.5, 
        mr: 2, 
        color: color, 
        display: 'flex',
        boxShadow: `0 0 10px ${color}44` 
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h4" component="div" fontWeight="bold" sx={{ color: '#fff' }}>
          {value}
          {unit && <Typography variant="body1" component="span" sx={{ ml: 0.5, opacity: 0.6 }}>{unit}</Typography>}
        </Typography>
        <Typography variant="caption" sx={{ 
          textTransform: 'uppercase', 
          fontWeight: 'bold', 
          letterSpacing: 1,
          opacity: 0.7 
        }}>
          {title}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;