import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { IconButton, Menu, MenuItem, Tooltip, ListItemIcon, ListItemText } from '@mui/material';

const HeaderMenu = ({ title, icon, menuItems }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title={title}>
        <IconButton color="inherit" onClick={handleClick}>
          {icon}
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {menuItems.map((item, index) => (
          <MenuItem key={index} component={RouterLink} to={item.path} onClick={handleClose}>
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default HeaderMenu;