import Papa from 'papaparse';
import { adminApiClient } from '../api/apiClient';

/**
 * Processa um arquivo CSV e cria veículos em massa.
 * @param {File} file - Arquivo CSV selecionado
 * @param {Function} onProgress - Callback para atualizar progresso (0-100)
 * @returns {Promise<Object>} - Resultado { success: int, errors: array }
 */
export const importVehiclesFromCSV = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        let successCount = 0;
        let errors = [];
        const total = rows.length;

        for (let i = 0; i < total; i++) {
          const row = rows[i];
          
          // Mapeamento Básico (Ajuste conforme seu CSV)
          // Espera colunas: PLACA, IMEI, MODELO
          const vehicleData = {
            name: row.PLACA || row.nome || row.name,
            uniqueId: row.IMEI || row.imei || row.uniqueId,
            attributes: {
              modelo: row.MODELO || row.modelo,
              cor: row.COR || row.cor,
              ano: row.ANO || row.ano
            }
          };

          if (!vehicleData.name || !vehicleData.uniqueId) {
            errors.push({ row: i + 1, message: "Dados incompletos (Placa ou IMEI)" });
            continue;
          }

          try {
            await adminApiClient.post('/devices', vehicleData);
            successCount++;
          } catch (err) {
            errors.push({ row: i + 1, message: err.response?.data?.message || "Erro ao salvar" });
          }

          if (onProgress) onProgress(Math.round(((i + 1) / total) * 100));
        }

        resolve({ success: successCount, errors });
      },
      error: (err) => reject(err)
    });
  });
};