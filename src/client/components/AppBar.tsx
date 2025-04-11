import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import StreetcarIcon from '@mui/icons-material/DirectionsSubwayTwoTone';
import Link from '@mui/material/Link';
import { user } from '../../../types/models.ts';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import NavDrawer from './NavDrawer';
import Profile from './Profile';
//import Badge and NotificationsIcon for the notification bell
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
//Import the dynamic notifications hook
import { useBudgetNotifications } from './BudgetBuddy/BudgetNotificationContext';
interface MainAppBarProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
  user: user;
}
const setting = ['Profile']
const MainAppBar: React.FC<MainAppBarProps>= ({ setIsAuthenticated, user }) => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
   //state for notifications menu anchor element
   const [anchorElNotifications, setAnchorElNotifications] = React.useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

   // nav instructions to user preferences?
   const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
    //handlers for opening/closing notifications menu
    const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElNotifications(event.currentTarget);
    };
    
    const handleCloseNotifications = () => {
      setAnchorElNotifications(null);
    };
  const navigate = useNavigate();
  //get dynamic notifications from context instead of hardcoded notifications
  const { notifications } = useBudgetNotifications();
  
  const goToProfile = () => {
    navigate('/profile', {state: {from: '/', user} }); 
  };
  
  return(
    <AppBar position='static' sx={{ background: 'purple' }}>
    <Container maxWidth='xl' sx={{ sm: 'block' }}>
      <Toolbar disableGutters>
        <NavDrawer />
        <StreetcarIcon sx={{ color: 'black', display: { xs: 'none', md: 'flex', sm: 'block' }, mr: 1 }} />
        <Typography
          component='a'
          variant='h6'
          noWrap
          href='/'
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex', sm: 'block' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'white',
            textDecoration: 'none'
          }}
        >
          Let's Geaux
        </Typography>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open Preferences">
            <IconButton onClick={goToProfile} sx={{ p: 0 }}>
              <Avatar alt="Gata" src={`${user.profilePic}`} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {/* {setting.map((setting) => (
              <MenuItem key={setting} component='a' href='/profile' onClick={handleCloseUserMenu}>
                <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
              </MenuItem>
            ))} */}
          </Menu>
          {/* notification Bell Section */}
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            onClick={handleOpenNotifications}
            sx={{ ml: 2 }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            id="notification-menu"
            anchorEl={anchorElNotifications}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotifications}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {notifications.length === 0 ? (
              <MenuItem onClick={handleCloseNotifications}>No notifications</MenuItem>
            ) : (
              notifications.map((note, index) => (
                <MenuItem key={index} onClick={handleCloseNotifications}>
                  {/* display dynamic notification message */}
                  {note.message} 
                </MenuItem>
              ))
            )}
          </Menu>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
);
};

export default MainAppBar;