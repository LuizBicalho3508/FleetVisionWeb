import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Avatar, CircularProgress, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import BadgeIcon from '@mui/icons-material/Badge';
import apiClient, { adminApiClient } from '../../api/apiClient';
import CreateDriverModal from '../../components/filial/CreateDriverModal';

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/drivers');
      setDrivers(response.data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDrivers(); }, [fetchDrivers]);

  const handleDelete = async (id) => {
    if(window.confirm("Excluir?")) {
      await adminApiClient.delete(`/drivers/${id}`);
      fetchDrivers();
    }
  };

  const style = { color: '#e0e0e0', borderBottom: '1px solid rgba(255,255,255,0.1)' };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>Motoristas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsCreateOpen(true)} sx={{ borderRadius: 1 }}>Novo</Button>
      </Box>
      <TableContainer component={Paper} sx={{ background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1 }}>
        {loading ? <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...style, color: '#00e5ff', fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ ...style, color: '#00e5ff', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ ...style, color: '#00e5ff', fontWeight: 'bold' }} align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers.map((d) => (
                <TableRow key={d.id} hover sx={{ '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
                  <TableCell sx={style}><Box sx={{display:'flex', alignItems:'center', gap:2}}><Avatar sx={{bgcolor:'rgba(0,229,255,0.1)', color:'#00e5ff'}}><BadgeIcon/></Avatar>{d.name}</Box></TableCell>
                  <TableCell sx={style}>{d.uniqueId}</TableCell>
                  <TableCell sx={style} align="right"><IconButton onClick={() => handleDelete(d.id)} sx={{color:'#ff1744'}}><DeleteIcon/></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <CreateDriverModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={() => { setIsCreateOpen(false); fetchDrivers(); }} />
    </Box>
  );
};
export default DriversPage;