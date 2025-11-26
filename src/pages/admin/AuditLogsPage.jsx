import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress } from '@mui/material';
import { adminApiClient } from '../../api/apiClient';
import dayjs from 'dayjs';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await adminApiClient.get('/audit-logs');
        setLogs(res.data);
      } catch (error) {
        console.error("Erro ao buscar logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const headerStyle = { fontWeight: 'bold', color: '#00e5ff', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.1)' };
  const cellStyle = { color: '#e0e0e0', borderBottom: '1px solid rgba(255,255,255,0.05)' };

  // Cores por ação
  const getActionColor = (action) => {
    if (action === 'CRIAR') return 'success';
    if (action === 'EDITAR') return 'warning';
    if (action === 'DELETAR') return 'error';
    return 'default';
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff', mb: 3 }}>Auditoria do Sistema</Typography>
      
      <TableContainer component={Paper} sx={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1 }}>
        {loading ? <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box> : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyle}>DATA/HORA</TableCell>
                <TableCell sx={headerStyle}>USUÁRIO</TableCell>
                <TableCell sx={headerStyle}>AÇÃO</TableCell>
                <TableCell sx={headerStyle}>ALVO</TableCell>
                <TableCell sx={headerStyle}>DETALHES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} hover sx={{ '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
                  <TableCell sx={cellStyle}>{dayjs(log.timestamp).format('DD/MM/YYYY HH:mm')}</TableCell>
                  <TableCell sx={{...cellStyle, color: '#fff', fontWeight:'bold'}}>{log.user}</TableCell>
                  <TableCell sx={cellStyle}>
                    <Chip label={log.action} color={getActionColor(log.action)} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell sx={cellStyle}>{log.target}</TableCell>
                  <TableCell sx={{...cellStyle, maxWidth: 300, fontSize:'0.75rem', color:'#aaa'}}>
                    {JSON.stringify(log.details)}
                  </TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && <TableRow><TableCell colSpan={5} align="center" sx={cellStyle}>Nenhum registro encontrado.</TableCell></TableRow>}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default AuditLogsPage;