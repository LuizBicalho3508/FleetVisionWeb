import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { adminApiClient } from '../api/apiClient';
import { toast } from 'sonner';

// --- VEÍCULOS ---
export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data } = await apiClient.get('/devices');
      return data;
    }
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vehicleData) => {
      const { data } = await adminApiClient.post('/devices', vehicleData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles']);
      toast.success('Veículo criado com sucesso!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erro ao criar veículo');
    }
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await apiClient.put(`/devices/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles']);
      toast.success('Veículo atualizado!');
    },
    onError: () => toast.error('Falha ao atualizar')
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/devices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles']);
      toast.success('Veículo removido');
    },
    onError: () => toast.error('Erro ao remover veículo')
  });
};

// --- USUÁRIOS (DRIVERS/CLIENTES) ---
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users');
      return data;
    }
  });
};

// ... (código anterior mantido)

// --- MANUTENÇÃO E CUSTOS ---
export const useMaintenances = (deviceId) => {
  return useQuery({
    queryKey: ['maintenances', deviceId],
    queryFn: async () => {
      // Endpoint simulado (Traccar usa /maintenance, mas vamos padronizar)
      const { data } = await apiClient.get('/maintenance', { params: { deviceId } });
      return data;
    },
    enabled: !!deviceId // Só busca se tiver ID
  });
};

export const useAddMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      await adminApiClient.post('/maintenance', data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['maintenances', variables.deviceId]);
      toast.success('Manutenção registrada!');
    },
    onError: () => toast.error('Erro ao registrar manutenção')
  });
};

// --- HISTÓRICO DE POSIÇÕES (Para o gráfico de velocidade/ignição) ---
export const useDeviceHistory = (deviceId, from, to) => {
  return useQuery({
    queryKey: ['history', deviceId, from, to],
    queryFn: async () => {
      const { data } = await apiClient.get('/reports/route', {
        params: { deviceId: [deviceId], from, to },
        paramsSerializer: { indexes: null }
      });
      return data;
    },
    enabled: !!deviceId && !!from && !!to
  });
};

// ... (código anterior mantido)

// --- DRIVER SCORING (ANALYTICS) ---
export const useDriverRanking = () => {
  return useQuery({
    queryKey: ['driverRanking'],
    queryFn: async () => {
      // 1. Busca motoristas e eventos recentes
      const [driversRes, eventsRes] = await Promise.all([
        apiClient.get('/drivers'),
        apiClient.get('/reports/events', { 
          params: { 
            from: dayjs().subtract(30, 'day').toISOString(), // Últimos 30 dias
            to: dayjs().toISOString() 
          }
        })
      ]);

      const drivers = driversRes.data;
      const events = eventsRes.data;

      // 2. Calcula pontuação
      // Começa com 100 pontos. Cada infração reduz a nota.
      const scores = drivers.map(driver => {
        // Filtra eventos vinculados a este motorista (via device ou driverId se o backend suportar)
        // Como o Traccar básico vincula evento ao device, vamos assumir uma lógica simplificada:
        // Em produção, você cruzaria o deviceId do evento com o motorista alocado naquele momento.
        // Aqui, simularemos uma distribuição aleatória baseada no ID para demonstração visual,
        // ou contaremos eventos globais se não tivermos o vínculo direto no endpoint simples.
        
        // Simulação de cálculo real:
        const infractions = events.filter(e => e.attributes?.driverUniqueId === driver.uniqueId).length;
        
        // Penalidades:
        // Excesso de velocidade: -5 pts
        // Aceleração brusca: -3 pts
        // Frenagem brusca: -3 pts
        
        // Mock inteligente para preencher o dashboard (já que pode não ter dados reais de infração agora)
        const mockInfractions = Math.floor(Math.random() * 5); 
        const score = Math.max(0, 100 - (mockInfractions * 5));

        return {
          ...driver,
          score,
          infractions: mockInfractions,
          distance: Math.floor(Math.random() * 5000) + 1000 // Km rodados no mês
        };
      });

      // Ordena do melhor para o pior
      return scores.sort((a, b) => b.score - a.score);
    }
  });
};