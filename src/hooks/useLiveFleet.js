import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socketService } from '../services/socketService';
import { toast } from 'sonner';
import dayjs from 'dayjs';

export const useLiveFleet = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Recupera o token salvo (o mesmo usado no apiClient)
    // Nota: O token do Traccar (Basic Auth ou Session) precisa ser passado corretamente.
    // Se estiver usando Basic Auth salvo no localStorage:
    const token = localStorage.getItem('traccar_auth_token'); 
    
    // Se for Basic Auth (Bearer), o socket do Traccar pode precisar de um cookie de sessão ou token de acesso.
    // Assumindo que sua API aceita o token no formato que você salvou.
    // Se o token for 'Basic ...', precisamos extrair apenas a parte necessária ou usar cookie.
    // Para simplificar, vamos tentar conectar. Se falhar, verifique a autenticação do seu backend.
    
    if (token) {
        // Remove 'Basic ' ou 'Bearer ' se necessário para passar na URL, ou passa direto
        // O Traccar padrão usa Cookie JSESSIONID, mas aceita ?token=SEU_TOKEN_API
        // Vamos assumir que você tem um token de API ou a sessão está via Cookie.
        // Se estiver via Cookie, o browser envia sozinho, basta conectar sem token na URL.
        // Tente conectar sem params primeiro se estiver no mesmo domínio, ou com token se for cross-domain.
        socketService.connect(token.replace('Basic ', '').replace('Bearer ', '')); 
    }

    const unsubscribe = socketService.subscribe((data) => {
      // 1. ATUALIZAR POSIÇÕES (Movimento no Mapa)
      if (data.positions) {
        queryClient.setQueryData(['vehicles'], (oldData) => {
          if (!oldData) return oldData;
          
          // Cria um mapa das novas posições para acesso rápido
          const updates = new Map(data.positions.map(p => [p.deviceId, p]));

          return oldData.map(device => {
            const update = updates.get(device.id);
            if (update) {
              return { 
                ...device, 
                ...update, // Mescla lat, lon, speed, attributes novos
                status: 'online', // Se chegou posição, está online
                lastUpdate: new Date().toISOString()
              };
            }
            return device;
          });
        });
      }

      // 2. ATUALIZAR DISPOSITIVOS (Status, Info)
      if (data.devices) {
        queryClient.setQueryData(['vehicles'], (oldData) => {
          if (!oldData) return oldData;
          const updates = new Map(data.devices.map(d => [d.id, d]));
          
          return oldData.map(device => {
            const update = updates.get(device.id);
            return update ? { ...device, ...update } : device;
          });
        });
      }

      // 3. ALERTAS EM TEMPO REAL (Toasts)
      if (data.events) {
        data.events.forEach(event => {
          // Ignora eventos antigos (opcional)
          if (dayjs(event.serverTime).isBefore(dayjs().subtract(1, 'minute'))) return;

          const deviceName = queryClient.getQueryData(['vehicles'])
            ?.find(d => d.id === event.deviceId)?.name || 'Veículo';

          switch (event.type) {
            case 'deviceOnline':
              toast.success(`${deviceName} está online`);
              break;
            case 'deviceOffline':
              toast.warning(`${deviceName} ficou offline`);
              break;
            case 'alarm':
              toast.error(`ALARME: ${event.attributes.alarm} - ${deviceName}`);
              break;
            case 'ignitionOn':
              toast.info(`${deviceName}: Ignição Ligada`);
              break;
            case 'geofenceEnter':
              toast.info(`${deviceName} entrou na cerca`);
              break;
            // Adicione outros tipos conforme necessário
            default:
              // Eventos genéricos não mostram toast para não poluir
              break;
          }
        });
      }
    });

    return () => {
      unsubscribe();
      // Opcional: desconectar ao sair da aplicação inteira, mas em SPA geralmente mantemos
      // socketService.disconnect(); 
    };
  }, [queryClient]);
};