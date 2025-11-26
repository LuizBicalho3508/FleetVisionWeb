// Local: src/pages/filial/VeiculosPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, CircularProgress, Tooltip, Chip, Avatar 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import apiClient from '../../api/apiClient';
import CreateVeiculoModal from '../../components/filial/CreateVeiculoModal';
import EditVehicleModal from '../../components/EditVehicleModal';

const VeiculosPage = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [devicesRes, usersRes] = await Promise.all([
        apiClient.get('/devices'),
        apiClient.get('/users')
      ]);
      setVeiculos(devicesRes.data);
      const userMap = {};
      usersRes.data.forEach(u => userMap[u.id] = u.name);
      setUsuarios(userMap);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSuccess = () => { setIsCreateModalOpen(false); setEditingVehicle(null); fetchData(); };

  const cellStyle = { color: '#e0e0e0', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '8px 16px' };
  const headerStyle = { fontWeight: 'bold', color: '#00e5ff', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.1)' };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#fff' }}>Frota Gerenciada</Typography>
        <Button 
          variant="contained" startIcon={<AddIcon />} onClick={() => setIsCreateModalOpen(true)}
          sx={{ borderRadius: 1 }}
        >
          Novo Veículo
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
        {loading ? <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box> : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyle}>VEÍCULO / PLACA</TableCell>
                <TableCell sx={headerStyle}>IMEI</TableCell>
                <TableCell sx={headerStyle}>PROPRIETÁRIO</TableCell>
                <TableCell sx={headerStyle}>STATUS</TableCell>
                <TableCell sx={headerStyle} align="right">AÇÕES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {veiculos.map((veiculo) => {
                // Tenta pegar ownerId do atributo salvo, ou infere (lógica simples para MVP)
                // O ideal é salvar ownerId no momento da criação (veja CreateVeiculoModal)
                const ownerName = usuarios[veiculo.attributes?.ownerId] || 'Não vinculado';
                
                return (
                  <TableRow key={veiculo.id} hover sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                    <TableCell sx={cellStyle}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: 'rgba(0,229,255,0.1)', color: '#00e5ff', width: 28, height: 28, borderRadius: 1 }}>
                           <DirectionsCarIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">{veiculo.name}</Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7 }}>{veiculo.attributes?.modelo}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={cellStyle}>{veiculo.uniqueId}</TableCell>
                    <TableCell sx={cellStyle}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#7c4dff' }}>
                         <PersonIcon fontSize="small" />
                         <Typography variant="body2">{ownerName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={cellStyle}>
                      <Chip 
                        label={veiculo.status === 'online' ? 'ONLINE' : 'OFFLINE'} 
                        color={veiculo.status === 'online' ? 'success' : 'error'} 
                        variant="outlined" size="small" sx={{borderRadius: 1, height: 20, fontSize: 10, fontWeight: 'bold'}}
                      />
                    </TableCell>
                    <TableCell sx={cellStyle} align="right">
                      <Tooltip title="Editar"><IconButton size="small" onClick={() => setEditingVehicle(veiculo)} sx={{ color: '#00e5ff' }}><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Excluir"><IconButton size="small" sx={{ color: '#ff1744' }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <CreateVeiculoModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={handleSuccess} />
      {editingVehicle && <EditVehicleModal open={!!editingVehicle} vehicle={editingVehicle} onClose={() => setEditingVehicle(null)} onSuccess={handleSuccess} />}
    </Box>
  );
};
export default VeiculosPage;