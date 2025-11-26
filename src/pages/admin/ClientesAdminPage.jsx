import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress 
} from '@mui/material';
import apiClient from '../../api/apiClient';

const ClientesAdminPage = () => {
  const [clientes, setClientes] = useState([]);
  const [filiaisMap, setFiliaisMap] = useState({}); // Novo estado para mapear ID -> Nome
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/users');
      const allUsers = response.data;

      // 1. Cria um mapa de ID -> Nome das Filiais
      const map = {};
      allUsers.forEach(user => {
        if (user.attributes?.role === 'filial') {
          map[user.id] = user.name;
        }
      });
      setFiliaisMap(map);

      // 2. Filtra apenas os clientes para exibir na tabela
      const filtered = allUsers.filter(u => u.attributes?.role === 'cliente');
      setClientes(filtered);

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const cellStyle = { color: '#e0e0e0', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px' };
  const headerStyle = { fontWeight: 'bold', color: '#7c4dff', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.1)' };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff', mb: 3 }}>
        Base Geral de Clientes
      </Typography>

      <TableContainer component={Paper} sx={{ 
        background: 'rgba(30, 41, 59, 0.4)', 
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 4 
      }}>
        {loading ? <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyle}>Nome</TableCell>
                <TableCell sx={headerStyle}>Email</TableCell>
                <TableCell sx={headerStyle}>Filial Responsável</TableCell>
                <TableCell sx={headerStyle}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center" sx={cellStyle}>Nenhum cliente encontrado.</TableCell></TableRow>
              ) : (
                clientes.map((cliente) => (
                  <TableRow key={cliente.id} hover sx={{ '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
                    <TableCell sx={cellStyle}>{cliente.name}</TableCell>
                    <TableCell sx={cellStyle}>{cliente.email}</TableCell>
                    
                    {/* CORREÇÃO AQUI: Busca o nome no mapa ou mostra 'Matriz' */}
                    <TableCell sx={cellStyle} style={{ color: '#00e5ff', fontWeight: '500' }}>
                       {cliente.attributes?.filialId 
                         ? (filiaisMap[cliente.attributes.filialId] || `Filial #${cliente.attributes.filialId}`) 
                         : 'Matriz'}
                    </TableCell>
                    
                    <TableCell sx={cellStyle}>
                      <Chip 
                        label={!cliente.disabled ? "Ativo" : "Bloqueado"} 
                        color={!cliente.disabled ? "success" : "error"} 
                        variant="outlined" 
                        size="small"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default ClientesAdminPage;