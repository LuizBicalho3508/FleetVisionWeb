// Local: src/pages/admin/FiliaisPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Chip, CircularProgress, Tooltip, Stack 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import { adminApiClient } from '../../api/apiClient'; // <--- MUDANÇA 1: Usar adminApiClient
import CreateFilialModal from '../../components/admin/CreateFilialModal';
import EditFilialModal from '../../components/admin/EditFilialModal';
import dayjs from 'dayjs';

const FiliaisPage = () => {
  const [filiais, setFiliais] = useState([]);
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingFilial, setEditingFilial] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // MUDANÇA 2: Usar adminApiClient para buscar a visão global ("Deus")
      const [usersRes, devicesRes] = await Promise.all([
        adminApiClient.get('/users'),
        adminApiClient.get('/devices')
      ]);

      setUsers(usersRes.data);
      setDevices(devicesRes.data);
      setFiliais(usersRes.data.filter(user => user.attributes?.role === 'filial'));

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Lógica de Contagem (Dispositivos Ativos)
  const getStats = (filialId) => {
    // 1. Clientes da filial
    const filialClients = users.filter(u => 
        u.attributes?.role === 'cliente' && 
        String(u.attributes?.filialId) === String(filialId)
    );
    
    // 2. IDs dos clientes
    const clientIds = filialClients.map(c => String(c.id));

    // 3. Dispositivos desses clientes
    const filialDevices = devices.filter(d => {
        const ownerId = d.attributes?.ownerId;
        return ownerId && clientIds.includes(String(ownerId));
    });
    
    // 4. Ativos
    const activeDevices = filialDevices.filter(d => !d.disabled);

    return {
      clientsCount: filialClients.length,
      devicesCount: activeDevices.length
    };
  };

  const handleModalSuccess = () => {
    setIsCreateModalOpen(false);
    setEditingFilial(null);
    fetchData();
  };

  const handleToggleSuspend = async (filial) => {
    if(!window.confirm(`Deseja ${filial.disabled ? 'ativar' : 'suspender'} esta filial?`)) return;
    try {
      await adminApiClient.put(`/users/${filial.id}`, { ...filial, disabled: !filial.disabled });
      fetchData();
    } catch(err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Tem certeza?")) return;
    try {
        await adminApiClient.delete(`/users/${id}`);
        fetchData();
    } catch(err) { console.error(err); }
  }

  const checkContract = (end) => {
    if (!end) return { label: 'Indefinido', color: 'default' };
    const days = dayjs(end).diff(dayjs(), 'day');
    if (days < 0) return { label: 'Vencido', color: 'error' };
    if (days < 30) return { label: 'Vence em breve', color: 'warning' };
    return { label: 'Vigente', color: 'success' };
  };

  const cellStyle = { color: '#e0e0e0', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px' };
  const headerStyle = { fontWeight: 'bold', color: '#00e5ff', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.1)' };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>Gestão de Filiais</Typography>
        <Button 
          variant="contained" startIcon={<AddIcon />} onClick={() => setIsCreateModalOpen(true)}
          sx={{ borderRadius: 1 }}
        >
          Nova Filial
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1 }}>
        {loading ? <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyle}>FILIAL</TableCell>
                <TableCell sx={headerStyle}>CLIENTES</TableCell>
                <TableCell sx={headerStyle}>DISPOSITIVOS ATIVOS</TableCell>
                <TableCell sx={headerStyle}>CONTRATO</TableCell>
                <TableCell sx={headerStyle}>STATUS</TableCell>
                <TableCell sx={headerStyle} align="right">AÇÕES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filiais.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={cellStyle}>Nenhuma filial encontrada.</TableCell></TableRow>
              ) : (
                filiais.map((filial) => {
                  const stats = getStats(filial.id);
                  const contractEnd = filial.attributes?.contractEnd;
                  const contractStatus = checkContract(contractEnd);
                  const paymentStatus = filial.attributes?.paymentStatus || 'ativo';

                  return (
                    <TableRow key={filial.id} hover sx={{ '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
                      <TableCell sx={cellStyle}>
                        <Box>
                            <Typography variant="body2" fontWeight="bold">{filial.name}</Typography>
                            <Typography variant="caption" sx={{opacity:0.7}}>{filial.email}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={cellStyle}><Chip label={stats.clientsCount} size="small" sx={{bgcolor: 'rgba(124, 77, 255, 0.2)', color: '#7c4dff', fontWeight:'bold', borderRadius: 1}} /></TableCell>
                      <TableCell sx={cellStyle}><Chip label={stats.devicesCount} size="small" sx={{bgcolor: 'rgba(0, 229, 255, 0.2)', color: '#00e5ff', fontWeight:'bold', borderRadius: 1}} /></TableCell>
                      <TableCell sx={cellStyle}>
                         <Box sx={{display:'flex', flexDirection:'column'}}>
                            <Typography variant="body2" sx={{fontSize:'0.8rem'}}>
                                {contractEnd ? dayjs(contractEnd).format('DD/MM/YYYY') : '-'}
                            </Typography>
                            {contractEnd && (
                                <Typography variant="caption" sx={{color: contractStatus.color === 'error' ? '#ff1744' : '#66bb6a'}}>
                                    {contractStatus.label}
                                </Typography>
                            )}
                         </Box>
                      </TableCell>
                      <TableCell sx={cellStyle}>
                        <Stack direction="row" spacing={1}>
                            <Chip label={filial.disabled ? "Suspensa" : "Ativa"} color={filial.disabled ? "error" : "success"} variant="outlined" size="small" sx={{borderRadius: 1, height: 20, fontSize: 10}} />
                            {paymentStatus === 'inadimplente' && !filial.disabled && <Chip label="Inadimplente" color="warning" size="small" sx={{borderRadius: 1, height: 20, fontSize: 10}} />}
                        </Stack>
                      </TableCell>
                      <TableCell sx={cellStyle} align="right">
                        <Tooltip title="Editar"><IconButton size="small" sx={{ color: '#fff' }} onClick={() => setEditingFilial(filial)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title={filial.disabled ? "Ativar" : "Suspender"}><IconButton size="small" sx={{ color: filial.disabled ? '#66bb6a' : '#ff9100' }} onClick={() => handleToggleSuspend(filial)}><BlockIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Excluir"><IconButton size="small" sx={{ color: '#ff1744' }} onClick={() => handleDelete(filial.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <CreateFilialModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={handleModalSuccess} />
      {editingFilial && <EditFilialModal open={!!editingFilial} filial={editingFilial} onClose={() => setEditingFilial(null)} onSuccess={handleModalSuccess} />}
    </Box>
  );
};

export default FiliaisPage;