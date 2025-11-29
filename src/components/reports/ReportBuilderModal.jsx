import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  FormControl, FormGroup, FormControlLabel, Checkbox, 
  Typography, Grid, Box, Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import dayjs from 'dayjs';
import { exportToPDF } from '../../utils/exportUtils'; // Usa o utilitário criado na Fase 1

const ReportBuilderModal = ({ open, onClose, data }) => {
  const [dates, setDates] = useState({ start: dayjs().startOf('month'), end: dayjs() });
  const [columns, setColumns] = useState({
    name: true,
    status: true,
    lastUpdate: true,
    speed: false,
    totalDistance: false,
    address: false
  });

  const handleToggle = (field) => {
    setColumns({ ...columns, [field]: !columns[field] });
  };

  const handleGenerate = () => {
    // 1. Filtrar Colunas Selecionadas
    const selectedCols = [
      { id: 'name', header: 'Veículo', active: columns.name },
      { id: 'status', header: 'Status', active: columns.status },
      { id: 'lastUpdate', header: 'Última Atualização', active: columns.lastUpdate },
      { id: 'speed', header: 'Velocidade (nós)', active: columns.speed },
      { id: 'totalDistance', header: 'Dist. Total (m)', active: columns.totalDistance },
      { id: 'address', header: 'Endereço', active: columns.address },
    ].filter(c => c.active);

    // 2. Mapear para o formato do exportToPDF
    const pdfColumns = selectedCols.map(c => ({ header: c.header, field: c.id }));
    
    // 3. Preparar Dados (Simples formatação)
    const pdfData = data.map(item => ({
      ...item,
      lastUpdate: dayjs(item.lastUpdate).format('DD/MM HH:mm'),
      // Adicione formatações extras aqui se necessário
    }));

    exportToPDF('Relatório Personalizado', pdfColumns, pdfData, 'relatorio_custom');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        Construtor de Relatórios
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>1. PERÍODO DOS DADOS</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <DatePicker label="Início" value={dates.start} onChange={v => setDates({...dates, start: v})} slotProps={{ textField: { size: 'small', fullWidth: true } }} />
            </Grid>
            <Grid item xs={6}>
              <DatePicker label="Fim" value={dates.end} onChange={v => setDates({...dates, end: v})} slotProps={{ textField: { size: 'small', fullWidth: true } }} />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>2. COLUNAS A INCLUIR</Typography>
          <FormGroup>
            <Grid container>
              <Grid item xs={6}><FormControlLabel control={<Checkbox checked={columns.name} onChange={() => handleToggle('name')} />} label="Nome do Veículo" /></Grid>
              <Grid item xs={6}><FormControlLabel control={<Checkbox checked={columns.status} onChange={() => handleToggle('status')} />} label="Status Online" /></Grid>
              <Grid item xs={6}><FormControlLabel control={<Checkbox checked={columns.lastUpdate} onChange={() => handleToggle('lastUpdate')} />} label="Data/Hora" /></Grid>
              <Grid item xs={6}><FormControlLabel control={<Checkbox checked={columns.speed} onChange={() => handleToggle('speed')} />} label="Velocidade" /></Grid>
              <Grid item xs={6}><FormControlLabel control={<Checkbox checked={columns.totalDistance} onChange={() => handleToggle('totalDistance')} />} label="Odômetro" /></Grid>
              <Grid item xs={6}><FormControlLabel control={<Checkbox checked={columns.address} onChange={() => handleToggle('address')} />} label="Endereço Atual" /></Grid>
            </Grid>
          </FormGroup>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleGenerate} variant="contained" startIcon={<PictureAsPdfIcon />}>
          Gerar PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportBuilderModal;