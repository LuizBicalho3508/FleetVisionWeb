// Local: src/pages/admin/FinancialPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, CircularProgress, 
  TextField, InputAdornment, Chip 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { adminApiClient } from '../../api/apiClient';

const FinancialPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, devicesRes] = await Promise.all([
        adminApiClient.get('/users'),
        adminApiClient.get('/devices')
      ]);

      const allUsers = usersRes.data;
      const allDevices = devicesRes.data;
      const filiais = allUsers.filter(u => u.attributes?.role === 'filial');

      const processedRows = filiais.map(filial => {
        // Lógica de contagem
        const clients = allUsers.filter(u => u.attributes?.role === 'cliente' && String(u.attributes?.filialId) === String(filial.id));
        const clientIds = clients.map(c => String(c.id));
        const activeDevices = allDevices.filter(d => 
          clientIds.includes(String(d.attributes?.ownerId)) && !d.disabled
        ).length;

        const currentPrice = parseFloat(filial.attributes?.pricePerDevice || 0);

        return {
          ...filial, // Mantém dados originais do usuário
          activeDevices, // Dado calculado (não existe no banco)
          currentPrice,
          estimatedRevenue: activeDevices * currentPrice
        };
      });

      setRows(processedRows);
      
      const initialPrices = {};
      processedRows.forEach(r => initialPrices[r.id] = r.currentPrice);
      setPrices(initialPrices);

    } catch (error) {
      console.error("Erro ao carregar financeiro:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePriceChange = (id, value) => {
    setPrices(prev => ({ ...prev, [id]: value }));
  };

  const handleSavePrice = async (filialRow) => {
    const newPrice = prices[filialRow.id];
    try {
      // --- CORREÇÃO AQUI ---
      // Criamos um objeto limpo apenas com os dados que o Traccar aceita
      const userPayload = {
        id: filialRow.id,
        name: filialRow.name,
        email: filialRow.email,
        login: filialRow.login,
        phone: filialRow.phone,
        readonly: filialRow.readonly,
        administrator: filialRow.administrator,
        map: filialRow.map,
        latitude: filialRow.latitude,
        longitude: filialRow.longitude,
        zoom: filialRow.zoom,
        disabled: filialRow.disabled,
        expirationTime: filialRow.expirationTime,
        deviceLimit: filialRow.deviceLimit,
        userLimit: filialRow.userLimit,
        deviceReadonly: filialRow.deviceReadonly,
        limitCommands: filialRow.limitCommands,
        disableReports: filialRow.disableReports,
        fixedEmail: filialRow.fixedEmail,
        poiLayer: filialRow.poiLayer,
        attributes: {
          ...filialRow.attributes, // Mantém outros atributos (role, contractStart, etc)
          pricePerDevice: newPrice // Atualiza o preço
        }
      };

      await adminApiClient.put(`/users/${filialRow.id}`, userPayload);
      alert(`Preço da filial ${filialRow.name} atualizado para R$ ${newPrice}!`);
      fetchData(); 
    } catch (err) {
      console.error("Erro detalhado:", err);
      alert("Erro ao salvar preço. Verifique o console.");
    }
  };

  // Estilos
  const cellStyle = { color: '#e0e0e0', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px' };
  const headerStyle = { fontWeight: 'bold', color: '#00e5ff', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.1)' };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff', mb: 3 }}>
        Gestão Financeira
      </Typography>

      <TableContainer component={Paper} sx={{ background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1 }}>
        {loading ? <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyle}>FILIAL</TableCell>
                <TableCell sx={headerStyle} align="center">VEÍCULOS ATIVOS</TableCell>
                <TableCell sx={headerStyle} align="right">PREÇO / VEÍCULO</TableCell>
                <TableCell sx={headerStyle} align="right">FATURAMENTO MENSAL</TableCell>
                <TableCell sx={headerStyle} align="center">AÇÃO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
                  <TableCell sx={cellStyle}>
                    <Typography variant="body2" fontWeight="bold">{row.name}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>{row.email}</Typography>
                  </TableCell>
                  <TableCell sx={cellStyle} align="center">
                    <Chip label={row.activeDevices} sx={{ bgcolor: 'rgba(0, 229, 255, 0.2)', color: '#00e5ff', fontWeight: 'bold', borderRadius: 1 }} />
                  </TableCell>
                  <TableCell sx={cellStyle} align="right">
                    <TextField
                      type="number" size="small"
                      value={prices[row.id]}
                      onChange={(e) => handlePriceChange(row.id, e.target.value)}
                      InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{color:'#aaa'}}>R$</Typography></InputAdornment> }}
                      sx={{ width: 110, '& input': { color: '#fff', textAlign: 'right' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
                    />
                  </TableCell>
                  <TableCell sx={cellStyle} align="right">
                    <Typography sx={{ color: '#00e676', fontWeight: 'bold' }}>
                      R$ {(prices[row.id] * row.activeDevices).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                  </TableCell>
                  <TableCell sx={cellStyle} align="center">
                    <IconButton onClick={() => handleSavePrice(row)} sx={{ color: '#00e5ff' }}><SaveIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default FinancialPage;