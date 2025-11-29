export const formatCurrency = (value) => {
  if (isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const calculateFleetStatus = (vehicles) => {
  if (!vehicles || vehicles.length === 0) return { online: 0, offline: 0, utilization: 0 };
  
  const online = vehicles.filter(v => v.status === 'online').length;
  const moving = vehicles.filter(v => v.speed > 0).length;
  
  return {
    online,
    offline: vehicles.length - online,
    utilization: Math.round((moving / vehicles.length) * 100)
  };
};