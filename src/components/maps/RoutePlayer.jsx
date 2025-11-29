import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, IconButton, Slider, Typography, Tooltip, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import ReplayIcon from '@mui/icons-material/Replay';
import SpeedIcon from '@mui/icons-material/Speed';
import dayjs from 'dayjs';

const RoutePlayer = ({ routeData, onPointChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms por frame (quanto menor, mais rápido)
  const timerRef = useRef(null);

  const totalPoints = routeData?.length || 0;
  const currentPoint = routeData?.[currentIndex];

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= totalPoints - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, totalPoints, playbackSpeed]);

  // Notifica o componente pai (Mapa) para atualizar o marcador fantasma
  useEffect(() => {
    if (currentPoint && onPointChange) {
      onPointChange(currentPoint);
    }
  }, [currentIndex, currentPoint, onPointChange]);

  const handleSliderChange = (event, newValue) => {
    setCurrentIndex(newValue);
  };

  const toggleSpeed = () => {
    // Alterna velocidades: 1x (1000ms) -> 2x (500ms) -> 5x (200ms)
    setPlaybackSpeed(prev => prev === 1000 ? 500 : prev === 500 ? 200 : 1000);
  };

  if (!routeData || routeData.length === 0) return null;

  return (
    <Paper sx={{ 
      position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', 
      width: '90%', maxWidth: 600, p: 2, zIndex: 1000,
      bgcolor: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(10px)', borderRadius: 4,
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: '#aaa', display: 'flex', alignItems: 'center', gap: 1 }}>
          <SpeedIcon fontSize="small" /> 
          {currentPoint ? `${(currentPoint.speed * 1.852).toFixed(0)} km/h` : '0 km/h'}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#fff' }}>
          {currentPoint ? dayjs(currentPoint.deviceTime).format('DD/MM HH:mm:ss') : '--:--'}
        </Typography>
        <Chip 
          label={`${currentIndex + 1}/${totalPoints}`} 
          size="small" 
          sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.7rem' }} 
        />
      </Box>

      <Slider
        size="small"
        value={currentIndex}
        min={0}
        max={totalPoints - 1}
        onChange={handleSliderChange}
        sx={{ color: '#00e5ff', mb: 2 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Tooltip title="Reiniciar">
          <IconButton onClick={() => setCurrentIndex(0)} sx={{ color: '#fff' }}>
            <ReplayIcon />
          </IconButton>
        </Tooltip>
        
        <IconButton 
          onClick={() => setIsPlaying(!isPlaying)} 
          sx={{ 
            bgcolor: '#00e5ff', color: '#000', 
            '&:hover': { bgcolor: '#00b2cc' },
            width: 48, height: 48 
          }}
        >
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        <Tooltip title={`Velocidade: ${playbackSpeed === 1000 ? '1x' : playbackSpeed === 500 ? '2x' : '5x'}`}>
          <IconButton onClick={toggleSpeed} sx={{ color: playbackSpeed < 1000 ? '#00e676' : '#fff' }}>
            <FastForwardIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default RoutePlayer;