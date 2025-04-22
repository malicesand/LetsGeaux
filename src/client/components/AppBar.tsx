import React, { useState, useEffect } from 'react';
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
import { useUser } from './UserContext';
//import Badge and NotificationsIcon for the notification bell
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
//Import the dynamic notifications hook
import { useBudgetNotifications } from './BudgetBuddy/BudgetNotificationContext';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import newLogo from '../theme/cropedLogo.png'
interface MainAppBarProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
  user: user;
}

const MainAppBar: React.FC<MainAppBarProps> = ({ setIsAuthenticated, user }) => {
  const { localUser } = useUser();
  const navigate = useNavigate();
  //get dynamic notifications from context instead of hardcoded notifications
  const { notifications } = useBudgetNotifications();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  //state for notifications menu anchor element
  const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);
  const [readItems, setReadItems] = useState<Set<number>>(new Set());

  const [animateBell, setAnimateBell] = useState(false);
  useEffect(() => {
    if (notifications.length > 0) {
      setAnimateBell(true);
      const timeout = setTimeout(() => setAnimateBell(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [notifications]);
  //handlers for opening/closing notifications menu
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  // nav instructions to user preferences?
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
    // reset unread when closing the menu
    setTimeout(() => {
      setReadItems(new Set(notifications.map((_, i) => i)));
    }, 250);
  };

  const handleMarkAsRead = (index: number) => {
    setReadItems(prev => new Set(prev).add(index));
    handleCloseNotifications();
  };

  const handleClearAll = () => {
    setReadItems(new Set(notifications.map((_, i) => i)));
    handleCloseNotifications();
  };

  const goToProfile = () => {
    navigate('/profile', { state: { from: '/', user } });
  };

  const unreadCount = notifications.length - readItems.size;

  return (
    <AppBar position='static' sx={{ border: '4px solid black', borderRadius: 4 }}>
      <Container maxWidth='xl' sx={{ px: 0 }}>
        <Toolbar disableGutters >
          <NavDrawer />
          <Box
            className="logo"
            sx={{
              display: 'flex',
              mr: 1,
              p: 0,
              m: 0,
            }}
          > <img src={newLogo} alt="Logo" style={{
            height: '40px',
            width: 'auto',
            display: 'block',
            margin: 0,
            padding: 0,
          }}
            /></Box>
          {/* <StreetcarIcon sx={{ color: 'black', display: { xs: 'none', md: 'flex', sm: 'block' }, mr: 1 }} /> */}
          <Typography
            variant='h3'
            noWrap
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex', sm: 'block' },
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none'
            }}
          >
            Let's Geaux
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            onClick={handleOpenNotifications}
            sx={{ ml: 2, animation: animateBell ? 'bounce 4s ease' : 'none' }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <style>{`
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
              }
              40% {
                transform: translateY(-8px);
              }
              60% {
                transform: translateY(-4px);
              }
            }
          `}</style>

          <Menu
            id="notification-menu"
            anchorEl={anchorElNotifications}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotifications}
            PaperProps={{ sx: { width: 300, p: 1, border: '4px solid black' } }}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Typography variant="h6" sx={{ px: 2, pt: 1 }}>Notifications</Typography>
            <Divider sx={{ mb: 1 }} />

            {notifications.length === 0 || readItems.size === notifications.length ? (
              <MenuItem disabled>No new notifications.</MenuItem>
            ) : (
              notifications.slice(0, 5).map((note, i) => (
                !readItems.has(i) && (
                  <MenuItem key={i} onClick={() => handleMarkAsRead(i)}>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={note.message}
                      secondary={new Date(note.timestamp).toLocaleString()}
                    />
                  </MenuItem>
                )
              ))
            )}

            {notifications.length > 0 && (
              <Box px={2} mt={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
              </Box>
            )}
          </Menu>

          <Tooltip title="Open Preferences">
            <IconButton onClick={goToProfile} sx={{ p: 0, ml: 2 }}>
              <Avatar alt="User Avatar" src={`${localUser?.profilePic}`} />
            </IconButton>
          </Tooltip>

          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {/* {setting.map((setting) => (
              <MenuItem key={setting} component='a' href='/profile' onClick={handleCloseUserMenu}>
                <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
              </MenuItem>
            ))} */}
            {/* future profile settings */}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainAppBar;
