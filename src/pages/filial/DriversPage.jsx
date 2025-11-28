import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ListIcon from '@mui/icons-material/List';
import DriverRankCard from '../../components/drivers/DriverRankCard';
import CreateDriverModal from '../../components/filial/CreateDriverModal';
import { useDriverRanking } from '../../hooks/useFleetData'; // Novo hook
import { CircularProgress } from '@mui/material';

// Tabela simples (para a aba de lista)
import RichTable from '../../components/common/RichTable';

const DriversPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: rankedDrivers = [], isLoading } = useDriverRanking();

  if (isLoading) return <Box sx={{display:'flex', justifyContent:'center', mt:10}}><CircularProgress/></Box>;

  // Colunas para a tabela simples
  const columns = [
    { id: 'name', label: 'Nome' },
    { id: 'uniqueId', label: 'Identificador' },
    { id: 'score', label: 'Score', numeric: true },
    { id: 'infractions', label: 'Infrações', numeric: true }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>Gestão de Motoristas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsCreateOpen(true)}>Novo Motorista</Button>
      </Box>

      <Paper sx={{ bgcolor: 'rgba(30,41,59,0.4)', mb: 3, borderRadius: 2 }}>
        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} textColor="primary" indicatorColor="primary">
          <Tab icon={<EmojiEventsIcon />} label="Ranking de Performance" iconPosition="start" />
          <Tab icon={<ListIcon />} label="Lista Cadastral" iconPosition="start" />
        </Tabs>
      </Paper>

      {tabIndex === 0 && (
        <Grid container spacing={3}>
          {/* TOP 3 PODIUM (Visual) */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%', background: 'linear-gradient(180deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)', border: '1px solid rgba(255,215,0,0.3)' }}>
              <Typography variant="h6" sx={{ color: '#ffd700', mb: 2 }}>🏆 Melhor Motorista</Typography>
              {rankedDrivers[0] && (
                <Box>
                  <Avatar sx={{ width: 100, height: 100, margin: '0 auto', mb: 2, bgcolor: '#ffd700', color: '#000', fontSize: 40, border: '4px solid #fff' }}>
                    {rankedDrivers[0].name.charAt(0)}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">{rankedDrivers[0].name}</Typography>
                  <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>Score: {rankedDrivers[0].score}/100</Typography>
                  <Chip label="Excelente" color="success" />
                </Box>
              )}
            </Paper>
          </Grid>

          {/* LISTA DE RANKING COMPLETA */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>Classificação Geral</Typography>
            {rankedDrivers.map((driver, index) => (
              <DriverRankCard key={driver.id} driver={driver} rank={index + 1} />
            ))}
          </Grid>
        </Grid>
      )}

      {tabIndex === 1 && (
        <RichTable 
          title="Base de Motoristas"
          data={rankedDrivers}
          columns={columns}
        />
      )}

      <CreateDriverModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={() => window.location.reload()} />
    </Box>
  );
};

export default DriversPage;