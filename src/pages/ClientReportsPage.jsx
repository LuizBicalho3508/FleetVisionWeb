import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Box, Paper, Button, ButtonGroup } from '@mui/material';
import apiClient from '../api/apiClient';
import dayjs from 'dayjs';
import HistoryPanel from '../components/HistoryPanel';
import MapComponent from '../components/MapComponent';
import TripsReportTable from '../components/TripsReportTable';
import { exportToExcel, exportToPDF } from '../utils/exportUtils'; // <--- Importamos o utilitário

// Ícones
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';

const ClientReportsPage = () => {
  const { liveDevices } = useOutletContext();
  const [reportType, setReportType] = useState('route');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [dateFrom, setDateFrom] = useState(dayjs().startOf('day'));
  const [dateTo, setDateTo] = useState(dayjs().endOf('day'));

  const handleGenerate = async () => {
    setLoading(true);
    setReportData([]);
    try {
      const endpoint = reportType === 'route' ? '/reports/route' : '/reports/trips';
      const res = await apiClient.get(endpoint, {
        params: { deviceId: [selectedDeviceId], from: dateFrom.toISOString(), to: dateTo.toISOString() },
        paramsSerializer: { indexes: null }
      });
      setReportData(res.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar relatório");
    } finally {
      setLoading(false);
    }
  };

  // --- FUNÇÕES DE EXPORTAÇÃO ---
  const handleExportPDF = () => {
    if (reportData.length === 0) return;
    
    if (reportType === 'trips') {
      const columns = [
        { header: 'Início', field: 'startTime' },
        { header: 'Fim', field: 'endTime' },
        { header: 'Duração', field: 'durationFormatted' }, // Precisaria formatar antes
        { header: 'Distância (km)', field: 'distanceKm' },
        { header: 'Endereço Partida', field: 'startAddress' }
      ];
      
      // Prepara dados formatados
      const formattedData = reportData.map(trip => ({
        ...trip,
        startTime: dayjs(trip.startTime).format('DD/MM HH:mm'),
        endTime: dayjs(trip.endTime).format('DD/MM HH:mm'),
        durationFormatted: `${Math.floor(trip.duration/60000)} min`,
        distanceKm: (trip.distance / 1000).toFixed(2)
      }));

      exportToPDF('Relatório de Viagens', columns, formattedData, 'viagens');
    }
  };

  const handleExportExcel = () => {
    if (reportData.length === 0) return;
    
    // Simplifica dados para Excel
    const dataToExport = reportData.map(r => ({
        ...r,
        deviceId: undefined // Remove campos técnicos
    }));
    
    exportToExcel(dataToExport, 'relatorio_frota');
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 120px)' }}>
      <Paper sx={{ 
        width: 350, p: 2, display: 'flex', flexDirection: 'column', 
        background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', borderRadius: 4 
      }}>
        <HistoryPanel 
          devices={liveDevices} 
          selectedDeviceId={selectedDeviceId} setSelectedDeviceId={setSelectedDeviceId}
          dateFrom={dateFrom} setDateFrom={setDateFrom}
          dateTo={dateTo} setDateTo={setDateTo}
          reportType={reportType} setReportType={setReportType}
          onGenerateReport={handleGenerate} loading={loading}
        />

        {/* --- BOTÕES DE EXPORTAÇÃO (Só aparecem se tiver dados) --- */}
        {reportData.length > 0 && reportType === 'trips' && (
          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="subtitle2" sx={{ color: '#aaa', mb: 1 }}>EXPORTAR RESULTADOS</Typography>
            <ButtonGroup fullWidth>
              <Button startIcon={<PictureAsPdfIcon />} onClick={handleExportPDF} color="error" variant="outlined">PDF</Button>
              <Button startIcon={<TableViewIcon />} onClick={handleExportExcel} color="success" variant="outlined">Excel</Button>
            </ButtonGroup>
          </Box>
        )}
      </Paper>

      <Paper sx={{ flexGrow: 1, borderRadius: 4, overflow: 'hidden' }}>
        {reportType === 'route' ? (
          <MapComponent devices={[]} routeData={reportData} />
        ) : (
          <TripsReportTable reportData={reportData} />
        )}
      </Paper>
    </Box>
  );
};

export default ClientReportsPage;