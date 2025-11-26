import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Box, Paper } from '@mui/material';
import apiClient from '../api/apiClient';
import dayjs from 'dayjs';
import HistoryPanel from '../components/HistoryPanel'; // Certifique-se de ter esse componente ou crie um simples
import MapComponent from '../components/MapComponent';
import TripsReportTable from '../components/TripsReportTable'; // Idem

const ClientReportsPage = () => {
  const { liveDevices } = useOutletContext();
  const [reportType, setReportType] = useState('route');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Estados para filtros (simplificado)
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

  return (
    <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 120px)' }}>
      <Paper sx={{ 
        width: 350, p: 2, display: 'flex', flexDirection: 'column', 
        background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', borderRadius: 4 
      }}>
        {/* Aqui você reutiliza o HistoryPanel ou cria os inputs diretamente */}
        <HistoryPanel 
          devices={liveDevices} 
          selectedDeviceId={selectedDeviceId} setSelectedDeviceId={setSelectedDeviceId}
          dateFrom={dateFrom} setDateFrom={setDateFrom}
          dateTo={dateTo} setDateTo={setDateTo}
          reportType={reportType} setReportType={setReportType}
          onGenerateReport={handleGenerate} loading={loading}
        />
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