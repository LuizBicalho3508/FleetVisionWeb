// Local: src/components/HistoryPanel.jsx

import React from 'react';
import { 
  Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, ButtonGroup, Divider, TextField
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';

const HistoryPanel = ({
  devices, selectedDeviceId, setSelectedDeviceId, setDateFrom, setDateTo, onGenerateReport, loading,
  reportType, setReportType
}) => {

  // Estilos para Inputs Glass (Texto Branco e Bordas Claras)
  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
      '&.Mui-focused fieldset': { borderColor: '#00e5ff' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#00e5ff' },
    '& .MuiSelect-icon': { color: '#fff' },
    '& .MuiIconButton-root': { color: '#00e5ff' } // Ícone do calendário
  };

  const setPeriod = (period) => {
    if (period === 'today') {
      setDateFrom(dayjs().startOf('day'));
      setDateTo(dayjs().endOf('day'));
    } else if (period === 'yesterday') {
      setDateFrom(dayjs().subtract(1, 'day').startOf('day'));
      setDateTo(dayjs().subtract(1, 'day').endOf('day'));
    } else if (period === 'week') {
      setDateFrom(dayjs().subtract(7, 'days').startOf('day'));
      setDateTo(dayjs().endOf('day'));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>Filtros</Typography>

        <FormControl fullWidth size="small" sx={inputStyle}>
          <InputLabel>Tipo de Relatório</InputLabel>
          <Select
            value={reportType}
            label="Tipo de Relatório"
            onChange={(e) => setReportType(e.target.value)}
          >
            <MenuItem value="route">Rota no Mapa</MenuItem>
            <MenuItem value="trips">Relatório de Viagens</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" sx={inputStyle}>
          <InputLabel>Veículo</InputLabel>
          <Select
            value={selectedDeviceId}
            label="Veículo"
            onChange={(e) => setSelectedDeviceId(e.target.value)}
          >
            {devices.map((device) => (
              <MenuItem key={device.id} value={device.id}>
                {device.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>PERÍODO RÁPIDO</Typography>
        
        <ButtonGroup fullWidth variant="outlined" size="small" sx={{ 
            '& .MuiButton-root': { 
              color: '#fff', 
              borderColor: 'rgba(255,255,255,0.2)',
              '&:hover': { borderColor: '#00e5ff', background: 'rgba(0,229,255,0.1)' }
            } 
        }}>
          <Button onClick={() => setPeriod('today')}>Hoje</Button>
          <Button onClick={() => setPeriod('yesterday')}>Ontem</Button>
          <Button onClick={() => setPeriod('week')}>Semana</Button>
        </ButtonGroup>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        <DateTimePicker
          label="Data Inicial"
          onChange={(newValue) => setDateFrom(newValue)}
          slotProps={{ textField: { size: 'small', sx: inputStyle } }}
        />
        <DateTimePicker
          label="Data Final"
          onChange={(newValue) => setDateTo(newValue)}
          slotProps={{ textField: { size: 'small', sx: inputStyle } }}
        />

        <Button 
          variant="contained" 
          onClick={onGenerateReport}
          disabled={!selectedDeviceId || loading}
          sx={{ 
            mt: 2, 
            background: 'linear-gradient(45deg, #00e5ff, #00b0ff)',
            color: '#000',
            fontWeight: 'bold',
            boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)'
          }}
        >
          {loading ? 'Processando...' : 'Gerar Relatório'}
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default HistoryPanel;