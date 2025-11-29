import React, { useState } from 'react';
import { 
  IconButton, Badge, Menu, Box, Typography, List, ListItem, ListItemText, 
  ListItemAvatar, Avatar, Button, Divider, Chip 
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useNotifications } from '../../context/NotificationContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

const getIcon = (type) => {
  switch (type) {
    case 'warning': return <WarningIcon sx={{ color: '#ff9800' }} />;
    case 'error': return <ErrorIcon sx={{ color: '#ff1744' }} />;
    case 'success': return <CheckCircleIcon sx={{ color: '#00e676' }} />;
    default: return <InfoIcon sx={{ color: '#00e5ff' }} />;
  }
};

const NotificationCenter = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: { width: 360, maxHeight: 500, bgcolor: 'background.paper', borderRadius: 2, mt: 1 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="subtitle1" fontWeight="bold">Notificações</Typography>
          {unreadCount > 0 && (
            <Button size="small" startIcon={<DoneAllIcon />} onClick={markAllAsRead}>
              Marcar lidas
            </Button>
          )}
        </Box>

        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
              <Typography variant="body2">Nenhuma notificação recente</Typography>
            </Box>
          ) : (
            notifications.map((notif) => (
              <React.Fragment key={notif.id}>
                <ListItem 
                  alignItems="flex-start" 
                  button 
                  onClick={() => markAsRead(notif.id)}
                  sx={{ 
                    bgcolor: notif.read ? 'transparent' : 'rgba(0, 229, 255, 0.05)',
                    borderLeft: notif.read ? 'none' : '4px solid #00e5ff'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                      {getIcon(notif.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle2" sx={{ fontWeight: notif.read ? 400 : 700 }}>
                          {notif.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dayjs(notif.date).fromNow()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.2 }}>
                        {notif.message}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          )}
        </List>
        
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Button fullWidth size="small">Ver histórico completo</Button>
        </Box>
      </Menu>
    </>
  );
};

export default NotificationCenter;