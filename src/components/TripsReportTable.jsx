// Local: src/components/TripsReportTable.jsx

import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const formatDateTime = (iso) => iso ? new Date(iso).toLocaleString('pt-BR') : '-';
const formatDuration = (ms) => {
  if (!ms) return '0s';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};
const formatDistance = (m) => m ? (m / 1000).toFixed(2) : '0.00';

const TripsReportTable = ({ reportData }) => {
  if (!reportData || reportData.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
        <DirectionsCarIcon sx={{ fontSize: 60, mb: 2, color: '#fff' }} />
        <Typography sx={{ color: '#fff' }}>Nenhum relatório gerado ou dados não encontrados.</Typography>
      </Box>
    );
  }

  // Estilos Glass para Tabela
  const headerStyle = { fontWeight: 'bold', color: '#00e5ff', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.1)' };
  const cellStyle = { color: '#e0e0e0', borderBottom: '1px solid rgba(255,255,255,0.05)' };

  return (
    <TableContainer component={Paper} sx={{ 
        maxHeight: '100%', 
        background: 'rgba(30, 41, 59, 0.4)', 
        backdropFilter: 'blur(16px)',
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={headerStyle}>Início</TableCell>
            <TableCell sx={headerStyle}>Partida</TableCell>
            <TableCell sx={headerStyle}>Fim</TableCell>
            <TableCell sx={headerStyle}>Chegada</TableCell>
            <TableCell sx={headerStyle} align="right">Duração</TableCell>
            <TableCell sx={headerStyle} align="right">Distância (km)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportData.map((trip, index) => (
            <TableRow key={index} hover sx={{ '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
              <TableCell sx={cellStyle}>{formatDateTime(trip.startTime)}</TableCell>
              <TableCell sx={{ ...cellStyle, maxWidth: 200 }}>
                <Typography noWrap variant="body2">{trip.startAddress || '-'}</Typography>
              </TableCell>
              <TableCell sx={cellStyle}>{formatDateTime(trip.endTime)}</TableCell>
              <TableCell sx={{ ...cellStyle, maxWidth: 200 }}>
                <Typography noWrap variant="body2">{trip.endAddress || '-'}</Typography>
              </TableCell>
              <TableCell sx={{ ...cellStyle, color: '#fff', fontWeight: 'bold' }} align="right">
                {formatDuration(trip.duration)}
              </TableCell>
              <TableCell sx={{ ...cellStyle, color: '#00e676' }} align="right">
                {formatDistance(trip.distance)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TripsReportTable;