import React from 'react';
import { Paper, Box, Typography, Avatar, LinearProgress, Chip } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const DriverRankCard = ({ driver, rank }) => {
  // Cores baseadas na nota
  let color = '#00e676'; // Verde (Excelente)
  if (driver.score < 70) color = '#ff9100'; // Laranja (Atenção)
  if (driver.score < 50) color = '#ff1744'; // Vermelho (Perigo)

  return (
    <Paper sx={{ 
      p: 2, mb: 2, 
      display: 'flex', alignItems: 'center', gap: 2,
      background: 'rgba(30, 41, 59, 0.4)', 
      backdropFilter: 'blur(10px)',
      borderLeft: `4px solid ${color}`,
      borderRadius: 2
    }}>
      {/* Posição no Ranking */}
      <Box sx={{ minWidth: 40, textAlign: 'center' }}>
        {rank <= 3 ? (
          <EmojiEventsIcon sx={{ color: rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : '#cd7f32', fontSize: 30 }} />
        ) : (
          <Typography variant="h6" sx={{ color: '#aaa' }}>#{rank}</Typography>
        )}
      </Box>

      <Avatar sx={{ width: 50, height: 50, bgcolor: `${color}22`, color: color }}>
        {driver.name.charAt(0)}
      </Avatar>

      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="subtitle1" fontWeight="bold">{driver.name}</Typography>
          <Typography variant="h6" sx={{ color: color, fontWeight: 'bold' }}>{driver.score}</Typography>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={driver.score} 
          sx={{ 
            height: 6, borderRadius: 3, 
            bgcolor: 'rgba(255,255,255,0.1)',
            '& .MuiLinearProgress-bar': { bgcolor: color } 
          }} 
        />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Typography variant="caption" sx={{ color: '#aaa' }}>
            {driver.distance} km rodados
          </Typography>
          <Typography variant="caption" sx={{ color: '#aaa', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <WarningIcon sx={{ fontSize: 12, color: '#ff9100' }} /> {driver.infractions} infrações
          </Typography>
        </Box>
      </Box>

      <Chip 
        label={driver.score >= 90 ? "Elite" : driver.score >= 70 ? "Bom" : "Risco"} 
        size="small" 
        sx={{ bgcolor: `${color}22`, color: color, fontWeight: 'bold', border: `1px solid ${color}44` }} 
      />
    </Paper>
  );
};

export default DriverRankCard;