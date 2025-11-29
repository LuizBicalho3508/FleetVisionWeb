import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import dayjs from 'dayjs';

const CommentsWidget = ({ targetId }) => {
  const [comments, setComments] = useState([
    { id: 1, user: 'Admin', text: 'Veículo precisa trocar pneus em breve.', date: dayjs().subtract(2, 'day').toISOString() },
    { id: 2, user: 'Gestor', text: 'Motorista relatou barulho no freio.', date: dayjs().subtract(4, 'hour').toISOString() }
  ]);
  const [newComment, setNewComment] = useState('');

  const handleSend = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      user: 'Eu', // Em prod, pegar do AuthContext
      text: newComment,
      date: new Date().toISOString()
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>Notas & Observações</Typography>
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2, p: 1 }}>
        <List>
          {comments.map((c) => (
            <React.Fragment key={c.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>{c.user.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="subtitle2" color="#fff">{c.user}</Typography>
                      <Typography variant="caption" color="text.secondary">{dayjs(c.date).format('DD/MM HH:mm')}</Typography>
                    </Box>
                  }
                  secondary={<Typography variant="body2" color="#ccc">{c.text}</Typography>}
                />
              </ListItem>
              <Divider variant="inset" component="li" sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
            </React.Fragment>
          ))}
        </List>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField 
          fullWidth 
          size="small" 
          placeholder="Adicionar nota..." 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ '& input': { color: '#fff' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
        />
        <Button variant="contained" onClick={handleSend} sx={{ minWidth: 50 }}>
          <SendIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
};

export default CommentsWidget;