import React, { useState, useEffect } from 'react';
import { Box, Typography, Slide, Button } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import RefreshIcon from '@mui/icons-material/Refresh';

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Slide direction="down" in={!isOnline} mountOnEnter unmountOnExit>
      <Box sx={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        bgcolor: '#ff1744', color: '#fff', p: 1, px: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <WifiOffIcon />
        <Typography variant="body2" fontWeight="bold">
          Você está offline. As alterações serão salvas localmente e sincronizadas quando a conexão retornar.
        </Typography>
        <Button 
          size="small" 
          color="inherit" 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
          sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
        >
          Tentar Reconectar
        </Button>
      </Box>
    </Slide>
  );
};

export default OfflineBanner;