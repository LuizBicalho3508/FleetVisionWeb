import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import dayjs from 'dayjs';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  // Simulação de notificações iniciais
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Veículo Offline', message: 'ABC-1234 perdeu sinal há 1h', type: 'warning', read: false, date: new Date().toISOString() },
    { id: 2, title: 'Manutenção Vencida', message: 'Troca de óleo do XYZ-9876', type: 'error', read: false, date: dayjs().subtract(2, 'hour').toISOString() },
    { id: 3, title: 'Exportação Concluída', message: 'Seu relatório está pronto', type: 'success', read: true, date: dayjs().subtract(1, 'day').toISOString() },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification) => {
    const newNotif = {
      id: Date.now(),
      date: new Date().toISOString(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotif, ...prev]);
    
    // Dispara Toast visual também
    toast[newNotif.type || 'info'](newNotif.title, { description: newNotif.message });
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};